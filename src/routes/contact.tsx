import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import { SiteHeader } from "../components/SiteHeader";
import { sendContactMessage } from "../lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ForgeXD | Start a Project" },
      {
        name: "description",
        content:
          "Tell ForgeXD where your business is, where you want to go and what needs to change. Start a project, book a call or ask a question.",
      },
      { property: "og:title", content: "Contact ForgeXD | Start a Project" },
      {
        property: "og:description",
        content: "Have a challenge worth solving? Let's explore what we can build together.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

type FormStatus = "idle" | "submitting" | "done" | "error";

function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setError(null);
    try {
      await sendContactMessage({
        data: {
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("message") ?? ""),
        },
      });
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-ink text-primary-foreground">
        <img src={signaturePattern} alt="" aria-hidden="true" className="absolute -right-28 -top-20 h-80 w-80 rotate-12 object-cover opacity-35 md:h-[30rem] md:w-[30rem]" />

        <SiteHeader />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-16 pt-14 md:px-10 md:pb-20 lg:px-16">
          <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">Contact ForgeXD</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">Let&rsquo;s forge what&rsquo;s <span className="text-brand-orange">next.</span></h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-primary-foreground/72 md:text-lg">Have a challenge worth solving? Let&rsquo;s explore what we can build together.</p>
        </div>
      </section>

      {/* Form */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Start something meaningful</p>
            <h2 className="font-display text-3xl font-medium leading-tight md:text-5xl">Tell us where you are and where you want to go.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">Share a little about your business and what you want to achieve. We read every message and reply with practical next steps, not a sales pitch.</p>
            <div className="mt-10 border-t border-foreground/15">
              <p className="mt-8 text-xs font-bold uppercase text-brand-orange">What happens next</p>
              <ol className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-3"><span className="font-bold text-foreground">01</span> We review your message and reply within two business days.</li>
                <li className="flex gap-3"><span className="font-bold text-foreground">02</span> We set up a short call to understand the challenge properly.</li>
                <li className="flex gap-3"><span className="font-bold text-foreground">03</span> You receive a clear recommendation and proposal.</li>
              </ol>
            </div>
          </div>

          <div className="border border-foreground/15 bg-background p-7 md:p-10">
            {status === "done" ? (
              <div className="flex h-full min-h-80 flex-col items-start justify-center">
                <h3 className="font-display text-3xl font-medium">Message sent.</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">Thank you for reaching out. We&rsquo;ll get back to you within two business days.</p>
                <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-ember"><ArrowLeft size={16} /> Back to home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-foreground">First name</span>
                    <input name="firstName" required autoComplete="given-name" className="mt-2 w-full border border-foreground/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange" placeholder="Your first name" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-foreground">Last name</span>
                    <input name="lastName" required autoComplete="family-name" className="mt-2 w-full border border-foreground/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange" placeholder="Your last name" />
                  </label>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-foreground">Email</span>
                    <input name="email" type="email" required autoComplete="email" className="mt-2 w-full border border-foreground/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange" placeholder="you@yourbusiness.co.za" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-foreground">Phone <span className="font-normal normal-case text-muted-foreground">(optional)</span></span>
                    <input name="phone" type="tel" autoComplete="tel" className="mt-2 w-full border border-foreground/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange" placeholder="+27" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-bold uppercase text-foreground">Your message</span>
                  <textarea name="message" required rows={6} className="mt-2 w-full resize-y border border-foreground/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange" placeholder="Tell us about your business, the challenge you are facing, or the idea you want to build." />
                </label>
                {status === "error" && error && (
                  <p role="alert" className="border-l-2 border-brand-ember pl-4 text-sm text-brand-ember">{error}</p>
                )}
                <button type="submit" disabled={status === "submitting"} className="inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-ember disabled:cursor-not-allowed disabled:opacity-70">
                  {status === "submitting" ? "Sending…" : "Send message"} <ArrowUpRight size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-ink px-5 py-10 text-sm text-primary-foreground/55 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ForgeXD</span>
          <Link to="/" className="hover:text-primary-foreground">Back to home</Link>
        </div>
      </footer>
    </main>
  );
}
