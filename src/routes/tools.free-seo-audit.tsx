import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  FileText,
  FileUp,
  Globe,
  ImageIcon,
  Info,
  Layers,
  ListChecks,
  Loader2,
  PenLine,
  RotateCcw,
  ScanSearch,
  Search as SearchIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { fetchPageForAudit } from "../lib/page-fetch";
import {
  TITLE_MAX_PX,
  TITLE_MIN_PX,
  analyzeContent,
  prioritisedFixes,
  titlePixelWidth,
  type AuditCategory,
  type AuditCheck,
  type AuditResult,
  type AuditStatus,
  type ContentType,
} from "../lib/seo-audit";
import {
  absoluteUrl,
  breadcrumbSchema,
  canonicalLink,
  organizationSchema,
  socialMeta,
} from "../lib/site";

const PATH = "/tools/free-seo-audit";
const HERO_IMAGE =
  "https://cms.forgexd.co.za/wp-content/uploads/2026/11/Creative-Team-Collaboration-with-Mandala-Graphics.png";
const TITLE = "Free On-Page SEO Audit Tool - No Sign Up | ForgeXD";
const DESCRIPTION =
  "Use our free on-page SEO audit tool to check any page in seconds. Paste content, upload a file or enter a URL and get a scored audit with clear fixes.";

export const Route = createFileRoute("/tools/free-seo-audit")({
  head: () => ({
    links: [canonicalLink(PATH)],
    meta: [
      ...socialMeta(PATH),
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ForgeXD Free On Page SEO Audit",
          url: absoluteUrl(PATH),
          description: DESCRIPTION,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any web browser",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          provider: { "@id": organizationSchema["@id"] },
        },
      },
      {
        "script:ld+json": breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Free SEO audit", path: PATH },
        ]),
      },
    ],
  }),
  component: FreeSeoAuditPage,
});

// ---------- constants ----------

type Source = "paste" | "file" | "url";

const CATEGORIES: Array<{ name: AuditCategory; icon: typeof ScanSearch; copy: string }> = [
  {
    name: "Keyphrase",
    icon: ScanSearch,
    copy: "Placement in your title, opening, slug, meta description and subheadings, plus density and spread.",
  },
  {
    name: "Readability",
    icon: FileText,
    copy: "Sentence and paragraph length, passive voice, transition words and repeated openings.",
  },
  {
    name: "Structure",
    icon: Layers,
    copy: "One H1, heading order, section length and the word count your content type needs.",
  },
  {
    name: "Content Quality",
    icon: Sparkles,
    copy: "Internal links, keyphrase anchors, dash punctuation, overused AI phrases and risk disclaimers.",
  },
  {
    name: "Images",
    icon: ImageIcon,
    copy: "Image count, missing alt text, vague descriptions and keyphrase use in alt text.",
  },
];

const STATUS: Record<
  AuditStatus,
  { label: string; icon: typeof CircleCheck; text: string; dot: string }
> = {
  fail: { label: "Fix", icon: CircleX, text: "text-brand-ember", dot: "bg-brand-ember" },
  warning: {
    label: "Review",
    icon: CircleAlert,
    text: "text-brand-orange",
    dot: "bg-brand-orange",
  },
  pass: { label: "Pass", icon: CircleCheck, text: "text-brand-olive", dot: "bg-brand-olive" },
  info: { label: "Note", icon: Info, text: "text-muted-foreground", dot: "bg-muted-foreground" },
};

const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "standard", label: "Standard blog post (500+ words)" },
  { value: "cornerstone", label: "Cornerstone content (900+ words, best 1,500)" },
  { value: "product", label: "Product or service page (200+ words)" },
];

