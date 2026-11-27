// Single source of truth for the public site identity. Canonical URLs, social
// share tags and structured data are all built from here, so Google and social
// platforms always credit forgexd.co.za, never a preview or Lovable subdomain.
import { siteAuthor, type BlogPost } from "./blog";

export const SITE_URL = "https://forgexd.co.za";
export const SITE_NAME = "ForgeXD";
export const SITE_DESCRIPTION =
  "ForgeXD is a digital agency creating websites, UX/UI design, SEO and business strategies for ambitious brands.";

const UPLOADS = "https://cms.forgexd.co.za/wp-content/uploads/2026/11";

// Default social share image: the ForgeXD site on laptop and phone.
export const DEFAULT_OG_IMAGE = {
  url: `${UPLOADS}/ForgeXD-Responsive-Hero-Showcase.png`,
  width: 1672,
  height: 941,
  alt: "The ForgeXD website shown on a laptop and a phone",
};

export const LOGO_URL = `${UPLOADS}/ForgeXD-Logo-For-Social-Media-2048x2048.png`;

export const absoluteUrl = (path: string) => {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE_URL}${clean}`;
};

export function canonicalLink(path: string) {
  return { rel: "canonical", href: absoluteUrl(path) };
}

// Per page share tags. Image tags are only needed when a page has its own image;
// every other page inherits the default image from the root route.
export function socialMeta(path: string, image?: { url: string; alt: string }) {
  const tags: Array<{ property?: string; name?: string; content: string }> = [
    { property: "og:url", content: absoluteUrl(path) },
  ];
  if (image) {
    tags.push(
      { property: "og:image", content: image.url },
      { property: "og:image:alt", content: image.alt },
      { name: "twitter:image", content: image.url },
      { name: "twitter:image:alt", content: image.alt },
    );
  }
  return tags;
}

// ---------- structured data (JSON-LD) ----------

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/about#founder`;

export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteAuthor.name,
  jobTitle: siteAuthor.role,
  image: siteAuthor.headshot,
  url: absoluteUrl("/about"),
  description: siteAuthor.summary,
  hasCredential: siteAuthor.credentials.map((name) => ({
    "@type": "EducationalOccupationalCredential",
    name,
  })),
  worksFor: { "@id": ORG_ID },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: LOGO_URL, width: 2048, height: 2048 },
  image: DEFAULT_OG_IMAGE.url,
  description: SITE_DESCRIPTION,
  slogan: "Forge What's Next",
  founder: personSchema,
  areaServed: ["South Africa", "United Kingdom", "United States"],
  knowsAbout: [
    "Web design",
    "Web development",
    "UX design",
    "UI design",
    "Search engine optimisation",
    "Content strategy",
    "Digital business strategy",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-ZA",
  publisher: { "@id": ORG_ID },
};

export function serviceSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: organizationSchema.areaServed,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith("http") ? post.coverImage : absoluteUrl(post.coverImage),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    articleSection: post.categories,
    inLanguage: "en-ZA",
    author: personSchema,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
