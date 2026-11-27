// "info" results are shown to the user but never counted in the score:
// blank optional fields, plain text without markup, and informational counts.
export type AuditStatus = "pass" | "warning" | "fail" | "info";
export type AuditCategory =
  "Keyphrase" | "Readability" | "Structure" | "Content Quality" | "Images";
export type ContentType = "standard" | "cornerstone" | "product";

export type AuditCheck = {
  id: string;
  category: AuditCategory;
  title: string;
  status: AuditStatus;
  message: string;
  priority: number;
  // How much the check matters to the score, 1 (minor) to 9 (critical).
  weight: number;
};

export type AuditInput = {
  content: string;
  keyphrase: string;
  contentType: ContentType;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  html: boolean;
  pageUrl?: string | undefined;
};

export type AuditResult = {
  score: number;
  band: string;
  summary: { pass: number; warning: number; fail: number; info: number };
  checks: AuditCheck[];
  wordCount: number;
};

const MIN_WORDS: Record<ContentType, number> = {
  standard: 500,
  cornerstone: 900,
  product: 200,
};
// Best length per content type. Between the minimum and this target the check
// is a warning; at or above it, a pass.
const TARGET_WORDS: Record<ContentType, number> = {
  standard: 500,
  cornerstone: 1500,
  product: 200,
};

const ROBOTIC_PHRASES = [
  "leverage",
  "delve",
  "seamlessly",
  "robust",
  "cutting edge",
  "cutting-edge",
  "game changer",
  "game-changing",
  "in today's fast-paced",
  "unlock the power",
  "in conclusion",
  "revolutionize",
  "revolutionary",
  "navigate the landscape",
  "harness",
  "synergy",
  "furthermore",
  "moreover",
];
// Furthermore and moreover are flagged above as overused, so they are not
// rewarded as transition words below.
const TRANSITIONS = [
  "additionally",
  "after",
  "afterward",
  "afterwards",
  "again",
  "also",
  "although",
  "as a result",
  "as a consequence",
  "at first",
  "at the same time",
  "because",
  "before",
  "besides",
  "but",
  "consequently",
  "conversely",
  "earlier",
  "eventually",
  "finally",
  "first",
  "firstly",
  "for example",
  "for instance",
  "hence",
  "however",
  "in addition",
  "in contrast",
  "in fact",
  "in other words",
  "in particular",
  "instead",
  "later",
  "likewise",
  "meanwhile",
  "more importantly",
  "nevertheless",
  "next",
  "nonetheless",
  "on the contrary",
  "on the other hand",
  "once",
  "otherwise",
  "overall",
  "secondly",
  "similarly",
  "specifically",
  "still",
  "subsequently",
  "then",
  "therefore",
  "thirdly",
  "thus",
  "to begin with",
  "to conclude",
  "ultimately",
  "when",
  "while",
  "yet",
  "since",
  "so",
];
const FINANCIAL_TERMS =
  /\b(trading|forex|crypto(?:currency)?|investment|investing|financial advice|stock market|shares|securities|capital markets)\b/i;
const RISK_TERMS =
  /\b(?:not financial advice|not investment advice|not financial or investment advice|does not constitute (?:financial or investment|financial|investment) advice|at your own risk|risk warning|risk disclaimer|risk disclosure|past performance|you could lose|may lose|capital at risk|not a recommendation|high level of risk|educational purposes only|may not be suitable for all investors)\b/i;

// Weight of each check in the score (1 minor to 9 critical). Modelled on the
// relative weights Yoast and Rank Math give the same checks.
const WEIGHTS: Record<string, number> = {
  "keyphrase-first": 8,
  "seo-title-phrase": 9,
  "seo-title-length": 6,
  "meta-phrase": 6,
  "meta-length": 6,
  "meta-tag-live": 6,
  "slug-phrase": 5,
  "keyphrase-density": 8,
  "keyphrase-spread": 4,
  "keyphrase-headings": 5,
  "long-sentences": 4,
  "passive-voice": 3,
  "paragraph-length": 4,
  "repeated-openings": 2,
  transitions: 3,
  "single-h1": 8,
  "section-length": 4,
  "word-count": 7,
  "heading-order": 4,
  "dash-punctuation": 2,
  "robotic-phrases": 2,
  "risk-disclaimer": 6,
  "internal-links": 5,
  "outbound-links": 0,
  "outbound-anchor": 4,
  "image-count": 3,
  "image-alt": 6,
  "image-keyphrase-alt": 2,
  "image-vague-alt": 3,
};