const FAQS = [
  {
    q: "What is an on-page SEO audit?",
    a: "An on-page SEO audit checks the parts of a page you control directly: the title, meta description, headings, keyphrase placement, readability, links and images. Backlinks and technical factors such as site speed need different tools, because they sit outside the page itself.",
  },
  {
    q: "Is the audit really free?",
    a: "Yes. The free on-page SEO audit tool needs no sign up, no payment and has no limit on single page audits. Running a page by URL is limited to 20 audits every 10 minutes so the service stays fast for everyone.",
  },
  {
    q: "Can I audit a page that is already live?",
    a: "Yes. Choose URL and paste the address. The tool fetches the page, follows any redirects, reads its title and meta description, and audits only the article content, not the menus or footer around it.",
  },
  {
    q: "Does it work outside WordPress?",
    a: "Yes. It reads standard HTML, so it works with any website builder or CMS. Pasted text and uploaded Word, PDF or text files work too.",
  },
  {
    q: "Do you store my content?",
    a: "No. Pasted and uploaded content is analysed in your browser and never leaves it. When you enter a URL, our server fetches that one page for you and does not keep a copy.",
  },
  {
    q: "Why is my title measured in pixels?",
    a: "Google cuts titles by how wide they are on screen, not by how many characters they have. A title full of wide letters gets cut sooner, so we measure the width Google actually displays.",
  },
  {
    q: "Does this replace a full SEO audit?",
    a: "It checks one page at a time. A full audit also covers technical health, site structure, backlinks and search data across your whole website.",
  },
];

const STEPS = [
  {
    title: "Add your content",
    copy: "Paste text or HTML, upload a Word, PDF or text file, or enter a URL. For a URL, our server fetches the live page, follows any redirects and reads its title and meta description for you.",
  },
  {
    title: "We find the real content",
    copy: "Menus, footers, sidebars, share buttons and related posts are not part of your article. The tool finds the article body and audits only that, so your word count and link counts stay accurate.",
  },
  {
    title: "Around 30 checks run",
    copy: "Each check is weighted by how much it affects rankings and readers. Your focus keyphrase and content type decide which targets apply to the page.",
  },
  {
    title: "You get a score and a fix list",
    copy: "You see a score out of 100, every result grouped by category, and a list of fixes ordered from the most important to the least.",
  },
];

const BANDS = [
  { range: "85 to 100", label: "Great, ready to publish", tone: "bg-brand-olive" },
  { range: "65 to 84", label: "Good, a few fixes first", tone: "bg-brand-orange" },
  { range: "40 to 64", label: "Needs real work", tone: "bg-brand-ember" },
  { range: "0 to 39", label: "Major issues, do not publish yet", tone: "bg-brand-ink" },
];

const STANDARDS: Array<{ check: string; target: string; why: ReactNode }> = [
  {
    check: "SEO title width",
    target: "400 to 600 pixels",
    why: (
      <>
        Google cuts titles by pixel width, so a title of wide letters gets cut sooner than one of
        narrow letters. Google explains how it builds{" "}
        <a
          href="https://developers.google.com/search/docs/appearance/title-link"
          target="_blank"
          rel="noopener"
          className="text-brand-orange underline underline-offset-2"
        >
          title links in search results
        </a>
        .
      </>
    ),
  },
  {
    check: "Meta description",
    target: "120 to 156 characters, with your keyphrase",
    why: (
      <>
        Shorter descriptions waste space in the results and longer ones get cut. Google also shows
        how it chooses{" "}
        <a
          href="https://developers.google.com/search/docs/appearance/snippet"
          target="_blank"
          rel="noopener"
          className="text-brand-orange underline underline-offset-2"
        >
          the snippet under each result
        </a>
        .
      </>
    ),
  },
  {
    check: "Keyphrase in the opening",
    target: "First paragraph",
    why: "Readers and search engines both decide what a page is about from its first lines.",
  },
  {
    check: "Keyphrase density",
    target: "0.5% to 3%",
    why: "Too low and the topic is unclear. Too high and the page reads like keyword stuffing.",
  },
  {
    check: "Keyphrase in subheadings",
    target: "30% to 75% of subheadings",
    why: "Enough to confirm the topic, but not so many that the headings feel forced.",
  },
  {
    check: "Long sentences",
    target: "No more than 25% over 20 words",
    why: "Short sentences keep people reading, especially on a phone.",
  },
  {
    check: "Passive voice",
    target: "10% of sentences or fewer",
    why: "Active sentences are clearer and quicker to read.",
  },
  {
    check: "Paragraphs and sections",
    target: "Paragraphs under 150 words, a heading at least every 300 words",
    why: "Pages that are easy to scan hold attention for longer.",
  },
  {
    check: "Transition words",
    target: "At least 30% of sentences",
    why: "They carry the reader from one idea to the next, so the page reads as one argument.",
  },
  {
    check: "Internal links",
    target: "At least 2",
    why: "They pass authority to your important pages and keep readers on your site.",
  },
  {
    check: "Images",
    target: "At least 2, each with alt text",
    why: "Alt text helps image search and makes the page usable with a screen reader.",
  },
  {
    check: "Word count",
    target: "Blog post 500+, cornerstone 900+ (best 1,500), product or service page 200+",
    why: "Each type of page needs enough depth for its purpose, and no more padding than that.",
  },
];

