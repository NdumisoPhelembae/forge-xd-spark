import { useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import { subscribeToNewsletter } from "../lib/newsletter";

export function NewsletterSignup({ title = "Ideas worth forging.", copy = "Practical notes on strategy, design and growth, plus early access to our templates and guides." }: { title?: string; copy?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || !email.includes("@")) return;
    setStatus("submitting");
    try {
      await subscribeToNewsletter({ data: { email } });
      setStatus("done");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
      setStatus("error");
    }
  }

  return (
    <div className="relative overflow-hidden bg-brand-ink p-8 text-primary-foreground md:p-12">
      <img src={signaturePattern} alt="" aria-hidden className="pointer-events-none absolute -right-32 -top-24 w-[520px] rotate-12 opacity-30" />
      <div className="relative max-w-xl">
        <p className="mb-4 text-xs font-bold uppercase text-brand-orange">The ForgeXD letter</p>
        <h3 className="font-display text-3xl font-medium leading-tight md:text-4xl">{title}</h3>
        <p className="mt-4 text-sm leading-6 text-primary-foreground/68">{copy}</p>
        {status === "done" ? (
          <p className="mt-8 flex items-center gap-3 text-sm font-semibold"><span className="flex h-8 w-8 items-center justify-center bg-brand-orange"><Check size={16} /></span>You're in. Watch your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input id="newsletter-email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} placeholder="you@company.com" className="min-w-0 flex-1 border border-primary-foreground/25 bg-transparent px-4 py-3 text-sm placeholder:text-primary-foreground/40 focus:border-brand-orange focus:outline-none" />
            <button type="submit" disabled={status === "submitting"} className="flex items-center justify-center gap-2 bg-brand-orange px-6 py-3 text-sm font-semibold transition-colors hover:bg-brand-ember disabled:opacity-70">
              {status === "submitting" ? <><LoaderCircle size={16} className="animate-spin" /> Adding you…</> : <>Subscribe <ArrowRight size={16} /></>}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-4 text-sm text-brand-orange">We couldn't add you just now. Please check your email address and try again.</p>}
      </div>
    </div>
  );
}
