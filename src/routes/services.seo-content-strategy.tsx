import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  Compass,
  Eye,
  FileText,
  Link2,
  MapPin,
  MousePointerClick,
  PenLine,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import showcaseImage from "../assets/web-design-showcase.jpg";

export const Route = createFileRoute("/services/seo-content-strategy")({
  head: () => ({
    meta: [
      { title: "SEO & Content Strategy | ForgeXD" },
      {
        name: "description",
        content:
          "Technical SEO, search strategy, content optimisation and ongoing measurement that build sustainable organic growth around what your customers actually search for.",
      },
      { property: "og:title", content: "SEO & Content Strategy | ForgeXD" },
      {
        property: "og:description",
        content:
          "Search visibility that compounds — technical SEO, content strategy and measurement focused on real business results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://forge-xd-spark.lovable.app/services/seo-content-strategy" }],
  }),
  component: SeoContentStrategy,
});

const journey = [
  { icon: Search, title: "Search", copy: "People search for solutions." },
  { icon: Compass, title: "Discovery", copy: "They find and explore your brand." },
  { icon: MousePointerClick, title: "Website", copy: "They land on a relevant, well structured page." },
  { icon: Users, title: "Experience", copy: "They engage with your content." },
  { icon: BarChart3, title: "Conversion", copy: "They take action and become a lead or customer." },
];

const services = [
  {
    icon: Settings,
    title: "Technical SEO",
    items: ["Technical audits", "Site architecture", "Indexation", "Crawl issues", "Page speed", "Core Web Vitals"],
  },
  {
    icon: FileText,
    title: "On Page SEO",
    items: ["Keyword research", "Search intent", "Page structure", "Metadata", "Internal linking", "Image optimisation"],
  },
  {
    icon: PenLine,
    title: "Content Strategy",
    items: ["Search opportunity research", "Content planning", "Topic clusters", "Content briefs", "Existing content optimisation"],
  },
  {
    icon: MapPin,
    title: "Local SEO",
    items: ["Google Business Profile", "Local optimisation", "Location pages", "Citations", "Review strategy", "Local content"],
  },
  {
    icon: Link2,
    title: "Authority & Off Page SEO",
    items: ["Digital PR", "Link acquisition", "Guest posting", "Outreach", "Backlink analysis", "Competitor research"],
  },
  {
    icon: MousePointerClick,
    title: "Conversion Focused",
    items: ["Clear call to actions", "Improved UX", "Conversion tracking", "Landing page optimisation", "Measure and refine"],
  },
];

const outcomes = [
  { icon: Eye, title: "Visibility", copy: "Get discovered for relevant searches." },
  { icon: Users, title: "Intent", copy: "Target searches connected to real customer needs." },
  { icon: Settings, title: "Technical Foundation", copy: "Build a website search engines can understand." },
  { icon: FileText, title: "Content", copy: "Create useful content around genuine search opportunities." },
  { icon: ShieldCheck, title: "Authority", copy: "Strengthen your site's credibility across the web." },
  { icon: BarChart3, title: "Conversion", copy: "Turn organic visitors into enquiries, customers or leads." },
];

const process = [
  ["01", "Discover", "We understand your business, goals, market and search opportunity."],
  ["02", "Analyse", "We audit your website, competitors and current performance."],
  ["03", "Strategy", "We create a tailored SEO plan with clear priorities."],
  ["04", "Optimise", "We implement and improve across technical, content and authority."],
  ["05", "Measure", "We track results, provide clear reporting and continuously refine."],
];

const tools = ["Google Search Console", "Google Analytics", "SEMrush", "Ahrefs", "Screaming Frog", "Looker Studio"];

