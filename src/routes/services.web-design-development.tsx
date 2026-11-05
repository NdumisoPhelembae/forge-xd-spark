import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Gauge,
  GraduationCap,
  Layers3,
  Monitor,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import showcaseImage from "../assets/web-design-showcase.jpg";

export const Route = createFileRoute("/services/web-design-development")({
  head: () => ({
    meta: [
      { title: "Web Design & Development | ForgeXD" },
      {
        name: "description",
        content:
          "Strategy-led web design and development for South African businesses, from focused landing pages to custom digital platforms.",
      },
      { property: "og:title", content: "Web Design & Development | ForgeXD" },
      {
        property: "og:description",
        content:
          "Websites built around your goals, your users and measurable business results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WebDesignDevelopment,
});

const solutions = [
  { icon: Monitor, title: "Business websites", copy: "Credible, high-performing websites for companies, professional practices and service businesses." },
  { icon: Layers3, title: "Landing pages", copy: "Focused campaign and product pages designed to turn attention into action." },
  { icon: ShoppingCart, title: "Ecommerce stores", copy: "Clear product journeys, secure payments and considered customer experiences." },
  { icon: GraduationCap, title: "Learning platforms", copy: "Flexible course, membership and gated-content experiences built to grow." },
  { icon: Boxes, title: "Custom platforms", copy: "Purpose-built digital experiences when an off-the-shelf platform cannot do the job." },
];

const foundations = [
  { icon: Target, title: "Your goals", copy: "We define what the website needs to achieve before deciding what it needs to contain." },
  { icon: Users, title: "Your users", copy: "Structure and navigation are shaped around how real people find, understand and act." },
  { icon: Sparkles, title: "Your brand", copy: "Every interaction should feel unmistakably yours—not like a generic template." },
  { icon: Gauge, title: "Performance", copy: "Responsive layouts, fast loading and a technically sound foundation come as standard." },
  { icon: Search, title: "Search visibility", copy: "Search fundamentals are considered during the build, rather than added as an afterthought." },
  { icon: BarChart3, title: "Conversion", copy: "Clear journeys and calls to action move visitors towards a meaningful next step." },
];

const process = [
  ["01", "Discover", "Understand your business, audience, goals and requirements."],
  ["02", "Design", "Shape the structure, visual direction and key user journeys."],
  ["03", "Build", "Develop, test and refine a fast, responsive experience."],
  ["04", "Launch", "Deploy carefully, verify every detail and support what comes next."],
];

function WebDesignDevelopment() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[720px] bg-brand-ink text-primary-foreground md:min-h-[760px]">
        <img src={showcaseImage} alt="Responsive website layouts displayed on a laptop and phone" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-55 md:object-center" />
        <div className="service-hero-overlay absolute inset-0" />
        <img src={signaturePattern} alt="" aria-hidden="true" className="absolute -right-28 -top-20 h-80 w-80 rotate-12 object-cover opacity-35 md:h-[30rem] md:w-[30rem]" />

        <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
          <Link to="/" aria-label="ForgeXD home"><img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" /></Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-brand-orange"><ArrowLeft size={17} /> Back to home</Link>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1400px] items-end px-5 pb-16 pt-20 md:min-h-[640px] md:px-10 md:pb-20 lg:px-16">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">Web design &amp; development</p>
            <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">Digital experiences built for real business results.</h1>
            <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <p className="max-w-2xl text-base leading-7 text-primary-foreground/72 md:text-lg">We design and build websites that look considered, work seamlessly and help your business grow—from focused landing pages to ecommerce and custom platforms.</p>
              <a href="#approach" className="flex shrink-0 items-center gap-3 text-sm font-semibold uppercase">How we work <span className="flex h-10 w-10 items-center justify-center bg-brand-orange"><ArrowDownRight size={18} /></span></a>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our approach</p><h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">We start with the problem, not the platform.</h2></div>
          <div className="flex items-end"><p className="max-w-2xl text-lg leading-8 text-muted-foreground">Every business is different. We first understand what you need to achieve, then recommend the right technology—whether that is a modern website, an ecommerce platform, a membership system or a custom solution.</p></div>
        </div>
      </section>

      <section className="border-y border-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-3xl"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we can build</p><h2 className="font-display text-4xl font-medium md:text-6xl">Web solutions for different business needs.</h2></div>
          <div className="grid border-l border-t border-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-5">
            {solutions.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-primary-foreground/15 p-6 lg:min-h-72"><Icon className="text-brand-orange" size={26} strokeWidth={1.6} /><h3 className="mt-12 font-display text-xl font-medium">{title}</h3><p className="mt-4 text-sm leading-6 text-primary-foreground/62">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          <div className="relative"><img src={showcaseImage} alt="A refined responsive website shown across desktop and mobile screens" loading="lazy" width={1536} height={1024} className="aspect-[3/2] w-full object-cover" /><div className="absolute bottom-0 left-0 h-2 w-1/3 bg-brand-orange" /></div>
          <div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Starting investment</p><h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">Web design &amp; development from <span className="text-brand-orange">R10,000.</span></h2><p className="mt-6 text-base leading-7 text-muted-foreground">Final investment depends on scope, functionality and the specific requirements of your project. You will receive a clear proposal after we understand the work.</p><Link to="/contact" className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold text-primary-foreground">Discuss your project <ArrowUpRight size={17} /></Link></div>
        </div>
      </section>

      <section className="bg-brand-olive px-5 py-20 text-secondary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-3xl"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Every build is designed around</p><h2 className="font-display text-4xl font-medium md:text-6xl">More than just a website.</h2></div>
          <div className="grid border-l border-t border-secondary-foreground/20 md:grid-cols-2 lg:grid-cols-3">{foundations.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-secondary-foreground/20 p-7"><Icon className="text-brand-silver" size={25} strokeWidth={1.6} /><h3 className="mt-8 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-secondary-foreground/72">{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Technology</p><h2 className="font-display text-4xl font-medium md:text-6xl">The right tools for the job.</h2></div><div><p className="text-lg leading-8 text-muted-foreground">We choose technology around your goals, budget, required functionality and long-term plans—not trends. That may include a modern website platform, ecommerce, a headless setup or custom development.</p><div className="mt-10 flex flex-wrap gap-3">{["Content platforms", "Ecommerce", "Design systems", "Custom builds"].map(item => <span key={item} className="border border-foreground/20 px-4 py-3 text-sm font-semibold">{item}</span>)}</div></div></div>
      </section>

      <section className="border-t border-foreground/15 px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our process</p><h2 className="max-w-3xl font-display text-4xl font-medium md:text-6xl">Clear, collaborative and built around momentum.</h2><div className="mt-14 grid border-t border-foreground/20 md:grid-cols-4">{process.map(([number, title, copy]) => <article key={number} className="border-b border-foreground/20 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"><span className="flex h-11 w-11 items-center justify-center bg-brand-orange text-xs font-bold text-primary-foreground">{number}</span><h3 className="mt-8 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <img src={signaturePattern} alt="" aria-hidden="true" loading="lazy" className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 object-cover opacity-40" />
        <div className="signature-cta-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end"><div /><div><p className="mb-5 text-xs font-bold uppercase text-brand-orange">Ready to build?</p><h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Let’s create something that works for your business.</h2><p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65">Tell us what you want to achieve and we’ll recommend the right approach and solution for your needs.</p><Link to="/contact" className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold">Start a project <ArrowUpRight size={17} /></Link></div></div>
        <footer className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ForgeXD</span><Link to="/contact" className="hover:text-primary-foreground">hello@forgexd.co.za</Link></footer>
      </section>
    </main>
  );
}