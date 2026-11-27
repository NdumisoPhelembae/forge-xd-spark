import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyzeContent,
  bandFor,
  contentMinimums,
  contentTargets,
  prioritisedFixes,
  scoreChecks,
  titlePixelWidth,
  type AuditCheck,
} from "./seo-audit";

const baseInput = {
  content:
    "The guide explains search optimization. However, useful advice follows. Therefore readers can improve pages.",
  keyphrase: "search optimization",
  contentType: "standard" as const,
  seoTitle: "Search optimization guide for your website",
  metaDescription:
    "Search optimization helps your website reach more readers. Learn practical steps, clear writing tips, and useful ways to improve your content before publishing today.",
  slug: "search-optimization-guide",
  html: false,
};

const check = (result: ReturnType<typeof analyzeContent>, id: string) =>
  result.checks.find((item) => item.id === id);

// HTML checks need a DOM parser. Browsers have one; plain Node does not.
const hasDom = typeof DOMParser !== "undefined";

describe("SEO audit rules", () => {
  it("keeps the agreed minimum and best word counts", () => {
    assert.deepEqual(contentMinimums, { standard: 500, cornerstone: 900, product: 200 });
    assert.deepEqual(contentTargets, { standard: 500, cornerstone: 1500, product: 200 });
  });

  it("warns cornerstone content between 900 and 1,500 words", () => {
    const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
    const status = (n: number) =>
      check(
        analyzeContent({ ...baseInput, contentType: "cornerstone", content: words(n) }),
        "word-count",
      )?.status;
    assert.equal(status(899), "fail");
    assert.equal(status(900), "warning");
    assert.equal(status(1499), "warning");
    assert.equal(status(1500), "pass");
  });

  it("checks the opening paragraph for the keyphrase", () => {
    const result = analyzeContent({
      ...baseInput,
      content: "Start with something else.\n\nSearch optimization comes later.",
    });
    assert.equal(check(result, "keyphrase-first")?.status, "fail");
  });

  it("accepts keyphrase density at the 0.5% lower threshold", () => {
    const words = Array.from({ length: 199 }, (_, index) => `word${index}`);
    words[0] = "search";
    words[1] = "optimization";
    const result = analyzeContent({ ...baseInput, content: words.join(" ") });
    assert.equal(check(result, "keyphrase-density")?.status, "pass");
  });

  it("does not reward furthermore or moreover as transitions", () => {
    const result = analyzeContent({
      ...baseInput,
      content: "Furthermore, this is one idea. Moreover, this is another idea.",
    });
    assert.match(check(result, "transitions")?.message ?? "", /0 of 2 sentences/);
    assert.equal(check(result, "robotic-phrases")?.status, "warning");
  });
});

describe("Keyphrase matching", () => {
  it("matches the opening on the keyphrase's main words in any order", () => {
    const result = analyzeContent({
      ...baseInput,
      content:
        "Good optimization for search starts with a clear page and a focused topic.\n\nMore text.",
    });
    assert.equal(check(result, "keyphrase-first")?.status, "pass");
  });

  it("skips short labels when finding the opening paragraph", () => {
    const result = analyzeContent({
      ...baseInput,
      content:
        "Free tools\n\nSearch optimization is easier when every page has one clear topic and goal.",
    });
    assert.equal(check(result, "keyphrase-first")?.status, "pass");
  });

  it("gives partial credit to a slug with some of the keyphrase", () => {
    const result = analyzeContent({
      ...baseInput,
      keyphrase: "free seo audit tool",
      slug: "free-seo-checker",
    });
    assert.equal(check(result, "slug-phrase")?.status, "warning");
  });

  it("needs three financial mentions before asking for a risk disclaimer", () => {
    const once = analyzeContent({
      ...baseInput,
      content: "We grew a forex education site through search.",
    });
    const often = analyzeContent({
      ...baseInput,
      content: "Forex trading is risky. Trading forex needs a plan. Forex rewards discipline.",
    });
    assert.equal(check(once, "risk-disclaimer")?.status, "pass");
    assert.equal(check(often, "risk-disclaimer")?.status, "fail");
  });
});

describe("Title width", () => {
  it("measures titles in pixels, not characters", () => {
    assert.ok(titlePixelWidth("iiiiiiiiii") < titlePixelWidth("WWWWWWWWWW"));
    assert.equal(titlePixelWidth(""), 0);
  });

  it("fails titles wider than 600px and warns under 400px", () => {
    const wide = analyzeContent({ ...baseInput, seoTitle: "W".repeat(40) });
    const narrow = analyzeContent({ ...baseInput, seoTitle: "Search optimization" });
    const right = analyzeContent({
      ...baseInput,
      seoTitle: "Search optimization guide: 12 fixes to rank higher in 2026",
    });
    assert.equal(check(wide, "seo-title-length")?.status, "fail");
    assert.equal(check(narrow, "seo-title-length")?.status, "warning");
    assert.equal(check(right, "seo-title-length")?.status, "pass");
  });
});