function SeoContentStrategy() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative bg-brand-ink text-primary-foreground">
        <img src={showcaseImage} alt="A responsive business website displayed on a laptop and phone" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-45 md:object-center" />
        <div className="service-hero-overlay absolute inset-0" />
        <img src={signaturePattern} alt="" aria-hidden="true" className="absolute -left-24 top-24 h-72 w-72 -rotate-12 object-contain opacity-30 md:h-[27rem] md:w-[27rem]" />

        <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
          <Link to="/" aria-label="ForgeXD home"><img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" /></Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-brand-orange"><ArrowLeft size={17} /> Back to home</Link>
        </header>

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-[9svh] pt-[9svh] md:px-10 md:pb-[11svh] md:pt-[12svh] lg:px-16">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">SEO & Content Strategy</p>
            <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">Search visibility <span className="text-brand-orange">that compounds.</span></h1>
            <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <p className="max-w-2xl text-base leading-7 text-primary-foreground/72 md:text-lg">Your customers are already searching. ForgeXD helps your business become visible when those searches happen. We combine technical SEO, search strategy, content optimisation and ongoing measurement to build sustainable organic growth around the things your customers actually care about.</p>
              <a href="mailto:hello@forgexd.co.za?subject=SEO%20%26%20Content%20Strategy" className="flex shrink-0 items-center gap-3 text-sm font-semibold uppercase">Start a project <span className="flex h-10 w-10 items-center justify-center bg-brand-orange"><ArrowDownRight size={18} /></span></a>
            </div>
            <div className="mt-10 grid gap-3 border-t border-primary-foreground/20 pt-6 text-xs font-semibold sm:grid-cols-3">
              {["Strategy led", "Data driven", "Focused on real business results"].map(item => <span key={item} className="flex items-center gap-2 text-primary-foreground/70"><Check className="text-brand-orange" size={16} />{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our approach</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">SEO isn't just <span className="text-brand-orange">about rankings.</span></h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">A ranking is only useful if it brings the right person to your business. So we look at the complete journey from search to conversion.</p>
          </div>
          <div className="grid border-l border-t border-foreground/20 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-foreground/20 p-6"><Icon className="text-brand-olive" size={27} strokeWidth={1.6} /><h3 className="mt-10 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-primary-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we do</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">A complete <span className="text-brand-orange">SEO service.</span></h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65">We take a holistic approach to SEO, covering the technical foundation, on page optimisation, content strategy, authority building and ongoing performance measurement.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, items }) => <article key={title} className="border border-primary-foreground/15 p-7">
              <Icon className="text-brand-orange" size={27} strokeWidth={1.6} />
              <h3 className="mt-6 font-display text-xl">{title}</h3>
              <ul className="mt-6 space-y-3">{items.map(item => <li key={item} className="flex items-center gap-3 text-sm text-primary-foreground/72"><span className="flex h-5 w-5 shrink-0 items-center justify-center border border-brand-orange"><Check size={13} className="text-brand-orange" /></span>{item}</li>)}</ul>
            </article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Built around what matters</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">More than <span className="text-brand-orange">just traffic.</span></h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">We focus on the metrics that actually move your business forward.</p>
          </div>
          <div className="grid border-l border-t border-foreground/20 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-foreground/20 p-7"><Icon className="text-brand-olive" size={27} strokeWidth={1.6} /><h3 className="mt-8 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-t border-foreground/15 px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our process</p>
          <h2 className="max-w-4xl font-display text-4xl font-medium md:text-6xl">A clear and collaborative <span className="text-brand-orange">process.</span></h2>
          <div className="mt-14 grid border-t border-foreground/20 md:grid-cols-5">
            {process.map(([number, title, copy]) => <article key={number} className="border-b border-foreground/20 py-7 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"><span className="flex h-11 w-11 items-center justify-center bg-brand-orange text-xs font-bold text-primary-foreground">{number}</span><h3 className="mt-8 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-brand-olive px-5 py-20 text-secondary-foreground md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Tools we work with</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">Industry leading tools.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-secondary-foreground/75">We use a range of trusted tools to research, analyse, optimise and measure performance.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{tools.map(item => <span key={item} className="flex items-center gap-3 text-sm"><Check className="text-brand-silver" size={18} />{item}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <img src={signaturePattern} alt="" aria-hidden="true" loading="lazy" className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 object-contain opacity-35" />
        <div className="signature-cta-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <div />
          <div>
            <p className="mb-5 text-xs font-bold uppercase text-brand-orange">Ready to grow organically</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Let's build search visibility for your business.</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65">Tell us what you're looking to achieve and we'll recommend the right approach and solution for your needs.</p>
            <a href="mailto:hello@forgexd.co.za?subject=SEO%20%26%20Content%20Strategy" className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold">Start a project <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <footer className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ForgeXD</span><a href="mailto:hello@forgexd.co.za" className="hover:text-primary-foreground">hello@forgexd.co.za</a></footer>
      </section>
    </main>
  );
}
