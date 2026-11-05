import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import signatureBackground from "../assets/forgexd-signature-background.webp";
import { SiteHeader } from "../components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ForgeXD | Web Design, UX/UI & Digital Strategy" },
      { name: "description", content: "ForgeXD is a digital agency creating websites, UX/UI design, SEO and business strategies for ambitious brands." },
      { property: "og:title", content: "ForgeXD | Forge What’s Next" },
      { property: "og:description", content: "Web design, UX/UI design, business strategy and SEO for ambitious brands." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const services = [
    { number: "01", title: "Web Design & Development", description: "Digital experiences designed around your customers, built around your goals and ready to grow with your business.", href: "/services/web-design-development" },
    { number: "02", title: "UX & UI Design", description: "We turn complex ideas into intuitive, purposeful experiences that make every interaction count.", href: "/services/ux-ui-design" },
    { number: "03", title: "Digital Business Strategy", description: "Clear direction to align your business goals, digital opportunities and the decisions that move you forward.", href: "#contact" },
    { number: "04", title: "Digital Business Launch Package", description: "Everything you need to establish your digital foundation and take your business from idea to online presence.", href: "/services/digital-business-launch-package" },
    { number: "05", title: "SEO & Content Strategy", description: "Connect your business with the right searches through purposeful content, technical foundations and sustainable visibility.", href: "/services/seo-content-strategy" },
  ];

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative bg-brand-ink text-primary-foreground">
        <img className="absolute inset-0 h-full w-full object-cover opacity-75" src={signatureBackground} alt="ForgeXD geometric signature pattern" />
        <div className="signature-overlay absolute inset-0" />

        <SiteHeader />

        <div id="top" className="relative z-10 mx-auto max-w-[1400px] px-5 pb-[9svh] pt-[7svh] md:px-10 md:pt-[9svh] lg:px-16">
          <div className="max-w-4xl">
            <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">We shape digital experiences for what’s next.</h1>
            <div className="mt-8 flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
              <p className="max-w-xl text-base leading-7 text-primary-foreground/68 md:text-lg">We turn business challenges and ambitious ideas into purposeful digital experiences, bringing strategy, design, technology and growth together to move your business forward.</p>
              <a href="#services" className="flex items-center gap-3 text-sm font-semibold uppercase text-primary-foreground">Explore our work <span className="flex h-10 w-10 items-center justify-center bg-brand-orange"><ArrowDownRight size={18} /></span></a>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
            <div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we do</p><h2 className="font-display text-4xl font-medium md:text-6xl">Built to create<br />momentum.</h2></div>
            <p className="max-w-lg text-base leading-7 text-muted-foreground md:justify-self-end">From the first challenge to what comes next, we connect strategy, design and technology to turn ambitious ideas into meaningful digital progress.</p>
          </div>
          <div className="border-t border-foreground/20">
            {services.map(({ number, title, description, href }) => {
              const rowClassName = "service-link group grid gap-4 border-b border-foreground/20 py-8 md:grid-cols-[80px_1fr_1fr_40px] md:items-center";
              const row = (<>
                <span className="text-xs font-bold text-brand-orange">{number}</span>
                <h3 className="font-display text-2xl font-medium md:text-3xl">{title}</h3>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
                <ArrowUpRight className="service-arrow text-brand-olive" size={24} />
              </>);
              if (href === "/services/web-design-development") return <Link key={number} to="/services/web-design-development" className={rowClassName}>{row}</Link>;
              if (href === "/services/ux-ui-design") return <Link key={number} to="/services/ux-ui-design" className={rowClassName}>{row}</Link>;
              if (href === "/services/digital-business-launch-package") return <Link key={number} to="/services/digital-business-launch-package" className={rowClassName}>{row}</Link>;
              if (href === "/services/seo-content-strategy") return <Link key={number} to="/services/seo-content-strategy" className={rowClassName}>{row}</Link>;
              return <a key={number} href={href} className={rowClassName}>{row}</a>;
            })}
          </div>
        </div>
      </section>

      <section id="approach" className="bg-brand-olive px-5 py-20 text-secondary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div><p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our approach</p><h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">Clarity before complexity.</h2></div>
          <div className="grid gap-px bg-secondary-foreground/15 sm:grid-cols-3">
            {[["Discover", "We find the real opportunity."], ["Design", "We make every choice intentional."], ["Deliver", "We launch, learn and improve."]].map(([title, copy], index) => (
              <div key={title} className="bg-brand-olive p-7 md:min-h-56"><span className="text-xs text-brand-silver">0{index + 1}</span><h3 className="mt-12 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-secondary-foreground/70">{copy}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-5 text-xs font-bold uppercase text-brand-orange">Start something meaningful</p>
          <Link to="/contact" className="group flex items-end justify-between gap-6 border-b border-primary-foreground/30 pb-8">
            <h2 className="font-display text-4xl font-medium leading-tight md:text-7xl">Let’s forge<br />what’s next.</h2>
            <ArrowUpRight className="mb-2 shrink-0 text-brand-orange transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={40} />
          </Link>
          <p className="mt-8 max-w-2xl text-base leading-7 text-primary-foreground/65">Have a challenge worth solving? Let’s explore what we can build together.</p>
          <footer className="mt-10 flex flex-col gap-4 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ForgeXD</span><Link className="hover:text-primary-foreground" to="/contact">Contact</Link></footer>
        </div>
      </section>
    </main>
  );
}