const USES = [
  {
    title: "Before you publish",
    copy: "Catch a missing keyphrase, a long section or empty alt text while it is still a two minute fix.",
  },
  {
    title: "Refreshing an old post",
    copy: "Pages that slip in rankings often have thin sections, outdated titles or no internal links to newer content.",
  },
  {
    title: "A page stuck just off page one",
    copy: "On-page gaps are usually the quickest thing to fix when a page ranks close to the first page but not on it.",
  },
  {
    title: "Studying a competitor",
    copy: "Run a competitor's URL to see how their page is built for the keyphrase you both want.",
  },
];

const fieldClass =
  "mt-2 w-full border border-foreground/25 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-orange";
const labelClass = "text-xs font-bold uppercase text-foreground";

// ---------- helpers ----------

function hasHtmlMarkup(value: string) {
  return /<(?:!doctype|html|body|article|main|section|div|p|h[1-6]|a|img|ul|ol|li|table)\b/i.test(
    value,
  );
}

function extractMetadata(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return {
    title: doc.querySelector("title")?.textContent?.trim() ?? "",
    description:
      doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "",
  };
}

async function readUploadedFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "txt" || extension === "md" || extension === "html" || extension === "htm") {
    return file.text();
  }
  if (extension === "docx") {
    const mammoth = await import("mammoth");
    const extracted = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    return extracted.value;
  }
  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    const { default: workerSrc } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }
    return pages.join("\n\n");
  }
  throw new Error("Choose a Word document (.docx), PDF, HTML or plain text file.");
}

// ---------- page ----------

