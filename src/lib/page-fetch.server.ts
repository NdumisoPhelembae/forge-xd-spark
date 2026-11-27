// Server only: fetches a public web page for the free SEO audit.
//
// Replaces the old page fetcher plugin on cms.forgexd.co.za. Safety rules:
// - only http and https on the standard ports, no usernames or passwords
// - every address a hostname resolves to must be public; the check runs at
//   connection time, so a DNS answer that changes mid request (DNS rebinding)
//   cannot reach a private or internal address
// - redirects are followed by hand, up to 5, and every hop is checked again
// - HTML only, capped at 2 MB, 15 second timeout per request
// - per IP rate limit so the tool cannot be used as an open proxy
import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import type { OgImageCheck } from "./seo-audit";

const MAX_BYTES = 2_000_000;
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 15_000;
const USER_AGENT =
  "ForgeXD-SEO-Audit/1.0 (+https://forgexd.co.za/tools/free-on-page-seo-audit-tool)";

export type FetchPageResult =
  | {
      ok: true;
      html: string;
      url: string;
      redirects: Array<{ from: string; to: string; status: number }>;
      ogImage?: OgImageCheck | undefined;
    }
  | { ok: false; error: string };

class FetchError extends Error {}

// ---------- rate limit ----------

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound on a busy server.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
    }
  }
  return true;
}

// ---------- address checks ----------

function ipv4ToInt(ip: string) {
  return ip.split(".").reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

const BLOCKED_V4: Array<[string, number]> = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

function isPublicV4(ip: string) {
  const value = ipv4ToInt(ip);
  return !BLOCKED_V4.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (value & mask) === (ipv4ToInt(base) & mask);
  });
}

function expandV6(ip: string) {
  const [head, tail = ""] = ip.toLowerCase().split("::");
  const headParts = head ? head.split(":") : [];
  const tailParts = tail ? tail.split(":") : [];
  // An embedded IPv4 address at the end counts as two groups.
  const last = tailParts.at(-1) ?? headParts.at(-1) ?? "";
  let v4: string | undefined;
  if (last.includes(".")) {
    v4 = last;
    const value = ipv4ToInt(last);
    const groups = [((value >>> 16) & 0xffff).toString(16), (value & 0xffff).toString(16)];
    if (tailParts.length) tailParts.splice(-1, 1, ...groups);
    else headParts.splice(-1, 1, ...groups);
  }
  const missing = 8 - headParts.length - tailParts.length;
  const groups = [...headParts, ...Array(Math.max(missing, 0)).fill("0"), ...tailParts].map((g) =>
    parseInt(g || "0", 16),
  );
  return { groups, v4 };
}

export function isPublicAddress(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return isPublicV4(ip);
  if (family !== 6) return false;
  const { groups } = expandV6(ip);
  const [g0 = 0, g1 = 0, , , , g5 = 0, g6 = 0, g7 = 0] = groups;
  const allZeroBefore = (n: number) => groups.slice(0, n).every((g) => g === 0);
  // ::ffff:a.b.c.d (mapped), ::a.b.c.d (compatible) and 64:ff9b::/96 (NAT64)
  // carry an IPv4 address; judge that address instead.
  const embedded = `${g6 >> 8}.${g6 & 0xff}.${g7 >> 8}.${g7 & 0xff}`;
  if (allZeroBefore(5) && (g5 === 0xffff || g5 === 0)) {
    if (allZeroBefore(7) && g7 <= 1) return false; // :: and ::1
    return isPublicV4(embedded);
  }
  if (g0 === 0x64 && g1 === 0xff9b && groups.slice(2, 6).every((g) => g === 0)) {
    return isPublicV4(embedded);
  }
  if ((g0 & 0xfe00) === 0xfc00) return false; // fc00::/7 unique local
  if ((g0 & 0xffc0) === 0xfe80) return false; // fe80::/10 link local
  if ((g0 & 0xff00) === 0xff00) return false; // ff00::/8 multicast
  if (g0 === 0x2001 && g1 === 0x0db8) return false; // 2001:db8::/32 documentation
  return true;
}

// Used by http(s).request at connection time, so the address actually dialled
// is the address that was checked.
const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { all: true, family: options.family ?? 0 }, (error, addresses) => {
    if (error) return callback(error, "", 4);
    const list = addresses as dns.LookupAddress[];
    if (!list.length || list.some((entry) => !isPublicAddress(entry.address))) {
      return callback(new FetchError("That address does not lead to a public website."), "", 4);
    }
    if ((options as dns.LookupAllOptions).all) {
      return (callback as unknown as (err: null, addresses: dns.LookupAddress[]) => void)(
        null,
        list,
      );
    }
    const first = list[0]!;
    callback(null, first.address, first.family);
  });
};

// ---------- requests ----------