describe("Scoring", () => {
  const make = (status: AuditCheck["status"], weight: number): AuditCheck => ({
    id: `c${weight}${status}`,
    category: "Keyphrase",
    title: "",
    status,
    message: "",
    priority: 1,
    weight,
  });

  it("gives warnings half credit and ignores info results", () => {
    assert.equal(scoreChecks([make("pass", 4), make("warning", 4), make("info", 9)]), 75);
    assert.equal(scoreChecks([make("fail", 2), make("pass", 2)]), 50);
    assert.equal(scoreChecks([make("info", 5)]), 0);
  });

  it("does not penalise blank optional fields", () => {
    const blank = analyzeContent({ ...baseInput, seoTitle: "", metaDescription: "", slug: "" });
    for (const id of [
      "seo-title-phrase",
      "seo-title-length",
      "meta-phrase",
      "meta-length",
      "slug-phrase",
    ]) {
      assert.equal(check(blank, id)?.status, "info", id);
    }
  });

  it("puts every boundary in the right band", () => {
    assert.equal(bandFor(0), "Major issues, do not publish yet");
    assert.equal(bandFor(39), "Major issues, do not publish yet");
    assert.equal(bandFor(40), "Needs real work");
    assert.equal(bandFor(64), "Needs real work");
    assert.equal(bandFor(65), "Good, a few fixes first");
    assert.equal(bandFor(84), "Good, a few fixes first");
    assert.equal(bandFor(85), "Great, ready to publish");
    assert.equal(bandFor(100), "Great, ready to publish");
  });

  it("orders fixes by status then weight", () => {
    const order = prioritisedFixes([
      make("warning", 9),
      make("fail", 2),
      make("fail", 8),
      make("pass", 9),
    ]);
    assert.deepEqual(
      order.map((item) => [item.status, item.weight]),
      [
        ["fail", 8],
        ["fail", 2],
        ["warning", 9],
      ],
    );
  });
});

describe("Links in pasted HTML", { skip: !hasDom }, () => {
  const html = (links: string) =>
    `<h1>Search optimization</h1><p>Search optimization starts here. ${links}</p>`;

  it("treats absolute links to other sites as outbound when no page URL is known", () => {
    const result = analyzeContent({
      ...baseInput,
      html: true,
      slug: "",
      content: html(
        "<a href='/blog/one'>one</a> <a href='/blog/two'>two</a> <a href='https://example.com/x'>source</a>",
      ),
    });
    assert.match(check(result, "internal-links")?.message ?? "", /^2 internal links/);
    assert.match(check(result, "outbound-links")?.message ?? "", /^1 outbound link/);
  });

  it("uses the page domain from a full URL slug, ignoring www", () => {
    const result = analyzeContent({
      ...baseInput,
      html: true,
      slug: "https://www.ghosttraders.co/forex-guide",
      content: html(
        "<a href='https://ghosttraders.co/a'>a</a> <a href='https://www.ghosttraders.co/b'>b</a>",
      ),
    });
    assert.match(check(result, "internal-links")?.message ?? "", /^2 internal links/);
  });

  it("never scores the outbound link count", () => {
    const result = analyzeContent({ ...baseInput, html: true, content: html("") });
    assert.equal(check(result, "outbound-links")?.status, "info");
  });

  it("ignores decorative images hidden from screen readers", () => {
    const result = analyzeContent({
      ...baseInput,
      html: true,
      content: html(
        "<img src='/p.png' alt='' aria-hidden='true'><img src='/q.png' alt='Search optimization chart'>",
      ),
    });
    assert.equal(check(result, "image-alt")?.status, "pass");
    assert.match(check(result, "image-count")?.message ?? "", /^1 image/);
  });

  it("still fails an outbound link that uses the keyphrase as anchor text", () => {
    const result = analyzeContent({
      ...baseInput,
      html: true,
      content: html("<a href='https://example.com'>search optimization</a>"),
    });
    assert.equal(check(result, "outbound-anchor")?.status, "fail");
  });
});

