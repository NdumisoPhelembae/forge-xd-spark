import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
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
  Share2,
  Sparkles,
} from "lucide-react";
import { fetchPageForAudit } from "../../lib/page-fetch";
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
  type HeadingOutlineItem,
  type OgImageCheck,
  type SocialPreview,
} from "../../lib/seo-audit";
import { CATEGORIES } from "./categories";
import { EmbedSnippet } from "./EmbedSnippet";

// The free on-page SEO audit: input form, settings and results. Used on the
// tool page and inside the embeddable widget (embedded = true).

type Source = "paste" | "file" | "url";

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

export function SeoAuditTool({ embedded = false }: { embedded?: boolean }) {
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
    // Inside the widget, scrolling would move the host page, so skip it there.
    if (embedded) return;
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function audit(
    html: string,
    extra: {
      title?: string;
      description?: string;
      slug?: string;
      pageUrl?: string;
      ogImageCheck?: OgImageCheck | undefined;
    } = {},
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
        ogImageCheck: extra.ogImageCheck,
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
        ogImageCheck: response.ogImage,
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
    <>
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
                    ? "bg-foreground text-background"
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

      {/* Embed */}
      {!embedded && (
        <div className="mx-auto mt-6 max-w-[1400px]">
          <EmbedSnippet />
        </div>
      )}

      {/* Results */}
      <div ref={resultsRef} className="mx-auto max-w-[1400px] scroll-mt-8">
        {result && <Results result={result} redirectNote={redirectNote} />}
      </div>
    </>
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
        <div className="border-b border-foreground/15 p-6 md:p-9 lg:border-b-0">
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

      {(result.social || result.outline.length > 0) && (
        <div className="grid border-t border-foreground/15 lg:grid-cols-2">
          {result.social && <SharePreview social={result.social} />}
          {result.outline.length > 0 && <HeadingOutline outline={result.outline} />}
        </div>
      )}
    </div>
  );
}

function SharePreview({ social }: { social: SocialPreview }) {
  const [broken, setBroken] = useState(false);
  let host = "";
  try {
    host = social.url ? new URL(social.url).hostname.replace(/^www\./, "") : "";
  } catch {
    host = social.url;
  }
  const image =
    social.image && !broken ? (
      <img
        src={social.image}
        alt="Share image used when this page is posted on social media"
        className="aspect-[1.91/1] w-full bg-muted object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    ) : (
      <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
        {social.image ? "Share image failed to load" : "No share image set"}
      </div>
    );
  return (
    <div className="border-b border-foreground/15 p-6 md:p-9 lg:border-b-0 lg:border-r">
      <p className="flex items-center gap-2 text-xs font-bold uppercase text-brand-orange">
        <Share2 size={15} /> Share preview
      </p>
      <p className="mt-3 text-lg leading-8 text-muted-foreground">
        How this link looks on Facebook, LinkedIn and WhatsApp.
      </p>
      <div className="mt-5 max-w-xl overflow-hidden border border-foreground/15 bg-background">
        {image}
        <div className="space-y-1 p-4">
          <p className="text-xs uppercase text-muted-foreground">{social.siteName || host}</p>
          <p className="line-clamp-2 font-semibold leading-6">
            {social.title || "No og:title, so platforms guess a title"}
          </p>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {social.description || "No og:description set."}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        X card type: <strong className="text-foreground">{social.twitterCard || "not set"}</strong>
      </p>
    </div>
  );
}

function HeadingOutline({ outline }: { outline: HeadingOutlineItem[] }) {
  return (
    <div className="p-6 md:p-9">
      <p className="flex items-center gap-2 text-xs font-bold uppercase text-brand-orange">
        <Layers size={15} /> Heading outline
      </p>
      <p className="mt-3 text-lg leading-8 text-muted-foreground">
        The full H1 to H6 structure. Orange rows skip a level.
      </p>
      <ol className="mt-5 max-h-[28rem] space-y-1 overflow-y-auto pr-2">
        {outline.map((item, index) => (
          <li
            key={index}
            className="flex items-baseline gap-3 py-1"
            style={{ paddingLeft: `${(item.level - 1) * 1.25}rem` }}
          >
            <span
              className={`w-8 shrink-0 text-xs font-bold ${item.skipped ? "text-brand-orange" : "text-muted-foreground"}`}
            >
              H{item.level}
            </span>
            <span className={item.skipped ? "text-brand-orange" : ""}>
              {item.text || <em className="text-muted-foreground">Empty heading</em>}
              {item.skipped && <span className="ml-2 text-xs uppercase">skipped level</span>}
            </span>
          </li>
        ))}
      </ol>
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
