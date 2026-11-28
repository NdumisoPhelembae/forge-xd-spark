import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { checkEmbedAccess } from "../lib/embed-guard";
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
    page: typeof search["page"] === "string" ? search["page"] : "",
  }),
  // Runs on the server for the iframe request, so the browser's referrer is
  // the page that holds the widget.
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => checkEmbedAccess({ data: { page: deps.page } }),
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
  const access = Route.useLoaderData();
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
      {access.allowed ? <SeoAuditTool embedded /> : <CreditRequired reason={access.reason} />}
    </main>
  );
}

function CreditRequired({
  reason,
}: {
  reason: "missing-credit" | "not-embedded" | "page-mismatch";
}) {
  const toolUrl = `https://forgexd.co.za${TOOL_PATH}`;
  return (
    <div className="border border-foreground/15 bg-card p-8 md:p-12">
      <p className="text-xs font-bold uppercase text-brand-orange">Free SEO audit tool</p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight md:text-4xl">
        {reason === "missing-credit"
          ? "This tool is paused on this website"
          : "This tool runs on websites that credit ForgeXD"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        {reason === "missing-credit"
          ? "The free on-page SEO audit tool stays free on other websites while the page keeps its \u201cPowered by ForgeXD\u201d link. The link was removed or changed here, so the tool has stopped. Site owners can copy the full code again to switch it back on."
          : "Add the tool with the full embed code, including its \u201cPowered by ForgeXD\u201d link, and it will load here."}
      </p>
      <a
        href={toolUrl}
        target="_blank"
        rel="noopener"
        className="mt-6 inline-flex items-center bg-brand-orange px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-ember"
      >
        Use the free tool on ForgeXD
      </a>
    </div>
  );
}
