// Sample posts shaped like the WordPress REST API output so live data can replace them later.
import webShowcase from "../assets/web-design-showcase.jpg";
import uxShowcase from "../assets/ux-ui-showcase.jpg";
import aboutHero from "../assets/about-hero.jpg";
import philosophy from "../assets/about-philosophy.jpg";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  categories: string[];
  publishedAt: string;
  // Last modified date from WordPress, used for the sitemap and article schema.
  updatedAt?: string | undefined;
  readTime: string;
  coverImage: string;
  // Alt text for the cover image. Falls back to the post title.
  coverAlt?: string;
  // Placeholder posts shown only while WordPress has no real posts. Never indexed.
  isSample?: boolean;
  author: { name: string; role: string };
  takeaways: string[];
  contentHtml: string;
};

export type WordPressTerm = { name?: string; taxonomy?: string };

export function getWordPressCategories(termGroups?: WordPressTerm[][]): string[] {
  const groups = termGroups ?? [];
  const explicitCategories = groups.flat().filter((term) => term.taxonomy === "category");
  const categoryTerms = explicitCategories.length > 0 ? explicitCategories : (groups[0] ?? []);
  const names = categoryTerms
    .map((term) => term.name?.trim())
    .filter((name): name is string => Boolean(name));
  return [...new Set(names)].length > 0 ? [...new Set(names)] : ["Journal"];
}

export const categories = [
  "All",
  "Strategy",
  "UX & UI",
  "Web development",
  "SEO",
  "Guides",
] as const;

// Author profile shown on every blog post.
export const siteAuthor = {
  name: "Ndumiso Khoza",
  role: "Founder & CEO",
  headshot: "https://cms.forgexd.co.za/wp-content/uploads/2026/11/Ndumiso-Headshot.png",
  credentials: [
    "Bachelor of Commerce in Marketing Management",
    "National Certificate: Business Analysis Support Practice",
  ],
  summary:
    "Ndumiso Khoza is a digital entrepreneur and strategist with experience spanning digital marketing, search engine optimisation, web development and business strategy. He is passionate about the intersection of technology, business and digital experiences, helping organisations understand opportunities, solve problems and build sustainable digital ecosystems.",
} as const;

const samplePostData: BlogPost[] = [
  {
    id: 1,
    slug: "launching-your-business-online",
    title: "Launching your business online: what actually matters first",
    excerpt:
      "Before the logo, before the website, there is one decision that shapes everything else. Here is how we help founders get it right.",
    categories: ["Strategy"],
    publishedAt: "2026-09-28",
    readTime: "7 min read",
    coverImage: aboutHero,
    author: { name: "Ndumiso Khoza", role: "Founder & CEO" },
    takeaways: [
      "Define who you serve before what you build",
      "Your website is a sales tool, not a brochure",
      "Launch small, measure, then expand",
    ],
    contentHtml: `<p>Most new businesses start with the visible things — a logo, a domain, a homepage. But the businesses that grow fastest start somewhere less glamorous: a clear answer to <strong>who they serve and why it matters</strong>.</p>
<h2>Start with the customer, not the canvas</h2>
<p>Every decision on your website — the headline, the order of sections, the call to action — should answer a question your customer is already asking. If you can't name those questions, the design will guess.</p>
<blockquote>A website that tries to speak to everyone usually convinces no one.</blockquote>
<h2>Treat your website as a sales tool</h2>
<p>Your site should move people from curiosity to action. That means a clear offer, proof that you can deliver, and one obvious next step on every page.</p>
<ul><li>One primary message per page</li><li>Real proof: work, results, testimonials</li><li>A single, repeated call to action</li></ul>
<h2>Launch, then learn</h2>
<p>You don't need everything on day one. Launch the foundation, watch how people use it, then invest where the data points.</p>`,
  },
  {
    id: 2,
    slug: "ux-is-a-business-decision",
    title: "UX is a business decision, not a design preference",
    excerpt:
      "Good experience design reduces support costs, lifts conversions and builds trust. Here's how to frame UX in business terms.",
    categories: ["UX & UI"],
    publishedAt: "2026-09-15",
    readTime: "6 min read",
    coverImage: uxShowcase,
    author: { name: "Ndumiso Khoza", role: "Founder & CEO" },
    takeaways: [
      "Friction has a measurable cost",
      "Research is cheaper than rebuilds",
      "Design systems keep teams fast",
    ],
    contentHtml: `<p>When people hear "UX", they often picture colours and buttons. In reality, UX is about <strong>removing the reasons people give up</strong>.</p>
<h2>Friction has a price</h2>
<p>Every confusing form field, unclear label or slow page costs you customers. The fix is rarely expensive — finding it is the hard part.</p>
<h2>Research before pixels</h2>
<p>Five short conversations with real users will reveal more than weeks of internal debate.</p>
<blockquote>We don't start with screens. We start with the problem.</blockquote>`,
  },
  {
    id: 3,
    slug: "seo-foundations-for-small-businesses",
    title: "SEO foundations every small business should have in place",
    excerpt:
      "A practical checklist of the technical and content basics that help search engines — and people — find you.",
    categories: ["SEO"],
    publishedAt: "2026-08-30",
    readTime: "8 min read",
    coverImage: webShowcase,
    author: { name: "Ndumiso Khoza", role: "Founder & CEO" },
    takeaways: [
      "Fix technical basics first",
      "Write for intent, not keywords",
      "Local listings matter more than you think",
    ],
    contentHtml: `<p>Search visibility compounds. The earlier the foundations are in place, the more every new page pays off.</p>
<h2>Technical basics</h2>
<ul><li>Fast pages on mobile</li><li>Clear page titles and descriptions</li><li>A sitemap submitted to Google Search Console</li></ul>
<h2>Content that answers questions</h2>
<p>Write the page your customer wishes existed. Answer their real question, plainly, and link to the next step.</p>`,
  },
  {
    id: 4,
    slug: "design-system-starter-guide",
    title: "A starter guide to design systems for growing teams",
    excerpt:
      "When your product starts to feel inconsistent, a design system is the fix. Here's how to start without overbuilding.",
    categories: ["Guides"],
    publishedAt: "2026-08-12",
    readTime: "9 min read",
    coverImage: philosophy,
    author: { name: "Ndumiso Khoza", role: "Founder & CEO" },
    takeaways: [
      "Start with tokens: colour, type, spacing",
      "Document decisions, not just components",
      "Grow it from real product needs",
    ],
    contentHtml: `<p>A design system is a shared language between design and development. It doesn't need to be huge to be useful.</p>
<h2>Start with tokens</h2>
<p>Colour, typography and spacing are the smallest decisions with the biggest impact. Lock those first.</p>
<h2>Grow from real needs</h2>
<p>Only add a component to the system once it has been used twice. That keeps it lean and honest.</p>`,
  },
];

export const posts: BlogPost[] = samplePostData.map((p) => ({ ...p, isSample: true }));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