// Google truncates titles by pixel width (about 600px on desktop), not by
// character count. Widths are Arial advance widths (units per 1000) at the
// 20px size Google uses for result titles. Deterministic, so it gives the same
// answer in the browser, on the server and in tests.
const ARIAL_WIDTHS: Record<string, number> = {
  a: 556,
  b: 556,
  c: 500,
  d: 556,
  e: 556,
  f: 278,
  g: 556,
  h: 556,
  i: 222,
  j: 222,
  k: 500,
  l: 222,
  m: 833,
  n: 556,
  o: 556,
  p: 556,
  q: 556,
  r: 333,
  s: 500,
  t: 278,
  u: 556,
  v: 500,
  w: 722,
  x: 500,
  y: 500,
  z: 500,
  A: 667,
  B: 667,
  C: 722,
  D: 722,
  E: 667,
  F: 611,
  G: 778,
  H: 722,
  I: 278,
  J: 500,
  K: 667,
  L: 556,
  M: 833,
  N: 722,
  O: 778,
  P: 667,
  Q: 778,
  R: 722,
  S: 667,
  T: 611,
  U: 722,
  V: 667,
  W: 944,
  X: 667,
  Y: 667,
  Z: 611,
  " ": 278,
  ".": 278,
  ",": 278,
  ":": 278,
  ";": 278,
  "!": 278,
  "?": 556,
  "'": 191,
  "’": 222,
  '"': 355,
  "-": 333,
  "|": 260,
  "(": 333,
  ")": 333,
  "&": 667,
  "/": 278,
  "%": 889,
  "+": 584,
  "@": 1015,
};
export const TITLE_MIN_PX = 400;
export const TITLE_MAX_PX = 600;

