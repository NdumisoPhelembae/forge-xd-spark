import { useState } from "react";
import { Check, ChevronDown, Code2, Copy } from "lucide-react";
import { EMBED_THEMES, type EmbedTheme } from "./embed-themes";

// The copy and paste code for the widget. The "Powered by ForgeXD" link sits
// in the host page's own HTML, so search engines see it as a link. It is the
// only credit line: the tool inside the frame never prints its own.
function snippetFor(theme: EmbedTheme) {
  return `<div data-forgexd-seo-audit data-theme="${theme}">
  <p style="margin:8px 0 0;text-align:right;font-size:13px">Powered by <a href="https://forgexd.co.za/tools/free-on-page-seo-audit-tool">ForgeXD</a></p>
</div>
<script src="https://forgexd.co.za/embed.js?v=2" async></script>`;
}

export function EmbedSnippet() {
  const [theme, setTheme] = useState<EmbedTheme>("light");
  const [copied, setCopied] = useState(false);
  const snippet = snippetFor(theme);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
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
          Pick a background to match your site, then paste the code where you want the tool to
          appear. It works in WordPress (Custom HTML block), Webflow, Wix, Squarespace and any site
          that accepts HTML.
        </p>

        <fieldset className="mt-5">
          <legend className="text-xs font-bold uppercase text-foreground">Background</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(EMBED_THEMES) as EmbedTheme[]).map((key) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-2 border px-4 py-2 text-sm font-semibold transition-colors ${
                  theme === key
                    ? "border-brand-orange text-foreground"
                    : "border-foreground/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="embed-theme"
                  value={key}
                  checked={theme === key}
                  onChange={() => {
                    setTheme(key);
                    setCopied(false);
                  }}
                  className="sr-only"
                />
                <span
                  className="h-4 w-4 border border-foreground/25"
                  style={{ background: EMBED_THEMES[key].page }}
                />
                {EMBED_THEMES[key].label}
              </label>
            ))}
          </div>
        </fieldset>

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
            <code>{snippet}</code>
          </pre>
        </div>
      </div>
    </details>
  );
}
