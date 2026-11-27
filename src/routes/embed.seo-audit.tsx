import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SeoAuditTool } from "../components/seo-audit/SeoAuditTool";
import { canonicalLink } from "../lib/site";

const TOOL_PATH = "/tools/free-on-page-seo-audit-tool";

// The free tool as it runs inside other websites (see public/embed.js).
// Kept out of search results; the full tool page holds the ranking signals.
export const Route = createFileRoute("/embed/seo-audit")({
  head: () => ({
    links: [canonicalLink(TOOL_PATH)],
    meta: [
      { title: "Free On-Page SEO Audit Tool by ForgeXD" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: EmbeddedSeoAudit,
});

function EmbeddedSeoAudit() {
  // Tell the host page how tall the tool is, so its iframe never scrolls.
  useEffect(() => {
    if (window.parent === window) return;
    const send = () =>
      window.parent.postMessage(
        {
          type: "forgexd-seo-audit:height",
          height: Math.ceil(document.documentElement.scrollHeight),
        },
        "*",
      );
    const observer = new ResizeObserver(send);
    observer.observe(document.body);
    send();
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-background p-4 text-foreground md:p-6">
      <SeoAuditTool embedded />
      <p className="mt-6 text-right text-sm text-muted-foreground">
        <a
          href={`https://forgexd.co.za${TOOL_PATH}`}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2 hover:text-brand-orange"
        >
          Open the full tool on ForgeXD
        </a>
      </p>
    </main>
  );
}
