// Live blog data from the ForgeXD WordPress backend (headless CMS).
// Sample posts stand in only while WordPress has no real posts yet. If the CMS
// cannot be reached, the last good data is served; with nothing to fall back
// on, the page answers 503 so search engines retry instead of indexing
// placeholder content or dropping real articles.
//
// Requests are kept small and cached on the server:
// - a single article is fetched by slug, not by downloading every post
// - the post list is paginated, so it keeps working past 100 posts
// - results are cached in memory for a few minutes, so repeat visits do not
//   hit WordPress at all
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";
import {
  getWordPressCategories,
  posts as samplePosts,
  siteAuthor,
  type BlogPost,
  type WordPressTerm,
} from "./blog";
import { DEFAULT_OG_IMAGE } from "./site";

const CMS_URL = "https://cms.forgexd.co.za";
const CACHE_TTL_MS = 5 * 60 * 1000;
const PAGE_SIZE = 100;
const MAX_PAGES = 20;
// Only the fields the site uses. Skips heavy extras such as SEO plugin head data.
// yoast_head_json carries the SEO title and description set in Yoast on the CMS.
const FIELDS = "id,slug,date,modified_gmt,title,excerpt,content,yoast_head_json,_links,_embedded";

type WpMedia = { source_url?: string; alt_text?: string };
type WpAuthor = { name?: string };
// Only the Yoast fields that are safe to reuse. Its robots (noindex on the CMS),
// URLs and schema all describe cms.forgexd.co.za and must never be copied.
type YoastHead = {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Array<{ url?: string }>;
};

type WpPost = {
  id: number;
  slug: string;
  date: string;
  modified_gmt?: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: YoastHead;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WordPressTerm[][];
    author?: WpAuthor[];
  };
};

// ---------- text helpers ----------

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
  middot: "·",
  bull: "•",
  times: "×",
  euro: "€",
  pound: "£",
};

// Decodes every numeric entity (&#038; &#8217; &#x2019;) and the common named
// ones WordPress emits, so titles and excerpts never show raw codes.
export const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const point =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(point) && point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });

const estimateReadTime = (html: string) => {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const formatExcerpt = (html: string) => {
  const excerpt = decodeEntities(stripHtml(html));
  if (excerpt.length <= 220) return excerpt;
  const boundary = excerpt.lastIndexOf(" ", 220);
  return `${excerpt.slice(0, boundary > 0 ? boundary : 220).trimEnd()}…`;
};

// Shown when a post has no featured image.
const FALLBACK_COVER = DEFAULT_OG_IMAGE.url;

const clean = (value?: string) => {
  const text = value ? decodeEntities(stripHtml(value)) : "";
  return text || undefined;
};

function mapPost(wp: WpPost): BlogPost {
  const yoast = wp.yoast_head_json;
  const categories = getWordPressCategories(wp._embedded?.["wp:term"]);
  const media = wp._embedded?.["wp:featuredmedia"]?.[0];
  const cover = media?.source_url;
  const title = decodeEntities(stripHtml(wp.title.rendered));
  return {
    id: wp.id,
    slug: wp.slug,
    title,
    excerpt: formatExcerpt(wp.excerpt.rendered),
    categories: categories.map(decodeEntities),
    publishedAt: wp.date.slice(0, 10),
    updatedAt: wp.modified_gmt ? `${wp.modified_gmt}Z` : undefined,
    readTime: estimateReadTime(wp.content.rendered),
    coverImage: cover || FALLBACK_COVER,
    seo: {
      title: clean(yoast?.title),
      description: clean(yoast?.description),
      ogTitle: clean(yoast?.og_title),
      ogDescription: clean(yoast?.og_description),
      ogImage: yoast?.og_image?.[0]?.url || undefined,
    },
    coverAlt: (cover && media?.alt_text?.trim()) || (cover ? title : DEFAULT_OG_IMAGE.alt),
    author: { name: siteAuthor.name, role: siteAuthor.role },
    takeaways: [],
    contentHtml: wp.content.rendered,
  };
}

// The default "Hello world!" post is not real content.
const isRealPost = (p: BlogPost) => p.slug !== "hello-world";

// ---------- server cache ----------

type CacheEntry<T> = { at: number; value: Promise<T> };
const cache = new Map<string, CacheEntry<unknown>>();
// Last successful result per key, kept with no expiry as an outage fallback.
const lastGood = new Map<string, unknown>();

// Caches the promise itself, so simultaneous requests share one WordPress call.
// A failed call is dropped from the cache straight away so the next visit retries.
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;
  const value = load();
  cache.set(key, { at: Date.now(), value });
  value.then(
    (result) => lastGood.set(key, result),
    () => cache.delete(key),
  );
  return value;
}

