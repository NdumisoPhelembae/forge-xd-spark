import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SeoAuditTool } from "../components/seo-audit/SeoAuditTool";
import { embedThemeStyle, isEmbedTheme } from "../components/seo-audit/embed-themes";
import { canonicalLink } from "../lib/site";

const TOOL_PATH = "/tools/free-on-page-seo-audit-tool";

// The free tool as it runs inside other websites (see public/embed.js).
// Kept out of search results; the full tool page holds the ranking signals.
// The "Powered by ForgeXD" credit lives in the host page's snippet, not here.
export const Route = createFileRoute("/embed/seo-audit")({
  validateSearch: (search: Record<string, unknown>) => ({
    theme: isEmbedTheme(search["theme"]) ? search["theme"] : ("light" as const),
  }),
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
  const { theme } = Route.useSearch();
  const style = embedThemeStyle(theme);

  // Match the frame's own page colour to the theme, so no strip of the site
  // background shows around the tool.
  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = String(style.background);
    return () => {
      document.body.style.background = previous;
    };
  }, [style.background]);

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
    <main className="p-4 text-foreground md:p-6" style={style}>
      <SeoAuditTool embedded />
    </main>
  );
}
