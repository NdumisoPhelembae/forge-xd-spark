// Credit check for the embeddable SEO audit widget. A site may run the tool
// only while its page keeps the "Powered by ForgeXD" link the snippet adds.
// The check runs on this server, so it cannot be switched off from the
// host page. It never blocks a site we could not read: only a page we
// fetched, that holds the embed code but no followed ForgeXD link, is blocked.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchPublicPage } from "./page-fetch.server";

export type CreditStatus = "ok" | "missing" | "unverifiable";

export type EmbedAccess =
  | { allowed: true }
  | { allowed: false; reason: "missing-credit" | "not-embedded" | "page-mismatch" };

type Entry = { status: CreditStatus; checkedAt: number; detail?: string | undefined };

const OK_TTL = 24 * 60 * 60 * 1000; // pages with the link: recheck daily
const MISSING_TTL = 10 * 60 * 1000; // blocked pages: recheck soon, so a restored link unblocks fast
const UNVERIFIABLE_TTL = 6 * 60 * 60 * 1000;
const MAX_PAGES_PER_DOMAIN = 20;
const MAX_CHECKS_PER_HOUR = 300;
const SELF_HOSTS = new Set(["forgexd.co.za", "localhost", "127.0.0.1"]);

const DATA_DIR = process.env["EMBED_DATA_DIR"] || path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "embed-credits.json");

const entries = new Map<string, Entry>();
const inFlight = new Map<string, Promise<Entry>>();
let checkTimes: number[] = [];
let loaded = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, "utf8")) as Record<string, Entry>;
    for (const [key, value] of Object.entries(data)) entries.set(key, value);
  } catch {
    // No file yet, or unreadable: start empty. Pages are simply checked again.
  }
}

function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = undefined;
    try {
      mkdirSync(DATA_DIR, { recursive: true });
      writeFileSync(DATA_FILE, JSON.stringify(Object.fromEntries(entries), null, 1));
    } catch {
      // Losing the file only means pages get checked again.
    }
  }, 2000);
}

const bareHost = (host: string) => host.toLowerCase().replace(/^www\./, "");

function pageKey(url: URL) {
  return `${url.protocol}//${bareHost(url.hostname)}${url.pathname.replace(/\/+$/, "") || "/"}`;
}

const attr = (tag: string, name: string) =>
  new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, "is").exec(tag)?.[2] ??
  new RegExp(`\\s${name}\\s*=\\s*([^\\s>]+)`, "i").exec(tag)?.[1];

const HIDDEN =
  /display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?![.\d])|font-size\s*:\s*0(?![.\d])/i;

