// Live blog data from the ForgeXD WordPress backend (headless CMS).
// Falls back to the local sample posts when WordPress has no real posts yet
// or the gateway is unreachable, so the blog never renders empty.
import { createServerFn } from "@tanstack/react-start";
import { posts as samplePosts, type BlogPost } from "./blog";

const CMS_URL = "https://cms.forgexd.co.za";

type WpMedia = { source_url?: string };
type WpTerm = { name?: string };
type WpAuthor = { name?: string };
type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
    author?: WpAuthor[];
  };
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const decodeEntities = (text: string) =>
  text
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…");

const estimateReadTime = (html: string) => {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const FALLBACK_COVER =
  "https://cms.forgexd.co.za/wp-content/uploads/forgexd-default-cover.jpg";

function mapPost(wp: WpPost): BlogPost {
  const category = wp._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Journal";
  const cover = wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const authorName = wp._embedded?.author?.[0]?.name ?? "ForgeXD Studio";
  return {
    id: wp.id,
    slug: wp.slug,
    title: decodeEntities(stripHtml(wp.title.rendered)),
    excerpt: decodeEntities(stripHtml(wp.excerpt.rendered)).slice(0, 220),
    category: decodeEntities(category),
    publishedAt: wp.date.slice(0, 10),
    readTime: estimateReadTime(wp.content.rendered),
    coverImage: cover || FALLBACK_COVER,
    author: { name: decodeEntities(authorName), role: "ForgeXD" },
    takeaways: [],
    contentHtml: wp.content.rendered,
  };
}

// The default "Hello world!" post is not real content — treat the blog as empty.
const isRealPost = (p: BlogPost) => p.slug !== "hello-world";

async function fetchWpPosts(): Promise<BlogPost[]> {
  // Published posts are public, so we read them straight from the CMS.
  const response = await fetch(
    `${CMS_URL}/wp-json/wp/v2/posts?per_page=50&status=publish&_embed=1`,
    { headers: { Accept: "application/json" } },
  );
  if (!response.ok) {
    const body = await response.text();
    console.error(`WordPress posts fetch failed [${response.status}]: ${body}`);
    return [];
  }
  const data = (await response.json()) as WpPost[];
  return data.map(mapPost).filter(isRealPost);
}

async function resolvePosts(): Promise<BlogPost[]> {
  try {
    const live = await fetchWpPosts();
    return live.length > 0 ? live : samplePosts;
  } catch (error) {
    console.error("WordPress fetch error, using sample posts:", error);
    return samplePosts;
  }
}

export const getBlogPosts = createServerFn({ method: "GET" }).handler(
  async () => resolvePosts(),
);

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const all = await resolvePosts();
    return all.find((p) => p.slug === slug) ?? null;
  });