function FreeSeoAuditPage() {
  const fetchPage = useServerFn(fetchPageForAudit);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [source, setSource] = useState<Source>("paste");
  const [content, setContent] = useState("");
  const [keyphrase, setKeyphrase] = useState("");
  const [contentType, setContentType] = useState<ContentType>("standard");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [redirectNote, setRedirectNote] = useState("");
  const [busy, setBusy] = useState<"" | "file" | "url">("");
  const [error, setError] = useState("");

  const isHtml = useMemo(() => hasHtmlMarkup(content), [content]);
  const titlePx = titlePixelWidth(seoTitle.trim());
  const metaLength = metaDescription.trim().length;
  const canRun =
    !!keyphrase.trim() && !busy && (source === "url" ? !!url.trim() : !!content.trim());

  function showResult(next: AuditResult) {
    setResult(next);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function audit(
    html: string,
    extra: { title?: string; description?: string; slug?: string; pageUrl?: string } = {},
  ) {
    showResult(
      analyzeContent({
        content: html,
        keyphrase,
        contentType,
        seoTitle: extra.title ?? seoTitle,
        metaDescription: extra.description ?? metaDescription,
        slug: extra.slug ?? slug,
        html: hasHtmlMarkup(html),
        pageUrl: extra.pageUrl,
      }),
    );
  }

  async function handleUpload(file?: File) {
    if (!file) return;
    setError("");
    setResult(null);
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose a file smaller than 10 MB.");
      return;
    }
    setBusy("file");
    try {
      const text = await readUploadedFile(file);
      if (!text.trim()) {
        setError(
          "We could not find readable text in that file. Try a text based PDF or a Word file.",
        );
        return;
      }
      setContent(text.slice(0, 500_000));
      setFileName(file.name);
    } catch (err) {
      setError(
        err instanceof Error && err.message.startsWith("Choose")
          ? err.message
          : "That file could not be read. Check that it is a valid Word, PDF or text file.",
      );
    } finally {
      setBusy("");
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleRun() {
    if (!canRun) return;
    setError("");
    setRedirectNote("");
    if (source !== "url") {
      audit(content);
      return;
    }
    setBusy("url");
    setResult(null);
    try {
      const response = await fetchPage({ data: { url: url.trim() } });
      if (!response.ok) {
        setError(response.error);
        return;
      }
      const meta = extractMetadata(response.html);
      const title = seoTitle.trim() || meta.title;
      const description = metaDescription.trim() || meta.description;
      let path = "";
      try {
        path = new URL(response.url).pathname.replace(/^\/+|\/+$/g, "");
      } catch {
        path = "";
      }
      setSeoTitle(title);
      setMetaDescription(description);
      setSlug(path);
      setContent(response.html);
      if (response.redirects.length) {
        setRedirectNote(
          `${url.trim()} redirected ${response.redirects.length} ${
            response.redirects.length === 1 ? "time" : "times"
          } before landing on ${response.url}. We audited the final page.`,
        );
      }
      audit(response.html, {
        title,
        description,
        slug: path ? `${new URL(response.url).origin}/${path}` : response.url,
        pageUrl: response.url,
      });
    } catch {
      setError("The page could not be fetched right now. Please try again in a moment.");
    } finally {
      setBusy("");
    }
  }

  function reset() {
    setContent("");
    setKeyphrase("");
    setSeoTitle("");
    setMetaDescription("");
    setSlug("");
    setUrl("");
    setFileName("");
    setResult(null);
    setRedirectNote("");
    setError("");
    setSource("paste");
  }

  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-ink text-primary-foreground">
        <img
          src={HERO_IMAGE}
          alt="A creative team collaborating on a project surrounded by mandala graphics"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-50"
        />
        <div className="service-hero-overlay absolute inset-0" />
        <SiteHeader />
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-16 pt-14 md:px-10 md:pb-20 lg:px-16">
          <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">
            Free SEO audit tool
          </p>
          <h1 className="max-w-5xl font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">
            Free On-Page SEO Audit Tool - No Sign Up
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-primary-foreground/72">
            This free on-page SEO audit tool checks any page before it goes live. Paste your
            content, upload a file or enter a URL, and you get a scored audit with clear, specific
            fixes in seconds.
          </p>
          <div className="mt-10 grid max-w-3xl gap-3 border-t border-primary-foreground/20 pt-6 text-xs font-semibold sm:grid-cols-3">
            {["No sign up, no payment", "Around 30 checks", "Content stays in your browser"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2 text-primary-foreground/70">
                  <Check className="text-brand-orange" size={16} />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          {/* Content input */}
          <div className="border border-foreground/15 bg-card p-6 md:p-9">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-medium md:text-3xl">Your content</h2>
              {(content || url || result) && (
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground transition-colors hover:text-brand-orange"
                >
                  <RotateCcw size={14} /> Start over
                </button>
              )}
            </div>

            <div
              role="tablist"
              aria-label="How to add content"
              className="mt-6 grid grid-cols-3 border border-foreground/20"
            >
              {(
                [
                  ["paste", "Paste", PenLine],
                  ["file", "Upload", FileUp],
                  ["url", "URL", Globe],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={source === value}
                  onClick={() => {
                    setSource(value);
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold transition-colors ${
                    source === value
                      ? "bg-brand-ink text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {source === "paste" && (
                <label className="block">
                  <span className={labelClass}>Paste text or HTML</span>
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={14}
                    className={`${fieldClass} resize-y font-mono text-[13px] leading-6`}
                    placeholder="Paste your article, page copy or the HTML from your editor."
                  />
                </label>
              )}

              {source === "file" && (
                <div>
                  <span className={labelClass}>Upload a file</span>
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="mt-2 flex w-full flex-col items-center justify-center gap-3 border border-dashed border-foreground/30 px-6 py-14 text-center transition-colors hover:border-brand-orange"
                  >
                    {busy === "file" ? (
                      <Loader2 className="animate-spin text-brand-orange" size={28} />
                    ) : (
                      <FileUp className="text-brand-olive" size={28} strokeWidth={1.6} />
                    )}
                    <span className="text-sm font-semibold">
                      {fileName ? fileName : "Choose a Word, PDF or text file"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {fileName
                        ? "File read. Choose another to replace it."
                        : "DOCX, PDF, TXT or HTML, up to 10 MB"}
                    </span>
                  </button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".docx,.pdf,.txt,.md,.html,.htm"
                    className="sr-only"
                    onChange={(event) => handleUpload(event.target.files?.[0])}
                  />
                </div>
              )}

              {source === "url" && (
                <label className="block">
                  <span className={labelClass}>Page URL</span>
                  <input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleRun()}
                    inputMode="url"
                    className={fieldClass}
                    placeholder="https://yourwebsite.com/your-page"
                  />
                  <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                    We fetch the live page, follow any redirects and read its title and meta
                    description for you.
                  </span>
                </label>
              )}
            </div>

            {source !== "url" && content.trim() && (
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <Info size={14} className="mt-0.5 shrink-0 text-brand-olive" />
                {isHtml
                  ? "HTML detected: full audit including headings, links and images."
                  : "Plain text detected. Paste HTML or enter a URL to include heading, link and image checks."}
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="border border-foreground/15 bg-card p-6 md:p-9">
            <h2 className="font-display text-2xl font-medium md:text-3xl">Audit settings</h2>
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className={labelClass}>
                  Focus keyphrase <span className="text-brand-orange">*</span>
                </span>
                <input
                  value={keyphrase}
                  onChange={(event) => setKeyphrase(event.target.value)}
                  className={fieldClass}
                  placeholder="e.g. forex trading for beginners"
                />
              </label>
              <label className="block">
                <span className={labelClass}>
                  Content type <span className="text-brand-orange">*</span>
                </span>
                <select
                  value={contentType}
                  onChange={(event) => setContentType(event.target.value as ContentType)}
                  className={fieldClass}
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>
                  SEO title <Optional />
                </span>
                <input
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                  className={fieldClass}
                  placeholder="The title that shows in Google"
                />
                {seoTitle.trim() && (
                  <Meter
                    value={titlePx}
                    min={TITLE_MIN_PX}
                    max={TITLE_MAX_PX}
                    label={`${titlePx}px of ${TITLE_MAX_PX}px`}
                  />
                )}
              </label>
              <label className="block">
                <span className={labelClass}>
                  Meta description <Optional />
                </span>
                <textarea
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  rows={3}
                  className={`${fieldClass} resize-y`}
                  placeholder="The summary under your title in Google"
                />
                {metaDescription.trim() && (
                  <Meter
                    value={metaLength}
                    min={120}
                    max={156}
                    label={`${metaLength} of 156 characters`}
                  />
                )}
              </label>
              <label className="block">
                <span className={labelClass}>
                  URL slug <Optional />
                </span>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  className={fieldClass}
                  placeholder="your-page-slug"
                />
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-6 border-l-2 border-brand-ember pl-4 text-sm leading-6 text-brand-ember"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleRun}
              disabled={!canRun}
              className="mt-7 inline-flex w-full items-center justify-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-ember disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy === "url" ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Fetching the page…
                </>
              ) : (
                <>
                  Run free audit <ArrowRight size={17} />
                </>
              )}
            </button>
            {!keyphrase.trim() && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Add a focus keyphrase and some content to run the audit.
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="mx-auto max-w-[1400px] scroll-mt-8">
          {result && <Results result={result} redirectNote={redirectNote} />}
        </div>
      </section>

      {/* What we check */}
      <section className="border-y border-primary-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we check</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">
              Five areas, one clear score.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/65">
              Our free on-page SEO audit tool groups around 30 checks into five areas. Because each
              check is weighted by how much it matters for ranking and for readers, the score shows
              you where to focus first.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map(({ name, icon: Icon, copy }) => (
              <article key={name} className="border border-primary-foreground/15 p-6">
                <Icon className="text-brand-orange" size={26} strokeWidth={1.6} />
                <p className="mt-8 font-display text-xl">{name}</p>
                <p className="mt-3 text-lg leading-8 text-primary-foreground/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">How it works</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">
              How the free <span className="whitespace-nowrap">on-page</span> SEO audit tool works
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Every audit follows the same four steps, whether you paste a rough draft or check a
              page that has been live for years.
            </p>
          </div>
          <ol className="mt-14 grid border-t border-foreground/20 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="border-b border-foreground/20 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
              >
                <span className="flex h-11 w-11 items-center justify-center bg-brand-orange text-xs font-bold text-primary-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-8 font-display text-2xl">{step.title}</p>
                <p className="mt-3 text-lg leading-8 text-muted-foreground">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scoring */}
      <section className="border-t border-foreground/15 px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Scoring</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
              How the <span className="whitespace-nowrap">on-page</span> SEO audit score is
              calculated
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-muted-foreground">
              <p>
                Not every check matters equally. For example, a missing keyphrase in your title
                costs more than a few long sentences, so each check carries a weight from 1 to 9.
              </p>
              <p>
                Passing a check earns its full weight. However, a warning earns only half, because
                you are close but not there yet, and a fail earns nothing.
              </p>
              <p>
                Fields you leave blank show up as notes and never lower your score. As a result, you
                can run the free on-page SEO audit tool on a first draft before you have even
                written the meta description.
              </p>
            </div>
          </div>
          <div className="self-center border-t border-foreground/20">
            {BANDS.map((band) => (
              <div
                key={band.range}
                className="flex items-center gap-5 border-b border-foreground/20 py-5"
              >
                <span className={`h-10 w-2 shrink-0 ${band.tone}`} />
                <span className="w-28 shrink-0 font-display text-2xl">{band.range}</span>
                <span className="text-lg text-muted-foreground">{band.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="border-y border-primary-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">The standards</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">
              The standards behind every <span className="whitespace-nowrap">on-page</span> SEO
              audit check
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/65">
              These targets come from how Google displays search results and from the readability
              standards the leading SEO plugins use. In other words, the free on-page SEO audit tool
              holds your page to the same bar your SEO plugin does, then explains why each target
              matters.
            </p>
          </div>
          {(
            [
              ["Keyphrase and search appearance checks", STANDARDS.slice(0, 5)],
              ["Readability, structure and link checks", STANDARDS.slice(5)],
            ] as const
          ).map(([heading, rows]) => (
            <div key={heading} className="mt-12 first:mt-0">
              <h3 className="font-display text-2xl">{heading}</h3>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-lg leading-8">
                  <thead>
                    <tr className="border-b border-primary-foreground/25 text-xs uppercase text-primary-foreground/55">
                      <th scope="col" className="w-1/5 py-4 pr-6 font-semibold">
                        Check
                      </th>
                      <th scope="col" className="w-1/4 py-4 pr-6 font-semibold">
                        What passes
                      </th>
                      <th scope="col" className="py-4 font-semibold">
                        Why it matters
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.check}
                        className="border-b border-primary-foreground/15 align-top"
                      >
                        <th scope="row" className="py-5 pr-6 font-display text-lg font-medium">
                          {row.check}
                        </th>
                        <td className="py-5 pr-6 text-primary-foreground/85">{row.target}</td>
                        <td className="py-5 leading-6 text-primary-foreground/65">{row.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When to use it */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">When to use it</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">
              When to run an <span className="whitespace-nowrap">on-page</span> SEO audit
            </h2>
          </div>
          <div className="grid border-l border-t border-foreground/20 sm:grid-cols-2 lg:grid-cols-4">
            {USES.map((use, index) => {
              const Icon = [PenLine, RotateCcw, TrendingUp, SearchIcon][index] ?? PenLine;
              return (
                <article key={use.title} className="border-b border-r border-foreground/20 p-7">
                  <Icon className="text-brand-olive" size={27} strokeWidth={1.6} />
                  <h3 className="mt-8 font-display text-xl">{use.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-muted-foreground">{use.copy}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-14 grid gap-6 border-t border-foreground/20 pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <h3 className="font-display text-2xl md:text-3xl">
              What an <span className="whitespace-nowrap">on-page</span> SEO audit does not cover
            </h3>
            <div className="space-y-4 text-lg leading-8 text-muted-foreground">
              <p>
                On-page checks are only one part of search performance. Backlinks, site speed, crawl
                errors and how Google indexes your site all sit outside the page itself, so this
                free on-page SEO audit tool does not score them.
              </p>
              <p>
                That is why a page can pass every check here and still struggle to rank. If that
                sounds like your site, our{" "}
                <Link
                  to="/services/seo-content-strategy"
                  className="text-brand-orange underline underline-offset-2"
                >
                  SEO and content strategy service
                </Link>{" "}
                looks at the whole picture, including Search Console data, technical health and
                authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Questions</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
              Questions about the <span className="whitespace-nowrap">on-page</span> SEO audit
            </h2>
          </div>
          <div className="border-t border-foreground/20">
            {FAQS.map((item) => (
              <details key={item.q} className="group border-b border-foreground/20 py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg md:text-xl">
                  {item.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/25 text-brand-orange transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="relative mx-auto max-w-[1400px]">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-bold uppercase text-brand-orange">
              Need more than one page?
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">
              Let&rsquo;s grow your whole site&rsquo;s search visibility.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/65">
              ForgeXD audits technical health, content and search data across your entire website,
              then builds the plan to fix what holds it back.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/services/seo-content-strategy"
                className="inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold transition-colors hover:bg-brand-ember"
              >
                SEO & content strategy <ArrowUpRight size={17} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-primary-foreground/30 px-6 py-4 text-sm font-semibold transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>
        <footer className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ForgeXD</span>
          <Link to="/contact" className="hover:text-primary-foreground">
            Contact
          </Link>
        </footer>
      </section>
    </main>
  );
}

// ---------- pieces ----------

function Optional() {
  return <span className="font-normal normal-case text-muted-foreground">(optional)</span>;
}

function Meter({
  value,
  min,
  max,
  label,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
}) {
  const tone = value > max ? "bg-brand-ember" : value < min ? "bg-brand-orange" : "bg-brand-olive";
  const width = Math.min(100, (value / max) * 100);
  return (
    <span className="mt-2 block">
      <span className="block h-1 w-full bg-foreground/10">
        <span className={`block h-1 ${tone}`} style={{ width: `${width}%` }} />
      </span>
      <span className="mt-1 block text-right text-[11px] text-muted-foreground">{label}</span>
    </span>
  );
}

function Results({ result, redirectNote }: { result: AuditResult; redirectNote: string }) {
  const fixes = prioritisedFixes(result.checks);
  const tone =
    result.score >= 85
      ? "text-brand-olive"
      : result.score >= 65
        ? "text-brand-orange"
        : "text-brand-ember";

  return (
    <div className="mt-12 border border-foreground/15 bg-card">
      {/* Score */}
      <div className="grid gap-8 border-b border-foreground/15 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-9">
        <ScoreDial score={result.score} tone={tone} />
        <div>
          <p className="text-xs font-bold uppercase text-brand-orange">Your audit score</p>
          <h2 className={`mt-2 font-display text-3xl font-medium md:text-4xl ${tone}`}>
            {result.band}
          </h2>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {(["pass", "warning", "fail", "info"] as const).map((status) => (
              <span key={status} className="flex items-center gap-2 text-muted-foreground">
                <span className={`h-2.5 w-2.5 ${STATUS[status].dot}`} />
                <strong className="text-foreground">{result.summary[status]}</strong>{" "}
                {status === "pass"
                  ? "passed"
                  : status === "warning"
                    ? "to review"
                    : status === "fail"
                      ? "to fix"
                      : result.summary.info === 1
                        ? "note"
                        : "notes"}
              </span>
            ))}
            <span className="text-muted-foreground">
              <strong className="text-foreground">{result.wordCount.toLocaleString()}</strong> words
            </span>
          </div>
          {redirectNote && (
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <Info size={14} className="mt-0.5 shrink-0 text-brand-olive" />
              {redirectNote}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
        {/* Categories */}
        <div className="border-b border-foreground/15 lg:border-b-0 lg:border-r">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const checks = result.checks.filter((item) => item.category === name);
            if (!checks.length) return null;
            const scored = checks.filter((item) => item.status !== "info");
            const passed = scored.filter((item) => item.status === "pass").length;
            const hasIssues = checks.some(
              (item) => item.status === "fail" || item.status === "warning",
            );
            return (
              <details
                key={name}
                open={hasIssues}
                className="group border-b border-foreground/15 last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-5 md:px-9">
                  <Icon className="shrink-0 text-brand-olive" size={20} strokeWidth={1.7} />
                  <span className="font-display text-lg">{name}</span>
                  <span className="ml-auto text-xs font-semibold text-muted-foreground">
                    {passed} of {scored.length} passed
                  </span>
                  <span className="text-brand-orange transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="space-y-1 px-6 pb-6 md:px-9">
                  {checks.map((item) => (
                    <CheckRow key={item.id} check={item} />
                  ))}
                </ul>
              </details>
            );
          })}
        </div>

        {/* Priority fixes */}
        <div className="p-6 md:p-9">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-brand-orange">
            <ListChecks size={15} /> Fix these first
          </p>
          {fixes.length ? (
            <ol className="mt-5 space-y-4">
              {fixes.map((item, index) => (
                <li key={item.id} className="flex gap-4 text-lg leading-8">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold text-primary-foreground ${STATUS[item.status].dot}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong className="block font-semibold">{item.title}</strong>
                    <span className="text-muted-foreground">{item.message}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Nothing to fix. This page is ready to publish.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckRow({ check }: { check: AuditCheck }): ReactNode {
  const status = STATUS[check.status];
  const Icon = status.icon;
  return (
    <li className="flex gap-3 border-t border-foreground/10 py-3 first:border-t-0">
      <Icon size={18} className={`mt-0.5 shrink-0 ${status.text}`} />
      <span className="text-lg leading-8">
        <span className="font-semibold">{check.title}</span>
        <span className={`ml-2 text-[11px] font-bold uppercase ${status.text}`}>
          {status.label}
        </span>
        <span className="block text-muted-foreground">{check.message}</span>
      </span>
    </li>
  );
}

function ScoreDial({ score, tone }: { score: number; tone: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className={`relative h-36 w-36 ${tone}`}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold text-foreground">{score}</span>
        <span className="text-[11px] font-semibold uppercase text-muted-foreground">
          out of 100
        </span>
      </span>
    </div>
  );
}