/** Reads a host page's HTML and decides whether the credit link is in place. */
export function inspectHostHtml(html: string): { status: CreditStatus; detail?: string } {
  // Without the embed code in the HTML we cannot judge the page (it may be
  // built with JavaScript), so we never block it.
  if (!/data-forgexd-seo-audit/i.test(html)) {
    return { status: "unverifiable", detail: "embed code not in page HTML" };
  }
  const robots = /<meta[^>]+name=["']robots["'][^>]*>/i.exec(html)?.[0];
  if (robots && /nofollow/i.test(attr(robots, "content") ?? "")) {
    return { status: "missing", detail: "page is set to nofollow" };
  }
  const anchors = html.match(/<a\b[^>]*>/gi) ?? [];
  let sawNofollow = false;
  for (const tag of anchors) {
    const href = attr(tag, "href") ?? "";
    let host = "";
    try {
      host = bareHost(new URL(href.replace(/&amp;/g, "&")).hostname);
    } catch {
      continue;
    }
    if (host !== "forgexd.co.za") continue;
    if (/\b(nofollow|sponsored|ugc)\b/i.test(attr(tag, "rel") ?? "")) {
      sawNofollow = true;
      continue;
    }
    if (HIDDEN.test(attr(tag, "style") ?? "") || /\shidden(\s|>|=)/i.test(tag)) continue;
    return { status: "ok" };
  }
  return {
    status: "missing",
    detail: sawNofollow ? "ForgeXD link is nofollow" : "ForgeXD link not found",
  };
}

async function runCheck(key: string, url: string): Promise<Entry> {
  const existing = inFlight.get(key);
  if (existing) return existing;
  const job = (async () => {
    checkTimes.push(Date.now());
    const res = await fetchPublicPage(url, { checkOgImage: false }).catch(() => null);
    const result: { status: CreditStatus; detail?: string } =
      res && res.ok
        ? inspectHostHtml(res.html)
        : { status: "unverifiable", detail: "page could not be read" };
    const entry: Entry = { ...result, checkedAt: Date.now() };
    entries.set(key, entry);
    save();
    return entry;
  })().finally(() => inFlight.delete(key));
  inFlight.set(key, job);
  return job;
}

function underHourlyCap(now: number) {
  checkTimes = checkTimes.filter((time) => now - time < 60 * 60 * 1000);
  return checkTimes.length < MAX_CHECKS_PER_HOUR;
}

function isStale(entry: Entry, now: number) {
  const ttl =
    entry.status === "ok" ? OK_TTL : entry.status === "missing" ? MISSING_TTL : UNVERIFIABLE_TTL;
  return now - entry.checkedAt > ttl;
}

/**
 * Decides whether the widget may run.
 * referer: the origin the browser reports for the page holding the iframe.
 * page: the full page address embed.js passes along.
 */
export async function embedAccess(
  referer: string | undefined,
  page: string | undefined,
  now = Date.now(),
): Promise<EmbedAccess> {
  load();
  let refererHost = "";
  try {
    const ref = referer ? new URL(referer) : null;
    // A request from inside the widget itself carries our own embed address,
    // which says nothing about the host page, so it is treated as no referrer.
    refererHost = ref && !ref.pathname.startsWith("/embed/") ? bareHost(ref.hostname) : "";
  } catch {
    refererHost = "";
  }
  if (SELF_HOSTS.has(refererHost)) return { allowed: true };

  let pageUrl: URL | null = null;
  try {
    pageUrl = page ? new URL(page) : null;
  } catch {
    pageUrl = null;
  }
  if (!pageUrl || !/^https?:$/.test(pageUrl.protocol)) {
    return { allowed: false, reason: "not-embedded" };
  }
  // The page address comes from the host page's script, so it must belong to
  // the site the browser says loaded the frame. Sites that send no referrer
  // at all are trusted on the page address alone.
  if (refererHost && refererHost !== bareHost(pageUrl.hostname)) {
    return { allowed: false, reason: "page-mismatch" };
  }

  const key = pageKey(pageUrl);
  const domain = bareHost(pageUrl.hostname);
  const entry = entries.get(key);

  if (!entry) {
    const domainKeys = [...entries.keys()].filter((k) => k.includes(`//${domain}/`));
    if (domainKeys.length >= MAX_PAGES_PER_DOMAIN) {
      // Too many pages on one site to track: judge it by its other pages.
      const blocked = domainKeys.some((k) => entries.get(k)?.status === "missing");
      return blocked ? { allowed: false, reason: "missing-credit" } : { allowed: true };
    }
    if (!underHourlyCap(now)) return { allowed: true };
    // First visit: check now, but never make a visitor wait more than 6s.
    const first = await Promise.race([
      runCheck(key, pageUrl.href),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);
    return first?.status === "missing"
      ? { allowed: false, reason: "missing-credit" }
      : { allowed: true };
  }

  if (isStale(entry, now) && underHourlyCap(now)) {
    if (entry.status === "missing") {
      // Blocked already, so waiting costs nothing: recheck before answering.
      const fresh = await runCheck(key, pageUrl.href);
      return fresh.status === "missing"
        ? { allowed: false, reason: "missing-credit" }
        : { allowed: true };
    }
    void runCheck(key, pageUrl.href);
  }
  return entry.status === "missing"
    ? { allowed: false, reason: "missing-credit" }
    : { allowed: true };
}

/** For tests. */
export function resetEmbedGuard() {
  entries.clear();
  inFlight.clear();
  checkTimes = [];
  loaded = true;
}
