// Dynamic XML sitemap served at /sitemap.xml (wired up in src/server.ts).
// Static pages are listed here; blog posts come live from WordPress, so a new
// article appears in the sitemap within 15 minutes of being published, with no
// rebuild or redeploy.
import { absoluteUrl } from "./site";

const CMS_URL = "https://cms.forgexd.co.za";
const CACHE_TTL_MS = 15 * 60 * 1000;
const PAGE_SIZE = 100;
const MAX_PAGES = 20;

// Every indexable static route. Add new pages here when they are created.
const STATIC_PAGES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services/web-design-development", changefreq: "monthly", priority: "0.9" },
  { path: "/services/ux-ui-design", changefreq: "monthly", priority: "0.9" },
  { path: "/services/digital-business-launch-package", changefreq: "monthly", priority: "0.9" },
  { path: "/services/seo-content-strategy", changefreq: "monthly", priority: "0.9" },
  { path: "/tools/free-on-page-seo-audit-tool", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

type SitemapPost = {
  slug: string;
  date_gmt?: string;
  modified_gmt?: string;
  title?: { rendered?: string };
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url?: string }> };
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toW3cDate = (gmt?: string) => (gmt ? `${gmt}Z` : undefined);

async function fetchPostPage(page: number) {
  const query = new URLSearchParams({
    per_page: String(PAGE_SIZE),
    page: String(page),
    status: "publish",
    orderby: "modified",
    order: "desc",
    _embed: "wp:featuredmedia",
    _fields: "slug,date_gmt,modified_gmt,title,_links,_embedded",
  });
  const response = await fetch(`${CMS_URL}/wp-json/wp/v2/posts?${query}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`WordPress sitemap fetch failed [${response.status}]`);
  const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "1") || 1;
  return { posts: (await response.json()) as SitemapPost[], totalPages };
}

async function fetchAllPosts(): Promise<SitemapPost[]> {
  const first = await fetchPostPage(1);
  const pages = Math.min(first.totalPages, MAX_PAGES);
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => fetchPostPage(i + 2)));
  return [first, ...rest].flatMap((p) => p.posts).filter((p) => p.slug !== "hello-world");
}

function urlEntry(
  loc: string,
  opts: {
    lastmod?: string | undefined;
    changefreq?: string | undefined;
    priority?: string | undefined;
    image?: string | undefined;
  },
) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    opts.lastmod ? `    <lastmod>${opts.lastmod}</lastmod>` : "",
    opts.changefreq ? `    <changefreq>${opts.changefreq}</changefreq>` : "",
    opts.priority ? `    <priority>${opts.priority}</priority>` : "",
    opts.image
      ? `    <image:image><image:loc>${escapeXml(opts.image)}</image:loc></image:image>`
      : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildXml(posts: SitemapPost[]): string {
  const newestPost = posts
    .map((p) => toW3cDate(p.modified_gmt ?? p.date_gmt))
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  const pageEntries = STATIC_PAGES.map((page) =>
    urlEntry(absoluteUrl(page.path), {
      // The journal index changes whenever a post does.
      lastmod: page.path === "/blog" ? newestPost : undefined,
      changefreq: page.changefreq,
      priority: page.priority,
    }),
  );

  const postEntries = posts.map((post) =>
    urlEntry(absoluteUrl(`/blog/${post.slug}`), {
      lastmod: toW3cDate(post.modified_gmt ?? post.date_gmt),
      changefreq: "monthly",
      priority: "0.7",
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    }),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...pageEntries,
    ...postEntries,
    "</urlset>",
    "",
  ].join("\n");
}

let cachedXml: { at: number; xml: string } | undefined;
let inFlight: Promise<string> | undefined;

async function getSitemapXml(): Promise<string> {
  if (cachedXml && Date.now() - cachedXml.at < CACHE_TTL_MS) return cachedXml.xml;
  inFlight ??= fetchAllPosts()
    .then((posts) => {
      const xml = buildXml(posts);
      cachedXml = { at: Date.now(), xml };
      return xml;
    })
    .finally(() => {
      inFlight = undefined;
    });
  return inFlight;
}

export async function sitemapResponse(method: string): Promise<Response> {
  try {
    const xml = await getSitemapXml();
    return new Response(method === "HEAD" ? null : xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=900",
      },
    });
  } catch (error) {
    // Serve the last good sitemap during a CMS outage; with none, ask crawlers
    // to retry rather than handing them a sitemap that is missing every post.
    console.error("Sitemap build failed:", error);
    if (cachedXml) {
      return new Response(method === "HEAD" ? null : cachedXml.xml, {
        status: 200,
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    }
    return new Response("Sitemap temporarily unavailable", {
      status: 503,
      headers: { "retry-after": "300", "content-type": "text/plain; charset=utf-8" },
    });
  }
}
