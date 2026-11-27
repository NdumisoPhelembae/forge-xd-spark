import { useState } from "react";
import { Check, Copy } from "lucide-react";

// The copy and paste code for the widget. The link around the ForgeXD icon
// sits in the host page's own HTML, so search engines see it as a link.
export const EMBED_SNIPPET = `<div data-forgexd-seo-audit>
  <a href="https://forgexd.co.za/tools/free-on-page-seo-audit-tool" style="display:block;width:max-content;margin:8px 0 0 auto">
    <img src="https://forgexd.co.za/favicon.png" alt="Free on-page SEO audit tool by ForgeXD" width="32" height="32">
  </a>
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
    <div className="border border-primary-foreground/20 bg-primary-foreground/5">
      <div className="flex items-center justify-between gap-4 border-b border-primary-foreground/20 px-5 py-3">
        <span className="text-xs font-bold uppercase text-primary-foreground/70">HTML</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 bg-brand-orange px-4 py-2 text-xs font-bold uppercase text-primary-foreground transition-colors hover:bg-brand-ember"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-primary-foreground/90">
        <code>{EMBED_SNIPPET}</code>
      </pre>
    </div>
  );
}
