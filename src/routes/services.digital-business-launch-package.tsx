import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  FileText,
  Gem,
  Headphones,
  Laptop,
  Leaf,
  Mail,
  Megaphone,
  Rocket,
  Search,
  Send,
  Store,
  Target,
} from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import showcaseImage from "../assets/web-design-showcase.jpg";

export const Route = createFileRoute("/services/digital-business-launch-package")({
  head: () => ({
    meta: [
      { title: "Digital Business Launch Package | ForgeXD" },
      {
        name: "description",
        content:
          "Launch or grow your business online with strategy, brand and UX, a professional website, search foundations and three months of support.",
      },
      { property: "og:title", content: "Digital Business Launch Package | ForgeXD" },
      {
        property: "og:description",
        content:
          "A complete digital foundation for businesses launching online or taking an existing presence to the next level.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DigitalBusinessLaunchPackage,
});

const pillars = [
  { icon: Target, title: "Strategy", copy: "Clear goals, market direction and the right foundation for your next stage." },
  { icon: Gem, title: "Brand & UX", copy: "A professional brand and considered experience designed to build trust." },
  { icon: Laptop, title: "Website", copy: "A modern, responsive website built around your business and customers." },
  { icon: Search, title: "Search & visibility", copy: "Technical search foundations and content structured to help people find you." },
  { icon: Rocket, title: "Launch & support", copy: "A managed launch, practical guidance and support after you go live." },
];

const packages = [
  {
    name: "Starter",
    audience: "For new businesses",
    intro: "Get online with a professional website and the essential foundations to start attracting customers.",
    items: ["Strategy session", "Professional website", "Mobile-responsive design", "SEO foundation", "Lead capture setup"],
    action: "Starting from R10,000",
  },
  {
    name: "Growth",
    audience: "For growing businesses",
    intro: "Everything in Starter, plus advanced features to generate more leads and grow faster.",
    items: ["Strategy and planning", "Advanced website features", "Content foundation", "Enhanced SEO setup", "Analytics and tracking", "Launch support"],
    action: "Get a quote",
    featured: true,
  },
  {
    name: "Scale",
    audience: "For established businesses",
    intro: "A fuller digital foundation with advanced functionality, content and integrations for your next stage.",
    items: ["Everything in Growth", "Custom functionality", "Advanced integrations", "Expanded content strategy", "Priority support"],
    action: "Get a quote",
  },
];

const inclusions = [
  { icon: Laptop, title: "Website setup", copy: "Custom design and development, mobile optimisation and a foundation ready for growth." },
  { icon: Search, title: "SEO foundation", copy: "On-page optimisation, technical setup and search visibility essentials." },
  { icon: BarChart3, title: "Analytics & tracking", copy: "Measurement tools configured so you can understand performance." },
  { icon: Megaphone, title: "Social media setup", copy: "Professional setup and consistent branding across your key platforms." },
  { icon: Mail, title: "Lead capture", copy: "Contact forms and enquiry journeys that help turn attention into opportunity." },
  { icon: Send, title: "Email setup", copy: "Professional email and a practical foundation for email marketing." },
  { icon: FileText, title: "Content foundation", copy: "Core pages and essential content structured to present your business clearly." },
  { icon: Headphones, title: "Launch support", copy: "Guidance, fixes and support so everything works as expected after launch." },
];

const stages = [
  { icon: Leaf, title: "New businesses", copy: "Launch an idea with a professional digital presence from day one." },
  { icon: Store, title: "Offline businesses", copy: "Move online, reach more customers and build a stronger digital channel." },
  { icon: BarChart3, title: "Established businesses", copy: "Strengthen your digital foundation and unlock new opportunities." },
];

const process = [
  ["01", "Discover", "Understand your business, goals, audience and requirements."],
  ["02", "Design", "Shape the structure, visual direction and key experiences."],
  ["03", "Build", "Develop, test and refine your digital foundation."],
  ["04", "Launch", "Take everything live carefully and verify every detail."],
  ["05", "Scale", "Support what comes next and help you grow with confidence."],
];

function DigitalBusinessLaunchPackage() {
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
            <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">Digital Business Launch Package</p>
            <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">Launch your business. <span className="text-brand-orange">Build what’s next.</span></h1>
            <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <p className="max-w-2xl text-base leading-7 text-primary-foreground/72 md:text-lg">A complete digital foundation for businesses launching online or taking an offline business online—bringing strategy, design, development and launch support together.</p>
              <a href="#packages" className="flex shrink-0 items-center gap-3 text-sm font-semibold uppercase">Explore packages <span className="flex h-10 w-10 items-center justify-center bg-brand-orange"><ArrowDownRight size={18} /></span></a>
            </div>
            <div className="mt-10 grid gap-3 border-t border-primary-foreground/20 pt-6 text-xs font-semibold sm:grid-cols-4">
              {["Strategy led", "All-in-one solution", "Built for growth", "Ongoing support"].map(item => <span key={item} className="flex items-center gap-2 text-primary-foreground/70"><Check className="text-brand-orange" size={16} />{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">A stronger start</p><h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">More than a website.</h2></div>
          <div className="flex items-end"><p className="max-w-2xl text-lg leading-8 text-muted-foreground">The Launch Package connects strategy, brand, user experience, website, visibility and launch support into one solid foundation—so you can move forward with clarity and confidence.</p></div>
        </div>
      </section>

      <section className="bg-brand-olive px-5 py-20 text-secondary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">The launch pillars</p><h2 className="font-display text-4xl font-medium md:text-6xl">Everything you need to launch and grow.</h2></div>
          <div className="grid border-l border-t border-secondary-foreground/20 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-secondary-foreground/20 p-6 lg:min-h-72"><Icon className="text-brand-silver" size={27} strokeWidth={1.6} /><h3 className="mt-10 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-secondary-foreground/72">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section id="packages" className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our packages</p><h2 className="font-display text-4xl font-medium md:text-6xl">Launch at the right level for your business.</h2></div>
          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map(pkg => <article key={pkg.name} className={`relative flex flex-col gap-8 lg:min-h-[34rem] border p-7 ${pkg.featured ? "border-brand-orange" : "border-foreground/20"}`}>
              {pkg.featured && <span className="absolute right-5 top-0 -translate-y-1/2 bg-brand-orange px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">Most popular</span>}
              <p className="text-xs font-bold uppercase text-brand-orange">{pkg.audience}</p><h3 className="mt-3 font-display text-3xl">{pkg.name}</h3><p className="mt-5 text-sm leading-6 text-muted-foreground">{pkg.intro}</p>
              <ul className="mt-8 space-y-3">{pkg.items.map(item => <li key={item} className="flex items-center gap-3 text-sm"><span className="flex h-5 w-5 shrink-0 items-center justify-center border border-brand-orange"><Check size={13} className="text-brand-orange" /></span>{item}</li>)}</ul>
              <a href={`mailto:hello@forgexd.co.za?subject=${encodeURIComponent(`${pkg.name} Launch Package enquiry`)}`} className="mt-auto flex items-center justify-between bg-brand-orange px-5 py-4 text-sm font-semibold text-primary-foreground">{pkg.action}<ArrowUpRight size={17} /></a>
            </article>)}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">Packages start from R10,000. Final investment depends on your business needs, scope and specific requirements. Detailed pricing and inclusions are available in your proposal.</p>
        </div>
      </section>

      <section className="border-y border-primary-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we handle</p><h2 className="font-display text-4xl font-medium md:text-6xl">A complete launch, handled for you.</h2></div>
          <div className="grid border-l border-t border-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{inclusions.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-primary-foreground/15 p-6"><Icon className="text-brand-orange" size={25} strokeWidth={1.6} /><h3 className="mt-8 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/62">{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-4xl"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Built for different stages</p><h2 className="font-display text-4xl font-medium md:text-6xl">Whether you’re starting, growing or scaling.</h2></div>
          <div className="grid border-l border-t border-foreground/20 md:grid-cols-3">{stages.map(({ icon: Icon, title, copy }) => <article key={title} className="border-b border-r border-foreground/20 p-7"><Icon className="text-brand-olive" size={27} strokeWidth={1.6} /><h3 className="mt-8 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="border-t border-foreground/15 px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]"><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our process</p><h2 className="max-w-4xl font-display text-4xl font-medium md:text-6xl">A clear and collaborative process.</h2><div className="mt-14 grid border-t border-foreground/20 md:grid-cols-5">{process.map(([number, title, copy]) => <article key={number} className="border-b border-foreground/20 py-7 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"><span className="flex h-11 w-11 items-center justify-center bg-brand-orange text-xs font-bold text-primary-foreground">{number}</span><h3 className="mt-8 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></div>
      </section>

      <section className="bg-brand-olive px-5 py-20 text-secondary-foreground md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20"><div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Launch support</p><h2 className="font-display text-4xl font-medium md:text-6xl">Three months of launch support.</h2></div><div><p className="max-w-2xl text-lg leading-8 text-secondary-foreground/75">Every launch package includes three months of support. We help you settle in, resolve issues and build confidence managing your new digital presence.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{["Technical support", "Bug fixes and updates", "Guidance and training", "Performance monitoring", "Help with content updates"].map(item => <span key={item} className="flex items-center gap-3 text-sm"><Check className="text-brand-silver" size={18} />{item}</span>)}</div></div></div>
      </section>

      <section className="relative overflow-hidden bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <img src={signaturePattern} alt="" aria-hidden="true" loading="lazy" className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 object-contain opacity-35" />
        <div className="signature-cta-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end"><div /><div><p className="mb-5 text-xs font-bold uppercase text-brand-orange">Ready to launch?</p><h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Let’s build a strong digital foundation for your business.</h2><p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65">Tell us where your business is now and where you want it to go. We’ll recommend the right package and next steps.</p><a href="mailto:hello@forgexd.co.za?subject=Digital%20Business%20Launch%20Package" className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold">Start a project <ArrowUpRight size={17} /></a></div></div>
        <footer className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ForgeXD</span><a href="mailto:hello@forgexd.co.za" className="hover:text-primary-foreground">hello@forgexd.co.za</a></footer>
      </section>
    </main>
  );
}