import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import heroImage from "../assets/about-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ForgeXD | We Forge What's Next" },
      {
        name: "description",
        content:
          "ForgeXD is a digital studio helping businesses turn ideas, challenges and opportunities into better digital experiences. Strategy, design, build and scale — one studio, connected thinking.",
      },
      { property: "og:title", content: "About ForgeXD | We Forge What's Next" },
      {
        property: "og:description",
        content:
          "A digital studio built from doing. We believe good digital work should solve a business problem, not just look good.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const beliefs = [
  { number: "01", title: "Clarity", copy: "Remove complexity. Make the important things obvious." },
  { number: "02", title: "Purpose", copy: "Every decision should serve a real objective." },
  { number: "03", title: "Craft", copy: "Details matter because they shape the experience." },
  { number: "04", title: "Progress", copy: "Build foundations that can evolve with the business." },
];

const steps = [
  { number: "01", title: "Strategy", copy: "Understand the challenge. Find the opportunity." },
  { number: "02", title: "Design", copy: "Shape purposeful experiences around real needs." },
  { number: "03", title: "Build", copy: "Turn considered ideas into working digital solutions." },
  { number: "04", title: "Scale", copy: "Refine, optimise and create room for growth." },
];

const audiences = [
  {
    title: "Founders",
    copy: "Turning an idea into something real.",
    cta: "How we help founders",
    href: "/services/digital-business-launch-package" as const,
  },
  {
    title: "Growing businesses",
    copy: "Improving the digital experience as the business evolves.",
    cta: "How we help growing businesses",
    href: "/services/web-design-development" as const,
  },
  {
    title: "Established businesses",
    copy: "Fixing, modernising and strengthening existing digital foundations.",
    cta: "How we help established businesses",
    href: "/services/seo-content-strategy" as const,
  },
];

function About() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-brand-ink text-primary-foreground">
        <img src={heroImage} alt="Designer's desk in warm evening light with a laptop and coffee mug" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="service-hero-overlay absolute inset-0" />
        <img src={signaturePattern} alt="" aria-hidden="true" className="absolute -right-28 -top-20 h-80 w-80 rotate-12 object-cover opacity-35 md:h-[30rem] md:w-[30rem]" />

        <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
          <Link to="/" aria-label="ForgeXD home"><img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" /></Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-brand-orange"><ArrowLeft size={17} /> Back to home</Link>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1400px] items-end px-5 pb-16 pt-20 md:min-h-[640px] md:px-10 md:pb-20 lg:px-16">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">About ForgeXD</p>
            <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">We forge what&rsquo;s <span className="text-brand-orange">next.</span></h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-primary-foreground/72 md:text-lg">ForgeXD is a digital studio helping businesses turn ideas, challenges and opportunities into better digital experiences.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="mailto:hello@forgexd.co.za?subject=Start%20a%20project" className="inline-flex items-center justify-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-ember">Start a project <ArrowUpRight size={17} /></a>
              <a href="/#services" className="inline-flex items-center justify-center gap-3 border border-primary-foreground/30 px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:border-brand-orange hover:text-brand-orange">See our work <ArrowRight size={17} /></a>
            </div>
            <div className="mt-12 hidden flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground/55 sm:flex">
              {["Strategy", "Design", "Build", "Scale"].map((step, index) => (
                <span key={step} className="flex items-center gap-4">
                  {index > 0 && <span aria-hidden="true" className="h-px w-8 bg-primary-foreground/30" />}
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The story */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">The story</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Built from doing.</h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted-foreground md:text-lg">
            <p>ForgeXD grew from years of working across digital businesses, websites, e-commerce, education, SEO and digital strategy.</p>
            <p>That experience shaped a simple belief:</p>
            <p className="font-semibold text-foreground">Good digital work should solve a business problem, not just look good.</p>
            <p>We bring that thinking into every project, whether we are designing an interface, building a website, improving search visibility or helping a business establish its digital foundation.</p>
          </div>
        </div>
      </section>

      {/* Point of view */}
      <section className="border-y border-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our point of view</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">We don&rsquo;t believe in digital for digital&rsquo;s sake.</h2>
          </div>
          <div className="mb-14 max-w-2xl space-y-2 text-base leading-8 text-primary-foreground/72 md:text-lg">
            <p>We believe technology should make things clearer.</p>
            <p>Design should make things easier.</p>
            <p>Strategy should make decisions better.</p>
            <p>And every digital investment should have a reason behind it.</p>
          </div>
          <div className="grid border-t border-primary-foreground/15 md:grid-cols-4">
            {beliefs.map(({ number, title, copy }) => (
              <div key={number} className="border-b border-primary-foreground/15 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className="text-xs font-bold text-brand-orange">{number}</span>
                <h3 className="mt-6 font-display text-2xl font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/62">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase text-brand-orange">How we work</p>
              <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">One studio. Connected thinking.</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-muted-foreground md:justify-self-end">We bring strategy, design, technology and growth together so every part of your digital presence supports the next.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map(({ number, title, copy }, index) => (
              <div key={number} className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-primary-foreground">{number}</span>
                  {index < steps.length - 1 && <ArrowRight aria-hidden="true" className="hidden text-brand-orange md:block" size={20} />}
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Who we work with</p>
              <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Built for businesses moving forward.</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-primary-foreground/65 md:justify-self-end">We work with founders, growing businesses and established companies who want to make better use of digital to achieve their goals.</p>
          </div>
          <div className="grid border-t border-primary-foreground/15 md:grid-cols-3">
            {audiences.map(({ title, copy, cta, href }) => (
              <div key={title} className="border-b border-primary-foreground/15 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <h3 className="font-display text-2xl font-medium">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-primary-foreground/62">{copy}</p>
                <Link to={href} className="mt-6 inline-flex items-center gap-2 border-t-2 border-brand-orange pt-4 text-sm font-semibold text-brand-orange transition-colors hover:text-primary-foreground">{cta} <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative">
            <img src="https://cms.forgexd.co.za/wp-content/uploads/2026/11/Inclusive-Geometric-Design-Collaboration.png" alt="Team collaborating over an inclusive geometric design" loading="lazy" width={1536} height={1024} className="aspect-[3/2] w-full object-cover" />
            <div className="absolute bottom-0 left-0 h-2 w-1/3 bg-brand-orange" />
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">The ForgeXD philosophy</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">But what your business needs next.</h2>
            <div className="mt-8 space-y-2 text-lg leading-8 text-muted-foreground">
              <p>Not just what exists today.</p>
              <p>Not just what looks good today.</p>
              <p>But what your business needs next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <img src={signaturePattern} alt="" aria-hidden="true" loading="lazy" className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 object-cover opacity-40" />
        <div className="signature-cta-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <div />
          <div>
            <p className="mb-5 text-xs font-bold uppercase text-brand-orange">Ready to move forward</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Let&rsquo;s build what&rsquo;s next.</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65">Tell us where you are, where you want to go, and what needs to change.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/contact" className="inline-flex items-center justify-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-ember">Start a project <ArrowUpRight size={17} /></Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-3 border border-primary-foreground/30 px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:border-brand-orange hover:text-brand-orange">Book a call <ArrowRight size={17} /></Link>
            </div>
          </div>
        </div>
        <footer className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ForgeXD</span>
          <Link to="/contact" className="hover:text-primary-foreground">Contact</Link>
        </footer>
      </section>
    </main>
  );
}
