import { useState } from "react";
import { Check, ChevronDown, Code2, Copy } from "lucide-react";

// The copy and paste code for the widget. The "Powered by ForgeXD" link sits
// in the host page's own HTML, so search engines see it as a link.
const EMBED_SNIPPET = `<div data-forgexd-seo-audit>
  <p style="margin:8px 0 0;text-align:right;font-size:13px">Powered by <a href="https://forgexd.co.za/tools/free-on-page-seo-audit-tool">ForgeXD</a></p>
</div>
<script src="https://forgexd.co.za/embed.js" async></script>`;

export function EmbedSnippet() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <details className="group border border-foreground/15 bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 md:px-9 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3 text-xs font-bold uppercase text-foreground">
          <Code2 size={16} className="text-brand-orange" />
          Embed this free SEO audit tool on your website
        </span>
        <ChevronDown
          size={18}
          className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-foreground/15 px-6 py-6 md:px-9">
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          Paste this code where you want the tool to appear. It works in WordPress (Custom HTML
          block), Webflow, Wix, Squarespace and any site that accepts HTML.
        </p>
        <div className="mt-5 bg-brand-ink">
          <div className="flex items-center justify-between gap-4 border-b border-primary-foreground/15 px-5 py-3">
            <span className="text-xs font-bold uppercase text-primary-foreground/60">HTML</span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 bg-brand-orange px-3 py-2 text-xs font-bold uppercase text-primary-foreground transition-colors hover:bg-brand-ember"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-all p-5 text-xs leading-6 text-primary-foreground/90 md:text-sm md:leading-7">
            <code>{EMBED_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </details>
  );
}