// ---------- WordPress requests ----------

export class CmsUnavailableError extends Error {}

async function wpFetch(query: string): Promise<{ posts: WpPost[]; totalPages: number }> {
  let response: Response;
  try {
    response = await fetch(`${CMS_URL}/wp-json/wp/v2/posts?${query}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new CmsUnavailableError("WordPress could not be reached", { cause: error });
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new CmsUnavailableError(
      `WordPress request failed [${response.status}]: ${body.slice(0, 300)}`,
    );
  }
  const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "1") || 1;
  return { posts: (await response.json()) as WpPost[], totalPages };
}

async function fetchAllPosts(): Promise<BlogPost[]> {
  const base = `per_page=${PAGE_SIZE}&status=publish&_embed=1&_fields=${FIELDS}`;
  const first = await wpFetch(`${base}&page=1`);
  const pages = Math.min(first.totalPages, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => wpFetch(`${base}&page=${i + 2}`)),
  );
  return [first, ...rest].flatMap((page) => page.posts.map(mapPost)).filter(isRealPost);
}

async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { posts } = await wpFetch(
    `slug=${encodeURIComponent(slug)}&status=publish&_embed=1&_fields=${FIELDS}`,
  );
  const post = posts[0] ? mapPost(posts[0]) : null;
  return post && isRealPost(post) ? post : null;
}

// All posts for the journal page. Sample posts stand in only while WordPress
// is reachable but has no real posts yet.
async function resolvePosts(): Promise<BlogPost[]> {
  try {
    const live = await cached("posts:all", fetchAllPosts);
    return live.length > 0 ? live : samplePosts;
  } catch (error) {
    const stale = lastGood.get("posts:all") as BlogPost[] | undefined;
    if (stale) {
      console.error("WordPress unavailable, serving last good post list:", error);
      return stale.length > 0 ? stale : samplePosts;
    }
    throw error instanceof CmsUnavailableError
      ? error
      : new CmsUnavailableError("WordPress post list failed", { cause: error });
  }
}

async function resolvePost(slug: string): Promise<BlogPost | null> {
  // Reuse the full list when it is already cached, so no extra request is made.
  const list = cache.get("posts:all") as CacheEntry<BlogPost[]> | undefined;
  if (list && Date.now() - list.at < CACHE_TTL_MS) {
    const posts = await resolvePosts();
    return posts.find((p) => p.slug === slug) ?? null;
  }
  try {
    const live = await cached(`post:${slug}`, () => fetchPostBySlug(slug));
    if (live) return live;
    // Not in WordPress. It may be a sample post shown while the blog is empty.
    const posts = await resolvePosts();
    return posts.find((p) => p.isSample && p.slug === slug) ?? null;
  } catch (error) {
    const stale =
      (lastGood.get(`post:${slug}`) as BlogPost | null | undefined) ??
      (lastGood.get("posts:all") as BlogPost[] | undefined)?.find((p) => p.slug === slug);
    if (stale) {
      console.error(`WordPress unavailable, serving last good copy of "${slug}":`, error);
      return stale;
    }
    throw error instanceof CmsUnavailableError
      ? error
      : new CmsUnavailableError(`WordPress post "${slug}" failed`, { cause: error });
  }
}

// Answers 503 with Retry-After while the CMS is down and nothing is cached, so
// search engines come back later instead of dropping or misindexing pages.
async function withCmsStatus<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof CmsUnavailableError) {
      console.error(error, error.cause);
      setResponseStatus(503);
      setResponseHeader("Retry-After", "300");
      throw new Error("The journal is temporarily unavailable. Please try again in a few minutes.");
    }
    throw error;
  }
}

// ---------- server functions ----------

export const getBlogPosts = createServerFn({ method: "GET" }).handler(async () =>
  withCmsStatus(resolvePosts),
);

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => withCmsStatus(() => resolvePost(slug)));

// "Keep reading" cards. Sent without article bodies to keep the page light.
export const getRelatedPosts = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    // "Keep reading" is optional; an outage here should never break the article.
    const posts = await resolvePosts().catch(() => [] as BlogPost[]);
    return posts
      .filter((p) => p.slug !== slug)
      .slice(0, 3)
      .map((p) => ({ ...p, contentHtml: "" }));
  });
