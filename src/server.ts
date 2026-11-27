import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { sitemapResponse } from "./lib/sitemap";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const CANONICAL_HOST = "forgexd.co.za";

// Sends http:// and www. requests to https://forgexd.co.za with a permanent
// redirect, so Google sees one copy of every page. Only acts on what the
// hosting proxy reports (X-Forwarded-Proto / Host), so it can never loop:
// with no proxy header, nothing is redirected.
// Pages that moved. Old addresses answer with a permanent redirect.
const MOVED_PATHS: Record<string, string> = {
  "/tools/free-seo-audit": "/tools/free-on-page-seo-audit-tool",
};

function canonicalRedirect(request: Request): Response | null {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]!
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  const proto = (request.headers.get("x-forwarded-proto") ?? "")
    .split(",")[0]!
    .trim()
    .toLowerCase();
  const isWww = host === `www.${CANONICAL_HOST}`;
  const isPlainHttp = proto === "http" && (host === CANONICAL_HOST || isWww);
  const url = new URL(request.url);
  const moved = MOVED_PATHS[url.pathname.replace(/\/+$/, "") || "/"];
  if (!isWww && !isPlainHttp && !moved) return null;
  // One hop: host, protocol and moved path are fixed in the same redirect.
  return new Response(null, {
    status: 301,
    headers: { location: `https://${CANONICAL_HOST}${moved ?? url.pathname}${url.search}` },
  });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;

    // Dynamic sitemap, built from the static routes plus live WordPress posts.
    if (new URL(request.url).pathname === "/sitemap.xml") {
      if (request.method === "GET" || request.method === "HEAD") {
        return sitemapResponse(request.method);
      }
      return new Response(null, { status: 405, headers: { allow: "GET, HEAD" } });
    }

    try {
      const handler = await getServerEntry();
      const response = await normalizeCatastrophicSsrResponse(
        await handler.fetch(request, env, ctx),
      );
      // The widget page must load inside other sites. frame-ancestors wins over
      // any X-Frame-Options header the host adds.
      if (new URL(request.url).pathname.startsWith("/embed/")) {
        const headers = new Headers(response.headers);
        headers.delete("x-frame-options");
        headers.set("content-security-policy", "frame-ancestors *");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