export function validateTarget(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new FetchError("Enter a full web address, starting with https://");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new FetchError("Only http and https web addresses can be audited.");
  }
  if (url.username || url.password) {
    throw new FetchError("Web addresses with a username or password cannot be audited.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new FetchError("Only websites on the standard web ports can be audited.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && !isPublicAddress(host)) {
    throw new FetchError("That address does not lead to a public website.");
  }
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    throw new FetchError("That address does not lead to a public website.");
  }
  return url;
}

type RawResponse = {
  status: number;
  location?: string | undefined;
  contentType: string;
  body?: Buffer;
};

function requestOnce(url: URL, headersOnly = false): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        lookup: safeLookup,
        timeout: TIMEOUT_MS,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
          "accept-language": "en",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const contentType = String(res.headers["content-type"] ?? "");
        if (headersOnly) {
          res.destroy();
          return resolve({ status, location: res.headers.location, contentType });
        }
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          return resolve({ status, location: res.headers.location, contentType });
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_BYTES) {
            req.destroy(new FetchError("That page is larger than 2 MB, too large to audit."));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => resolve({ status, contentType, body: Buffer.concat(chunks) }));
        res.on("error", reject);
      },
    );
    req.on("timeout", () => req.destroy(new FetchError("The page took too long to respond.")));
    req.on("error", reject);
    req.end();
  });
}

function decode(body: Buffer, contentType: string) {
  const charset = /charset=([^;]+)/i.exec(contentType)?.[1]?.trim().toLowerCase();
  try {
    return new TextDecoder(charset || "utf-8").decode(body);
  } catch {
    return new TextDecoder("utf-8").decode(body);
  }
}

// Finds the page's og:image and checks that it loads, following up to 3
// redirects with the same safety rules as the page itself.
function findOgImage(html: string, base: string) {
  const tag =
    /<meta[^>]+property=["']og:image["'][^>]*>/i.exec(html)?.[0] ??
    /<meta[^>]+name=["']og:image["'][^>]*>/i.exec(html)?.[0];
  const content = tag && /content=["']([^"']+)["']/i.exec(tag)?.[1];
  if (!content) return null;
  try {
    return new URL(content.replace(/&amp;/g, "&"), base).href;
  } catch {
    return null;
  }
}

async function checkImage(src: string): Promise<OgImageCheck> {
  try {
    let url = validateTarget(src);
    for (let hop = 0; hop <= 3; hop++) {
      const res = await requestOnce(url, true);
      if (res.status >= 300 && res.status < 400 && res.location) {
        url = validateTarget(new URL(res.location, url).href);
        continue;
      }
      const isImage = /^image\//i.test(res.contentType);
      return {
        url: src,
        ok: res.status >= 200 && res.status < 300 && isImage,
        status: res.status,
        contentType: res.contentType,
        error: res.status < 300 && !isImage ? "not an image" : undefined,
      };
    }
    return { url: src, ok: false, error: "too many redirects" };
  } catch (error) {
    return {
      url: src,
      ok: false,
      error: error instanceof FetchError ? error.message : "could not be loaded",
    };
  }
}

export async function fetchPublicPage(raw: string): Promise<FetchPageResult> {
  try {
    let url = validateTarget(raw);
    const redirects: Array<{ from: string; to: string; status: number }> = [];

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const res = await requestOnce(url);
      if (res.location) {
        if (hop === MAX_REDIRECTS) {
          throw new FetchError("That address redirects more than 5 times, so it was not audited.");
        }
        const next = validateTarget(new URL(res.location, url).href);
        redirects.push({ from: url.href, to: next.href, status: res.status });
        url = next;
        continue;
      }
      if (res.status < 200 || res.status >= 300) {
        throw new FetchError(`The page answered with an HTTP ${res.status} error.`);
      }
      if (!/(text\/html|application\/xhtml\+xml)/i.test(res.contentType)) {
        throw new FetchError("That address is not an HTML web page.");
      }
      const html = decode(res.body ?? Buffer.alloc(0), res.contentType);
      const ogImageUrl = findOgImage(html, url.href);
      const ogImage = ogImageUrl ? await checkImage(ogImageUrl) : undefined;
      return { ok: true, html, url: url.href, redirects, ogImage };
    }
    throw new FetchError("That address redirects too many times.");
  } catch (error) {
    if (error instanceof FetchError) return { ok: false, error: error.message };
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
      return { ok: false, error: "That website could not be found. Check the address." };
    }
    if (code === "ECONNREFUSED" || code === "ECONNRESET") {
      return { ok: false, error: "That website refused the connection." };
    }
    if (typeof code === "string" && (code.startsWith("ERR_TLS") || code.includes("CERT"))) {
      return {
        ok: false,
        error: "That website's SSL certificate is not valid, so it could not be fetched safely.",
      };
    }
    console.error("Audit page fetch failed:", error);
    return {
      ok: false,
      error: "The page could not be fetched. It may be down or blocking automated visits.",
    };
  }
}
