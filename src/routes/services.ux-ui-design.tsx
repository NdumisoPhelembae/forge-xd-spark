import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import showcaseImage from "../assets/ux-ui-showcase.jpg";
import { canonicalLink, socialMeta, serviceSchema } from "../lib/site";

export const Route = createFileRoute("/services/ux-ui-design")({
  head: () => ({
    links: [canonicalLink("/services/ux-ui-design")],
    meta: [
      ...socialMeta("/services/ux-ui-design"),
      {
        "script:ld+json": serviceSchema(
          "UX & UI Design",
          "/services/ux-ui-design",
          "UX & UI design for South African businesses — user research, wireframes, polished interfaces, prototypes and design systems built around real users and business goals.",
        ),
      },
      { title: "UX & UI Design | ForgeXD" },
      {
        name: "description",
        content:
          "UX & UI design for South African businesses — user research, wireframes, polished interfaces, prototypes and design systems built around real users and business goals.",
      },
      { property: "og:title", content: "UX & UI Design | ForgeXD" },
      {
        property: "og:description",
        content:
          "Design experiences people understand. UX strategy, wireframes, UI design, prototyping and design systems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UxUiDesign,
});

const disciplines = [
  {
    number: "01",
    title: "UX strategy",
    copy: "Understand users, business objectives and the problems worth solving.",
  },
  {
    number: "02",
    title: "User flows & information architecture",
    copy: "Structure the experience so users always know where they are and what to do next.",
  },
  {
    number: "03",
    title: "Wireframes",
    copy: "Define the layout and functionality before visual polish gets involved.",
  },
  {
    number: "04",
    title: "UI design",
    copy: "Create polished interfaces that are clear, consistent and aligned with the brand.",
  },
  {
    number: "05",
    title: "Prototyping",
    copy: "Turn static screens into realistic experiences that can be reviewed and tested.",
  },
  {
    number: "06",
    title: "Design systems",
    copy: "Build reusable components and rules that keep the product consistent as it grows.",
  },
];

const uxList = [
  "User journeys",
  "Information architecture",
  "Wireframes",
  "Interaction",
  "Usability",
];
const uiList = ["Typography", "Colour", "Components", "Visual hierarchy", "Responsive layouts"];

const products = [
  { title: "Websites", copy: "Marketing websites, landing pages and digital experiences." },
  { title: "Web apps", copy: "Dashboards, platforms and SaaS interfaces." },
  { title: "Mobile apps", copy: "iOS, Android and responsive mobile experiences." },
  { title: "Digital products", copy: "Complex products that need UX thinking before development." },
];

const process = [
  ["01", "Discover", "Understand the business, the users and the problem."],
  ["02", "Define", "Map the experience and establish the structure."],
  ["03", "Design", "Create wireframes, interfaces and the design system."],
  ["04", "Validate", "Prototype, test and refine."],
  ["05", "Handoff", "Deliver organized, developer-ready files."],
];

const deliverables = [
  "UX research",
  "User flows",
  "Wireframes",
  "High-fidelity UI",
  "Interactive prototype",
  "Design system",
  "Developer handoff",
];

function UxUiDesign() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[720px] bg-brand-ink text-primary-foreground md:min-h-[760px]">
        <img
          src={showcaseImage}
          alt="Designer's workspace with app wireframes on a laptop and a phone"
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-55 md:object-center"
        />
        <div className="service-hero-overlay absolute inset-0" />
        <img
          src={signaturePattern}
          alt=""
          aria-hidden="true"
          className="absolute -right-28 -top-20 h-80 w-80 rotate-12 object-cover opacity-35 md:h-[30rem] md:w-[30rem]"
        />

        <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
          <Link to="/" aria-label="ForgeXD home">
            <img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft size={17} /> Back to home
          </Link>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1400px] items-end px-5 pb-16 pt-20 md:min-h-[640px] md:px-10 md:pb-20 lg:px-16">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">
              UX &amp; UI design
            </p>
            <h1 className="font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">
              Design experiences people understand.
            </h1>
            <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <p className="max-w-2xl text-base leading-7 text-primary-foreground/72 md:text-lg">
                We design digital products and interfaces around real users, business goals and the
                way people actually behave.
              </p>
              <a
                href="#approach"
                className="flex shrink-0 items-center gap-3 text-sm font-semibold uppercase"
              >
                How we work{" "}
                <span className="flex h-10 w-10 items-center justify-center bg-brand-orange">
                  <ArrowDownRight size={18} />
                </span>
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground/55">
              {["Research", "Structure", "Interface", "Prototype"].map((step, index) => (
                <span key={step} className="flex items-center gap-4">
                  {index > 0 && (
                    <span aria-hidden="true" className="h-px w-8 bg-primary-foreground/30" />
                  )}
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our philosophy</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">
              We don't start with screens.
              <br />
              <span className="text-brand-orange">We start with the problem.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Before designing buttons, dashboards or mobile screens, we understand what the product
              needs to achieve, who it is for and where the current experience breaks down. This
              helps us design interfaces that make sense for your users and support your business
              goals.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-foreground/15 bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we do</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">
              From understanding to interface.
            </h2>
          </div>
          <div className="border-t border-primary-foreground/15">
            {disciplines.map(({ number, title, copy }) => (
              <div
                key={number}
                className="grid gap-4 border-b border-primary-foreground/15 py-8 md:grid-cols-[80px_1fr_1fr] md:items-center"
              >
                <span className="text-xs font-bold text-brand-orange">{number}</span>
                <h3 className="font-display text-2xl font-medium md:text-3xl">{title}</h3>
                <p className="max-w-md text-sm leading-6 text-primary-foreground/62">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="border-t-2 border-brand-orange pt-8">
            <p className="text-xs font-bold uppercase text-brand-orange">UX</p>
            <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">How it works.</h2>
            <ul className="mt-8 space-y-4">
              {uxList.map((item) => (
                <li
                  key={item}
                  className="border-b border-foreground/15 pb-4 text-lg text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t-2 border-brand-olive pt-8">
            <p className="text-xs font-bold uppercase text-brand-olive">UI</p>
            <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">How it feels.</h2>
            <ul className="mt-8 space-y-4">
              {uiList.map((item) => (
                <li
                  key={item}
                  className="border-b border-foreground/15 pb-4 text-lg text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-[1400px]">
          <p className="max-w-3xl font-display text-2xl leading-snug md:text-3xl">
            Good UI attracts attention. Good UX makes the{" "}
            <span className="text-brand-orange">experience obvious.</span>
          </p>
        </div>
      </section>

      <section className="bg-brand-olive px-5 py-20 text-secondary-foreground md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">What we design</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">
              Digital experiences for real businesses.
            </h2>
          </div>
          <div className="grid border-l border-t border-secondary-foreground/20 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(({ title, copy }) => (
              <article key={title} className="border-b border-r border-secondary-foreground/20 p-7">
                <h3 className="font-display text-xl font-medium">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-secondary-foreground/72">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">Our process</p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">
              Structured, tested and built for handoff.
            </h2>
          </div>
          <div className="grid border-t border-foreground/20 md:grid-cols-5">
            {process.map(([number, title, copy]) => (
              <article
                key={number}
                className="border-b border-foreground/20 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
              >
                <span className="flex h-11 w-11 items-center justify-center bg-brand-orange text-xs font-bold text-primary-foreground">
                  {number}
                </span>
                <h3 className="mt-8 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-foreground/15 px-5 py-16 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">
              What you leave with
            </p>
            <h2 className="font-display text-3xl font-medium md:text-4xl">
              Everything your team needs to build.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {deliverables.map((item) => (
              <span
                key={item}
                className="border border-foreground/20 px-4 py-3 text-sm font-semibold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          <div className="relative">
            <img
              src={showcaseImage}
              alt="App wireframes and interface design shown across laptop and mobile screens"
              loading="lazy"
              width={1536}
              height={1024}
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 h-2 w-1/3 bg-brand-orange" />
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-brand-orange">
              Starting investment
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
              UX &amp; UI design from <span className="text-brand-orange">R12,500.</span>
            </h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Final investment depends on the complexity, number of screens, research requirements
              and scope. You will receive a clear proposal after we understand the work.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold text-primary-foreground"
            >
              Discuss your project <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-ink px-5 py-20 text-primary-foreground md:px-10 md:py-28 lg:px-16">
        <img
          src={signaturePattern}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 object-cover opacity-40"
        />
        <div className="signature-cta-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <div />
          <div>
            <p className="mb-5 text-xs font-bold uppercase text-brand-orange">Ready to design?</p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">
              Have a product worth designing?
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65">
              Let's turn the idea into an experience people can actually use.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 bg-brand-orange px-6 py-4 text-sm font-semibold"
            >
              Start a project <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <footer className="relative mx-auto mt-20 flex max-w-[1400px] flex-col gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ForgeXD</span>
          <Link to="/contact" className="hover:text-primary-foreground">
            Contact
          </Link>
        </footer>
      </section>
    </main>
  );
}
