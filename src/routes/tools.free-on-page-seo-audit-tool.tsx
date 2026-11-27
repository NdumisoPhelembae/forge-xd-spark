import { Link, createFileRoute } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  PenLine,
  RotateCcw,
  Search as SearchIcon,
  TrendingUp,
} from "lucide-react";
import formShot from "../assets/seo-audit-tool-form.webp";
import resultsShot from "../assets/seo-audit-tool-results.webp";
import { SiteHeader } from "../components/SiteHeader";
import { CATEGORIES } from "../components/seo-audit/categories";
import { SeoAuditTool } from "../components/seo-audit/SeoAuditTool";
import {
  absoluteUrl,
  breadcrumbSchema,
  canonicalLink,
  organizationSchema,
  socialMeta,
} from "../lib/site";

const PATH = "/tools/free-on-page-seo-audit-tool";
const HERO_IMAGE =
  "https://cms.forgexd.co.za/wp-content/uploads/2026/11/Creative-Team-Collaboration-with-Mandala-Graphics.png";
const TITLE = "Free On-Page SEO Audit Tool - No Sign Up | ForgeXD";
const DESCRIPTION =
  "Use our free on-page SEO audit tool to check any page in seconds. Paste content, upload a file or enter a URL and get a scored audit with clear fixes.";

export const Route = createFileRoute("/tools/free-on-page-seo-audit-tool")({
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

function FreeSeoAuditPage() {
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
        <SeoAuditTool />
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
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <figure>
              <img
                src={formShot}
                alt="Free on-page SEO audit tool form with pasted content, focus keyphrase and SEO title"
                width={1312}
                height={797}
                loading="lazy"
                decoding="async"
                className="w-full border border-foreground/15"
              />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                Add your content and focus keyphrase. The title and description meters update as you
                type.
              </figcaption>
            </figure>
            <figure>
              <img
                src={resultsShot}
                alt="Audit results showing a score of 84, check results by category and a list of fixes"
                width={1312}
                height={1000}
                loading="lazy"
                decoding="async"
                className="w-full border border-foreground/15"
              />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                Get a score out of 100, every check by category and the fixes to make first.
              </figcaption>
            </figure>
          </div>
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