describe("Full page audits", { skip: !hasDom }, () => {
  // Mirrors a real WordPress post: hero H1 outside <main>, menu, share buttons,
  // author box, related posts and footer around the article body.
  const body = Array.from(
    { length: 12 },
    (_, i) =>
      `<p>Paragraph ${i} explains market structure for traders who want a clear directional bias before any entry on the chart.</p>`,
  ).join("");
  const page = `<!doctype html><html><head><title>Free Market Structure Course</title>
    <link rel="canonical" href="https://ghosttraders.co/free-course/"></head><body>
    <nav><a href="/">Home</a><a href="/courses/">Courses</a><a href="/blog/">Blog</a><a href="https://t.me/x">Telegram</a></nav>
    <section class="gt-art-hero"><p>SMART MONEY CONCEPTS</p><h1>Free Market Structure Course</h1></section>
    <main><article><div class="featured-image"><img src="/hero.png" alt=""></div>
      <div class="entry-content">
        <p>The free market structure course on GhostTraders fixes the order: direction first.</p>
        <h2>Why market structure comes first</h2>${body}
        <h2>What the course covers</h2><p>See the <a href="/courses/free-course/">course</a> and <a href="https://ghosttraders.co/best-courses/">guide</a>.</p>
        <div class="gt-share"><a href="https://www.facebook.com/sharer/sharer.php?u=x">Facebook</a><a href="https://ghosttraders.co/?p=33036">More</a></div>
      </div>
      <aside class="author-box"><img src="/me.png" alt="Ndumiso"><a href="/author/">Ndumiso</a></aside>
    </article></main>
    <section class="related"><h2>Keep reading</h2><a href="/a/"><img src="/a.png" alt="A"></a><a href="/b/"><img src="/b.png" alt=""></a></section>
    <footer><h3>Trading Tools</h3><a href="/calc/">Calc</a><a href="https://instagram.com/gt">Instagram</a></footer>
    </body></html>`;
  const result = analyzeContent({
    ...baseInput,
    keyphrase: "market structure",
    content: page,
    html: true,
    slug: "",
    pageUrl: "https://ghosttraders.co/free-course/",
  });

  it("reads the opening from the article, not the hero", () => {
    assert.equal(check(result, "keyphrase-first")?.status, "pass");
  });

  it("counts only links inside the article, without share buttons", () => {
    assert.match(check(result, "internal-links")?.message ?? "", /^2 internal links/);
    assert.match(check(result, "outbound-links")?.message ?? "", /^No outbound links/);
  });

  it("counts article headings and images, plus the featured image", () => {
    assert.match(check(result, "keyphrase-headings")?.message ?? "", /of 2 subheadings/);
    assert.match(
      check(result, "image-count")?.message ?? "",
      /^1 image in the content, including the featured image/,
    );
    assert.equal(check(result, "image-alt")?.status, "fail");
  });

  it("finds the H1 in the page header and splits sections at nested headings", () => {
    assert.equal(check(result, "single-h1")?.status, "pass");
    assert.match(check(result, "section-length")?.message ?? "", /^No section exceeds 300 words/);
  });

  it("flags a live page with no meta description tag", () => {
    assert.equal(check(result, "meta-tag-live")?.status, "fail");
  });

  it("leaves the footer and related posts out of the word count", () => {
    assert.ok(result.wordCount < 300, String(result.wordCount));
  });
});

describe("Social sharing, outline and anchors", { skip: !hasDom }, () => {
  const page = (head: string, body: string) =>
    `<!doctype html><html><head><title>Search optimization guide</title>
      <link rel="canonical" href="https://example.com/guide/">${head}</head>
      <body><main><article><h1>Search optimization guide</h1><div class="entry-content">
      <p>Search optimization works best when every page has one clear topic for readers.</p>${body}
      </div></article></main></body></html>`;
  const run = (head: string, body = "", extra = {}) =>
    analyzeContent({
      ...baseInput,
      html: true,
      slug: "",
      pageUrl: "https://example.com/guide/",
      content: page(head, body),
      ...extra,
    });

  it("checks Open Graph and X tags and builds a share preview", () => {
    const full = run(
      `<meta property="og:title" content="Search optimization guide"><meta property="og:description" content="A short guide.">
       <meta property="og:image" content="https://example.com/og.png"><meta property="og:url" content="https://example.com/guide">
       <meta name="twitter:card" content="summary_large_image">`,
      "",
      { ogImageCheck: { url: "https://example.com/og.png", ok: true, status: 200 } },
    );
    for (const id of [
      "og-title",
      "og-description",
      "og-image",
      "og-image-loads",
      "og-url",
      "twitter-card",
    ]) {
      assert.equal(check(full, id)?.status, "pass", id);
    }
    assert.equal(full.social?.image, "https://example.com/og.png");

    const bare = run("");
    assert.equal(check(bare, "og-title")?.status, "fail");
    assert.equal(check(bare, "og-image")?.status, "fail");
    assert.equal(check(bare, "twitter-card")?.status, "warning");
  });

  it("fails a share image that does not load", () => {
    const result = run(`<meta property="og:image" content="https://example.com/missing.png">`, "", {
      ogImageCheck: { url: "https://example.com/missing.png", ok: false, status: 404 },
    });
    assert.equal(check(result, "og-image-loads")?.status, "fail");
  });

  it("flags vague anchor text", () => {
    const result = run(
      "",
      "<p>Read the guide <a href='/a/'>click here</a> or <a href='/b/'>our keyword research guide</a>.</p>",
    );
    assert.equal(check(result, "generic-anchors")?.status, "warning");
    assert.match(check(result, "generic-anchors")?.message ?? "", /“click here”/);
  });

  it("returns the heading outline with skipped levels marked", () => {
    const result = run(
      "",
      "<h2>First</h2><p>Text here for this part.</p><h4>Deep</h4><p>More text.</p>",
    );
    assert.deepEqual(
      result.outline.map((item) => [item.level, item.skipped]),
      [
        [1, false],
        [2, false],
        [4, true],
      ],
    );
  });
});