export function titlePixelWidth(title: string) {
  let units = 0;
  for (const char of title) units += ARIAL_WIDTHS[char] ?? 556;
  return Math.round((units / 1000) * 20);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countPhrase(text: string, phrase: string) {
  if (!phrase.trim()) return 0;
  const matches = text.match(new RegExp(`\\b${escapeRegExp(phrase.trim())}\\b`, "gi"));
  return matches?.length ?? 0;
}

function normalizedPhrase(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function splitSentences(text: string) {
  const units: string[] = [];
  const blocks = text.replace(/\r\n?/g, "\n").split(/\n\s*\n+/);

  for (const block of blocks) {
    let currentLines: string[] = [];
    const flush = () => {
      const value = currentLines.join(" ").trim();
      if (value) units.push(value);
      currentLines = [];
    };

    for (const line of block
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)) {
      if (isHeadingOrTableRow(line)) {
        flush();
      } else {
        currentLines.push(line.replace(/^[-*+]\s+/, ""));
      }
    }
    flush();
  }

  return units.flatMap((unit) => {
    const protectedText = unit
      .replace(/\b(e\.g|i\.e|mr|mrs|ms|dr|prof|vs|etc|fig|no)\./gi, "$1\uE000")
      .replace(/(\d)\.(\d)/g, "$1\uE001$2");
    return (protectedText.match(/[^.!?]+[.!?]+["'’”)}\]]*|[^.!?]+$/g) ?? [])
      .map((item) =>
        item
          .replace(/\uE000/g, ".")
          .replace(/\uE001/g, ".")
          .trim(),
      )
      .filter(Boolean);
  });
}

function isHeadingOrTableRow(line: string) {
  const value = line.replace(/^#{1,6}\s+/, "").trim();
  if (!value || /[\t|]/.test(value)) return true;
  if (/^step\s+\d+\b/i.test(value) && !/[.!?]["'’”)}\]]?$/.test(value)) return true;
  if (/[.!?]["'’”)}\]]?$/.test(value)) return false;

  const words = value.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  if (words.length > 14 || value.length > 140) return false;
  const titleCaseWords = words.filter((word) => /^[\p{Lu}\d]/u.test(word)).length;
  return value.endsWith(":") || (words.length > 0 && titleCaseWords / words.length >= 0.6);
}

function wordCount(text: string) {
  return text.trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

// Where the article usually lives, most specific first (WordPress themes,
// page builders, then generic HTML5).
const CONTENT_SELECTORS = [
  ".entry-content",
  "[itemprop='articleBody']",
  ".post-content",
  ".article-content",
  ".article-body",
  ".post-body",
  ".content-body",
  "article",
  "main",
  "[role='main']",
  "#content",
];

// Page furniture that is not part of the content: menus, footers, sidebars,
// share buttons, author boxes, newsletter forms, comments and related posts.
const BOILERPLATE = [
  "header",
  "nav",
  "footer",
  "aside",
  "form",
  "[role='navigation']",
  "[role='banner']",
  "[role='contentinfo']",
  "[role='complementary']",
  "[class*='share']",
  "[class*='social']",
  "[class*='related']",
  "[class*='author']",
  "[class*='newsletter']",
  "[class*='subscribe']",
  "[class*='comment']",
  "[id*='comment']",
  "[class*='breadcrumb']",
  "[class*='sidebar']",
  "[class*='widget']",
  "[class*='cookie']",
  ".sharedaddy",
].join(", ");

const FEATURED_IMAGE =
  ".featured-image img, .post-thumbnail img, img.wp-post-image, .page-header-image-single img";

// Share buttons are not real links to or from the content.
const SHARE_LINK =
  /(facebook\.com\/sharer|twitter\.com\/intent|x\.com\/intent|reddit\.com\/submit|telegram\.me\/share|t\.me\/share|whatsapp\.com\/send|wa\.me\/|pinterest\.com\/pin|linkedin\.com\/(sharing|shareArticle)|mailto:\?)/i;

function isFullPage(html: string, doc: Document) {
  return (
    /<(html|head|body)\b/i.test(html) ||
    !!doc.querySelector("header nav, body > header, body > footer")
  );
}

function pickContentRoot(doc: Document, fullPage: boolean): Element | null {
  if (!fullPage) return doc.body;
  for (const selector of CONTENT_SELECTORS) {
    for (const candidate of Array.from(doc.querySelectorAll(selector))) {
      const trial = candidate.cloneNode(true) as Element;
      trial.querySelectorAll(BOILERPLATE).forEach((item) => item.remove());
      if (wordCount(trial.textContent ?? "") >= 80) return candidate;
    }
  }
  return doc.body;
}

function safeText(html: string) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed
    .querySelectorAll("script, style, noscript, template, svg, iframe")
    .forEach((item) => item.remove());
  const fullPage = isFullPage(html, parsed);
  const source = pickContentRoot(parsed, fullPage) ?? parsed.body;
  // Featured images sit outside the article body in most themes but belong to it.
  const featured = fullPage
    ? Array.from(parsed.querySelectorAll(FEATURED_IMAGE))
        .filter((img) => !source?.contains(img))
        .slice(0, 1)
    : [];
  const root = (source?.cloneNode(true) as Element | undefined) ?? parsed.createElement("div");
  if (fullPage) root.querySelectorAll(BOILERPLATE).forEach((item) => item.remove());

  // Text view of the content, keeping paragraph breaks.
  const textRoot = root.cloneNode(true) as Element;
  textRoot.querySelectorAll("table").forEach((table) => {
    const rows = Array.from(table.querySelectorAll("tr"))
      .map((row) =>
        Array.from(row.querySelectorAll("th, td"))
          .map((cell) => cell.textContent?.trim() ?? "")
          .join("\t"),
      )
      .filter(Boolean);
    table.replaceWith(parsed.createTextNode(`\n\n${rows.join("\n")}\n\n`));
  });
  textRoot
    .querySelectorAll("br")
    .forEach((item) => item.replaceWith(parsed.createTextNode("\n\n")));
  textRoot
    .querySelectorAll(
      "address, article, blockquote, dd, div, dl, dt, footer, h1, h2, h3, h4, h5, h6, li, main, ol, p, section, ul",
    )
    .forEach((item) => {
      item.prepend(parsed.createTextNode("\n\n"));
      item.append(parsed.createTextNode("\n\n"));
    });
  const text =
    textRoot.textContent
      ?.replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() ?? "";
  return { document: parsed, root, featured, fullPage, text };
}

// Splits content into runs of text between headings, in document order, at any
// nesting depth (page builders wrap everything in divs).
const SECTION_BLOCKS = "h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, dd, dt, td, th";
function sectionsOf(root: Element) {
  const result: string[] = [];
  let current: string[] = [];
  for (const block of Array.from(root.querySelectorAll(SECTION_BLOCKS))) {
    // Skip blocks nested in another counted block (a p inside an li).
    if (
      block.parentElement?.closest(SECTION_BLOCKS) &&
      root.contains(block.parentElement.closest(SECTION_BLOCKS))
    )
      continue;
    if (/^H[1-6]$/.test(block.tagName)) {
      if (current.length) result.push(current.join(" "));
      current = [];
    } else {
      current.push(block.textContent ?? "");
    }
  }
  if (current.length) result.push(current.join(" "));
  return result;
}

function addCheck(
  checks: AuditCheck[],
  id: string,
  category: AuditCategory,
  title: string,
  status: AuditStatus,
  message: string,
  priority: number,
) {
  checks.push({ id, category, title, status, message, priority, weight: WEIGHTS[id] ?? 3 });
}

function statusForRange(value: number, min: number, max: number, wiggle: number) {
  if (value >= min && value <= max) return "pass" as const;
  if ((value >= min - wiggle && value < min) || (value > max && value <= max + wiggle))
    return "warning" as const;
  return "fail" as const;
}

export function analyzeContent(input: AuditInput): AuditResult {
  const html = input.html;
  const parsed = html ? safeText(input.content) : null;
  const text =
    parsed?.text ??
    input.content
      .replace(/<[^>]*>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\r\n?/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  const words = wordCount(text);
  const phrase = input.keyphrase.trim();
  const checks: AuditCheck[] = [];
  const paragraphs = html
    ? Array.from(parsed?.root.querySelectorAll("p") ?? [])
        .map((el) => el.textContent?.trim() ?? "")
        .filter(Boolean)
    : input.content
        .split(/\n\s*\n/)
        .map((item) => item.trim())
        .filter(Boolean);
  const firstParagraph = paragraphs[0] ?? text.slice(0, 240);
  const headings = html
    ? Array.from(parsed?.root.querySelectorAll("h2, h3, h4, h5, h6") ?? [])
        .map((el) => el.textContent?.trim() ?? "")
        .filter(Boolean)
    : [];
  const pageH1 = parsed?.document.querySelector("h1");
  const contentHeadings = Array.from(parsed?.root.querySelectorAll("h1, h2, h3, h4, h5, h6") ?? []);
  // Many themes print the H1 in a page header outside the article body.
  const allHeadings = html
    ? pageH1 && !contentHeadings.some((heading) => heading.tagName === "H1")
      ? [pageH1, ...contentHeadings]
      : contentHeadings
    : [];
  const occurrences = countPhrase(text, phrase);
  // Yoast's formula: keyphrase matches per 100 words.
  const density = words ? (occurrences * 100) / words : 0;
  const phraseRE = new RegExp(escapeRegExp(normalizedPhrase(phrase)).replace(/\s+/g, "\\s+"), "i");

  const firstStatus = phraseRE.test(normalizedPhrase(firstParagraph)) ? "pass" : "fail";
  addCheck(
    checks,
    "keyphrase-first",
    "Keyphrase",
    "Keyphrase in the opening",
    firstStatus,
    firstStatus === "pass"
      ? `“${phrase}” appears in the opening paragraph.`
      : `Add “${phrase}” to the opening paragraph so readers and search engines see the topic immediately.`,
    1,
  );

  if (input.seoTitle.trim()) {
    const title = input.seoTitle.trim();
    const titleIndex = normalizedPhrase(title).indexOf(normalizedPhrase(phrase));
    const nearStart = titleIndex >= 0 && titleIndex <= Math.max(12, Math.floor(title.length * 0.3));
    addCheck(
      checks,
      "seo-title-phrase",
      "Keyphrase",
      "Keyphrase near the start of SEO title",
      nearStart ? "pass" : titleIndex >= 0 ? "warning" : "fail",
      titleIndex < 0
        ? `Add “${phrase}” to the SEO title.`
        : nearStart
          ? `The keyphrase appears near the beginning of your ${title.length}-character title.`
          : `Move “${phrase}” closer to the beginning of your title.`,
      2,
    );
    const px = titlePixelWidth(title);
    const widthStatus = px > TITLE_MAX_PX ? "fail" : px < TITLE_MIN_PX ? "warning" : "pass";
    addCheck(
      checks,
      "seo-title-length",
      "Keyphrase",
      "SEO title width",
      widthStatus,
      widthStatus === "pass"
        ? `Your title is about ${px}px wide (${title.length} characters), inside Google's ${TITLE_MIN_PX} to ${TITLE_MAX_PX}px display width.`
        : widthStatus === "fail"
          ? `Your title is about ${px}px wide (${title.length} characters). Google cuts titles at around ${TITLE_MAX_PX}px, so shorten it or use narrower words.`
          : `Your title is about ${px}px wide (${title.length} characters). You have room to add a benefit or your brand name; aim for ${TITLE_MIN_PX} to ${TITLE_MAX_PX}px.`,
      3,
    );
  } else {
    addCheck(
      checks,
      "seo-title-phrase",
      "Keyphrase",
      "Keyphrase near the start of SEO title",
      "info",
      "Add an SEO title to check whether the keyphrase appears near its beginning.",
      2,
    );
    addCheck(
      checks,
      "seo-title-length",
      "Keyphrase",
      "SEO title width",
      "info",
      "Add an SEO title to check it fits Google's display width.",
      3,
    );
  }

  if (input.metaDescription.trim()) {
    const description = input.metaDescription.trim();
    const hasPhrase = phraseRE.test(normalizedPhrase(description));
    addCheck(
      checks,
      "meta-phrase",
      "Keyphrase",
      "Keyphrase in meta description",
      hasPhrase ? "pass" : "fail",
      hasPhrase
        ? "Your meta description includes the keyphrase."
        : `Include “${phrase}” in your meta description.`,
      4,
    );
    const lengthStatus = statusForRange(description.length, 120, 156, 10);
    addCheck(
      checks,
      "meta-length",
      "Keyphrase",
      "Meta description length",
      lengthStatus,
      `${description.length} characters. Aim for 120 to 156 characters.`,
      5,
    );
  } else {
    addCheck(
      checks,
      "meta-phrase",
      "Keyphrase",
      "Keyphrase in meta description",
      "info",
      "Add a meta description to check for the keyphrase.",
      4,
    );
    addCheck(
      checks,
      "meta-length",
      "Keyphrase",
      "Meta description length",
      "info",
      "Add a meta description to check its 120 to 156 character length.",
      5,
    );
  }

  // A fetched page with no meta description tag: Google writes its own snippet.
  if (parsed?.fullPage) {
    const liveMeta = parsed.document
      .querySelector('meta[name="description" i]')
      ?.getAttribute("content")
      ?.trim();
    addCheck(
      checks,
      "meta-tag-live",
      "Keyphrase",
      "Meta description tag on the page",
      liveMeta ? "pass" : "fail",
      liveMeta
        ? "The page has a meta description tag."
        : "The page has no meta description tag, so Google writes its own snippet. Set one in your SEO plugin.",
      5,
    );
  }

  if (input.slug.trim()) {
    const slug = normalizedPhrase(
      input.slug.replace(/^https?:\/\/[^/]+\//, "").split("?")[0] ?? input.slug,
    );
    const slugHasPhrase = phraseRE.test(slug);
    addCheck(
      checks,
      "slug-phrase",
      "Keyphrase",
      "Keyphrase in URL slug",
      slugHasPhrase ? "pass" : "fail",
      slugHasPhrase
        ? `The slug contains “${phrase}”.`
        : `Add a short, hyphenated version of “${phrase}” to the URL slug.`,
      6,
    );
  } else {
    addCheck(
      checks,
      "slug-phrase",
      "Keyphrase",
      "Keyphrase in URL slug",
      "info",
      "Add a URL slug to check whether it contains a clean version of the keyphrase.",
      6,
    );
  }

  const densityStatus = statusForRange(density, 0.5, 3, 0.1);
  const lowerOccurrences = Math.ceil(words * 0.005);
  addCheck(
    checks,
    "keyphrase-density",
    "Keyphrase",
    "Keyphrase use across the page",
    densityStatus,
    `“${phrase}” appears ${occurrences} ${occurrences === 1 ? "time" : "times"} in ${words.toLocaleString()} words (${density.toFixed(2)}% density). Aim for 0.5% to 3%.${density < 0.5 ? ` Add it naturally at least ${Math.max(1, lowerOccurrences - occurrences)} more ${lowerOccurrences - occurrences === 1 ? "time" : "times"}, including later sections.` : density > 3 ? " Reduce repeated uses to avoid keyword stuffing." : ""}`,
    7,
  );

  if (paragraphs.length >= 3) {
    const positions = paragraphs
      .map((paragraph, index) =>
        phraseRE.test(normalizedPhrase(paragraph))
          ? index / Math.max(1, paragraphs.length - 1)
          : null,
      )
      .filter((position): position is number => position !== null);
    const spread = positions.length > 1 && Math.max(...positions) - Math.min(...positions) >= 0.55;
    addCheck(
      checks,
      "keyphrase-spread",
      "Keyphrase",
      "Keyphrase spread",
      spread ? "pass" : occurrences > 0 ? "warning" : "fail",
      spread
        ? `The keyphrase appears across ${positions.length} paragraphs from beginning to end.`
        : `The keyphrase is concentrated in ${positions.length} ${positions.length === 1 ? "paragraph" : "paragraphs"}. Spread it through the middle and conclusion.`,
      8,
    );
  } else {
    addCheck(
      checks,
      "keyphrase-spread",
      "Keyphrase",
      "Keyphrase spread",
      "info",
      "Add at least three paragraphs to assess whether the keyphrase is distributed throughout.",
      8,
    );
  }

  if (headings.length) {
    const headingMatches = headings.filter((heading) =>
      phraseRE.test(normalizedPhrase(heading)),
    ).length;
    const headingRate = (headingMatches / headings.length) * 100;
    const headingStatus = statusForRange(headingRate, 30, 75, 10);
    addCheck(
      checks,
      "keyphrase-headings",
      "Keyphrase",
      "Keyphrase in subheadings",
      headingStatus,
      `${headingMatches} of ${headings.length} subheadings (${headingRate.toFixed(0)}%) contain the keyphrase or close wording. Aim for 30% to 75%.`,
      9,
    );
  } else {
    addCheck(
      checks,
      "keyphrase-headings",
      "Keyphrase",
      "Keyphrase in subheadings",
      html ? "warning" : "info",
      html
        ? "Add subheadings that use the keyphrase or close wording."
        : "Paste HTML or enter a URL to check your subheadings.",
      9,
    );
  }

  const sentences = splitSentences(text);
  const longSentences = sentences.filter((sentence) => wordCount(sentence) > 20).length;
  const longRate = sentences.length ? (longSentences / sentences.length) * 100 : 0;
  const longStatus = longRate <= 25 ? "pass" : longRate <= 30 ? "warning" : "fail";
  addCheck(
    checks,
    "long-sentences",
    "Readability",
    "Long sentences",
    longStatus,
    `${longSentences} of ${sentences.length} sentences (${longRate.toFixed(0)}%) exceed 20 words. Keep this below 25%.`,
    10,
  );

  const passivePattern =
    /\b(?:am|is|are|was|were|be|been|being|get|got)\s+(?:\w+ed|written|given|known|made|taken|seen|shown|built|done|found|left|sent|sold|told|bought|brought|kept|held|paid|read|run|set|spent|thought|won)\b/i;
  const passiveSentences = sentences.filter((sentence) => passivePattern.test(sentence)).length;
  const passiveRate = sentences.length ? (passiveSentences / sentences.length) * 100 : 0;
  const passiveStatus = passiveRate <= 10 ? (passiveRate > 8 ? "warning" : "pass") : "fail";
  addCheck(
    checks,
    "passive-voice",
    "Readability",
    "Passive voice",
    passiveStatus,
    `${passiveSentences} of ${sentences.length} sentences (${passiveRate.toFixed(0)}%) may use passive voice. Keep it at or below 10%.`,
    11,
  );

  const longestParagraph = Math.max(0, ...paragraphs.map(wordCount));
  const longParagraphs = paragraphs.filter((paragraph) => wordCount(paragraph) > 150).length;
  addCheck(
    checks,
    "paragraph-length",
    "Readability",
    "Paragraph length",
    longParagraphs ? "fail" : longestParagraph > 125 ? "warning" : "pass",
    longParagraphs
      ? `${longParagraphs} ${longParagraphs === 1 ? "paragraph runs" : "paragraphs run"} over 150 words; the longest has ${longestParagraph}. Split them into shorter blocks.`
      : `No paragraph exceeds 150 words. The longest is ${longestParagraph} words.`,
    12,
  );

  const starts = sentences.map(
    (sentence) => sentence.match(/^([\p{L}\p{N}’'-]+)/u)?.[1]?.toLowerCase() ?? "",
  );
  const repeatedStarts = starts.some(
    (word, index) => !!word && starts[index + 1] === word && starts[index + 2] === word,
  );
  addCheck(
    checks,
    "repeated-openings",
    "Readability",
    "Repeated sentence openings",
    repeatedStarts ? "fail" : "pass",
    repeatedStarts
      ? "Three or more consecutive sentences start with the same word. Vary their openings."
      : "No three consecutive sentences begin with the same word.",
    13,
  );

  const transitionCount = sentences.filter((sentence) =>
    TRANSITIONS.some((transition) =>
      new RegExp(`\\b${escapeRegExp(transition)}\\b`, "i").test(sentence),
    ),
  ).length;
  const transitionRate = sentences.length ? (transitionCount / sentences.length) * 100 : 0;
  addCheck(
    checks,
    "transitions",
    "Readability",
    "Transition words",
    transitionRate >= 30 ? "pass" : transitionRate >= 20 ? "warning" : "fail",
    `${transitionCount} of ${sentences.length} sentences (${transitionRate.toFixed(0)}%) use a transition word. Aim for at least 30%.`,
    14,
  );

  if (html) {
    const h1Count = parsed?.document.querySelectorAll("h1").length ?? 0;
    addCheck(
      checks,
      "single-h1",
      "Structure",
      "One H1 heading",
      h1Count === 1 ? "pass" : h1Count === 0 ? "warning" : "fail",
      h1Count === 1
        ? "The page has exactly one H1."
        : h1Count === 0
          ? "Add one clear H1 as the page's main heading."
          : `The page has ${h1Count} H1 headings. Keep only one.`,
      15,
    );
  } else {
    addCheck(
      checks,
      "single-h1",
      "Structure",
      "One H1 heading",
      "info",
      "Plain text does not include heading markup; paste HTML to check for exactly one H1.",
      15,
    );
  }

  const sections = html && parsed ? sectionsOf(parsed.root) : paragraphs;
  const longestSection = Math.max(0, ...sections.map(wordCount));
  const oversizedSections = sections.filter((section) => wordCount(section) > 300).length;
  addCheck(
    checks,
    "section-length",
    "Structure",
    "Sections under 300 words",
    oversizedSections ? "fail" : longestSection > 250 ? "warning" : "pass",
    oversizedSections
      ? `${oversizedSections} section${oversizedSections === 1 ? " runs" : "s run"} over 300 words without a heading. Break up the longest section (${longestSection} words).`
      : `No section exceeds 300 words without a heading; the longest is ${longestSection} words.`,
    16,
  );

  const minimum = MIN_WORDS[input.contentType];
  const target = TARGET_WORDS[input.contentType];
  const typeLabel =
    input.contentType === "standard"
      ? "Standard blog post"
      : input.contentType === "cornerstone"
        ? "Cornerstone content"
        : "Product or service page";
  const wordStatus = words >= target ? "pass" : words >= minimum ? "warning" : "fail";
  addCheck(
    checks,
    "word-count",
    "Structure",
    "Content length",
    wordStatus,
    words < minimum
      ? `${words.toLocaleString()} words. ${typeLabel} minimum: ${minimum.toLocaleString()} words; add at least ${(minimum - words).toLocaleString()} more.`
      : words < target
        ? `${words.toLocaleString()} words. That meets the ${minimum.toLocaleString()} word minimum for ${typeLabel.toLowerCase()}; the best length is ${target.toLocaleString()} words, so add about ${(target - words).toLocaleString()} more.`
        : `${words.toLocaleString()} words. ${typeLabel} target: ${target.toLocaleString()} words.`,
    17,
  );

  if (html) {
    let previousLevel = 0;
    const skipped = allHeadings.some((heading) => {
      const level = Number(heading.tagName.slice(1));
      const skip = previousLevel > 0 && level > previousLevel + 1;
      previousLevel = level;
      return skip;
    });
    addCheck(
      checks,
      "heading-order",
      "Structure",
      "Heading order",
      skipped ? "fail" : "pass",
      skipped
        ? "Heading levels skip a step (for example, H2 to H4). Keep the outline in order."
        : "The heading outline does not skip levels.",
      18,
    );
  } else {
    addCheck(
      checks,
      "heading-order",
      "Structure",
      "Heading order",
      "info",
      "Paste HTML to inspect heading levels and their order.",
      18,
    );
  }

  const punctuationDash = /[\u2014\u2013]|\s-\s/.test(text);
  addCheck(
    checks,
    "dash-punctuation",
    "Content Quality",
    "Dash punctuation",
    punctuationDash ? "fail" : "pass",
    punctuationDash
      ? "The body uses an em dash, en dash, or spaced hyphen as punctuation. Replace it with a full stop, comma, or colon."
      : "No em dashes, en dashes, or spaced hyphens are used as punctuation.",
    19,
  );

  const lowerText = text.toLowerCase();
  const matchedRobotics = ROBOTIC_PHRASES.filter((phraseItem) => lowerText.includes(phraseItem));
  addCheck(
    checks,
    "robotic-phrases",
    "Content Quality",
    "Overused phrases",
    matchedRobotics.length ? "warning" : "pass",
    matchedRobotics.length
      ? `Consider replacing: ${matchedRobotics.map((item) => `“${item}”`).join(", ")}.`
      : "No flagged overused phrases were found.",
    20,
  );

  const financial = FINANCIAL_TERMS.test(text);
  const disclaimer = RISK_TERMS.test(text);
  const riskStatus = financial ? (disclaimer ? "pass" : "fail") : "pass";
  addCheck(
    checks,
    "risk-disclaimer",
    "Content Quality",
    "Financial risk disclaimer",
    riskStatus,
    financial && !disclaimer
      ? "This page discusses financial topics but no risk disclaimer was found. Add a clear disclaimer that suits your content."
      : financial
        ? "A financial risk disclaimer appears in the content."
        : "No financial or trading topic was detected; a risk disclaimer is not flagged.",
    21,
  );

  // Work out the page's own domain from the fetched URL, the canonical tag, or
  // a full URL typed into the slug field. Relative links are always internal;
  // absolute links are internal only when they point at that same domain.
  const canonical = html
    ? (parsed?.document.querySelector("link[rel='canonical']")?.getAttribute("href") ?? "")
    : "";
  const slugUrl = /^https?:\/\//i.test(input.slug.trim()) ? input.slug.trim() : "";
  const pageUrl = input.pageUrl || canonical || slugUrl;
  const hostOf = (value: string) => {
    try {
      return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      return "";
    }
  };
  const baseHost = hostOf(pageUrl);
  const samePage = (href: string) => {
    try {
      const target = new URL(href, pageUrl || "https://local.invalid/");
      const here = new URL(pageUrl || "https://local.invalid/");
      return (
        target.pathname.replace(/\/$/, "") === here.pathname.replace(/\/$/, "") &&
        hostOf(target.href) === hostOf(here.href) &&
        !!pageUrl
      );
    } catch {
      return false;
    }
  };
  const links = Array.from(parsed?.root.querySelectorAll("a[href]") ?? []).filter((link) => {
    const href = (link.getAttribute("href") ?? "").trim();
    return (
      !!href &&
      !href.startsWith("#") &&
      !/^(mailto|tel|javascript):/i.test(href) &&
      !SHARE_LINK.test(href) &&
      !/[?&]p=\d+/.test(href) &&
      !samePage(href)
    );
  });
  const isAbsolute = (href: string) => /^(https?:)?\/\//i.test(href);
  const internalLinks = links.filter((link) => {
    const href = (link.getAttribute("href") ?? "").trim();
    if (!isAbsolute(href)) return true;
    return !!baseHost && hostOf(href.startsWith("//") ? `https:${href}` : href) === baseHost;
  });
  const outboundLinks = links.filter((link) => !internalLinks.includes(link));
  if (html) {
    const internalStatus =
      internalLinks.length >= 2 ? "pass" : internalLinks.length === 1 ? "warning" : "fail";
    addCheck(
      checks,
      "internal-links",
      "Content Quality",
      "Internal links",
      internalStatus,
      `${internalLinks.length} internal ${internalLinks.length === 1 ? "link" : "links"} in the content. Aim for at least 2 links to relevant pages on the same site.`,
      22,
    );
    // Informational only: some sites (GhostTraders, for one) deliberately link
    // out to nothing, so the count is reported but never scored.
    addCheck(
      checks,
      "outbound-links",
      "Content Quality",
      "Outbound links",
      "info",
      outboundLinks.length
        ? `${outboundLinks.length} outbound ${outboundLinks.length === 1 ? "link" : "links"} found. Link out only where a source genuinely helps the reader.`
        : "No outbound links found. That is fine if you prefer to keep all link value on your own site.",
      23,
    );
    const keyphraseAnchor = outboundLinks.find((link) =>
      phraseRE.test(normalizedPhrase(link.textContent ?? "")),
    );
    addCheck(
      checks,
      "outbound-anchor",
      "Content Quality",
      "Outbound link anchor text",
      keyphraseAnchor ? "fail" : "pass",
      keyphraseAnchor
        ? `An outbound link uses “${keyphraseAnchor.textContent?.trim()}” as anchor text. Change the text so it does not target your focus keyphrase.`
        : "No outbound link uses the focus keyphrase as its anchor text.",
      24,
    );
  } else {
    for (const [id, title, priority] of [
      ["internal-links", "Internal links", 22],
      ["outbound-links", "Outbound links", 23],
      ["outbound-anchor", "Outbound link anchor text", 24],
    ] as const) {
      addCheck(
        checks,
        id,
        "Content Quality",
        title,
        "info",
        "Paste HTML or enter a URL to inspect links.",
        priority,
      );
    }
  }

  if (html) {
    const images = [
      ...(parsed?.featured ?? []),
      ...Array.from(parsed?.root.querySelectorAll("img") ?? []),
    ];
    addCheck(
      checks,
      "image-count",
      "Images",
      "Image count",
      images.length >= 2 ? "pass" : images.length === 1 ? "warning" : "fail",
      `${images.length} ${images.length === 1 ? "image" : "images"} in the content${parsed?.featured.length ? ", including the featured image" : ""}. Aim for at least 2 relevant images.`,
      25,
    );
    const missingAlt = images.filter(
      (image) => !image.hasAttribute("alt") || !image.getAttribute("alt")?.trim(),
    );
    addCheck(
      checks,
      "image-alt",
      "Images",
      "Alt text on every image",
      missingAlt.length ? "fail" : "pass",
      missingAlt.length
        ? `${missingAlt.length} of ${images.length} images have missing or empty alt text. Describe each image briefly.`
        : `All ${images.length} images have alt text.`,
      26,
    );
    const phraseAlt = images.some((image) =>
      phraseRE.test(normalizedPhrase(image.getAttribute("alt") ?? "")),
    );
    addCheck(
      checks,
      "image-keyphrase-alt",
      "Images",
      "Keyphrase in image alt text",
      phraseAlt ? "pass" : "warning",
      phraseAlt
        ? "At least one image alt attribute includes the keyphrase or close wording."
        : `Add “${phrase}” naturally to the alt text of one relevant image.`,
      27,
    );
    const vague = images.filter((image) =>
      /^(image|photo|picture|graphic|img|banner|visual)\s*\d*$/i.test(
        image.getAttribute("alt")?.trim() ?? "",
      ),
    );
    addCheck(
      checks,
      "image-vague-alt",
      "Images",
      "Specific image descriptions",
      vague.length ? "fail" : "pass",
      vague.length
        ? `${vague.length} image${vague.length === 1 ? " uses" : "s use"} vague alt text such as “image” or “photo”. Describe what each shows.`
        : "No vague or generic image alt text was found.",
      28,
    );
  }

  const count = (status: AuditStatus) => checks.filter((check) => check.status === status).length;
  const summary = {
    pass: count("pass"),
    warning: count("warning"),
    fail: count("fail"),
    info: count("info"),
  };
  const score = scoreChecks(checks);
  const band = bandFor(score);
  return { score, band, summary, checks, wordCount: words };
}

export const contentMinimums = MIN_WORDS;
export const contentTargets = TARGET_WORDS;

// Weighted score: a pass earns the check's full weight, a warning half of it,
// a fail nothing. Info results are left out completely.
export function scoreChecks(checks: AuditCheck[]) {
  const scored = checks.filter((check) => check.status !== "info" && check.weight > 0);
  const total = scored.reduce((sum, check) => sum + check.weight, 0);
  if (!total) return 0;
  const earned = scored.reduce(
    (sum, check) =>
      sum +
      (check.status === "pass" ? check.weight : check.status === "warning" ? check.weight / 2 : 0),
    0,
  );
  return Math.round((earned / total) * 100);
}

// Tested from the lowest band up so no band can be skipped.
export function bandFor(score: number) {
  if (score < 40) return "Major issues, do not publish yet";
  if (score < 65) return "Needs real work";
  if (score < 85) return "Good, a few fixes first";
  return "Great, ready to publish";
}

// Fix list order: fails before warnings, heavier checks first.
export function prioritisedFixes(checks: AuditCheck[]) {
  const rank = { fail: 0, warning: 1, pass: 2, info: 3 } as const;
  return checks
    .filter((check) => check.status === "fail" || check.status === "warning")
    .sort(
      (a, b) => rank[a.status] - rank[b.status] || b.weight - a.weight || a.priority - b.priority,
    );
}
