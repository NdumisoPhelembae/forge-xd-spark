// Server function the free SEO audit page calls to fetch a URL. The fetching
// itself lives in page-fetch.server.ts and only ever loads on the server.
import { createServerFn } from "@tanstack/react-start";
import type { FetchPageResult } from "./page-fetch.server";

export const fetchPageForAudit = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const url =
      typeof data === "object" && data !== null
        ? String((data as { url?: unknown }).url ?? "")
        : "";
    if (!url.trim() || url.length > 2048) throw new Error("Enter a web address to audit.");
    return { url: url.trim() };
  })
  .handler(async ({ data }): Promise<FetchPageResult> => {
    const { getRequestIP } = await import("@tanstack/react-start/server");
    const { checkRateLimit, fetchPublicPage } = await import("./page-fetch.server");
    // xCloud's proxy sets X-Forwarded-For with the visitor's address.
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (!checkRateLimit(ip)) {
      return {
        ok: false,
        error:
          "You have run a lot of URL audits in a short time. Please wait a few minutes and try again.",
      };
    }
    // Accept bare domains such as forgexd.co.za by assuming https.
    const url = /^[a-z][a-z0-9+.-]*:/i.test(data.url) ? data.url : `https://${data.url}`;
    return fetchPublicPage(url);
  });
