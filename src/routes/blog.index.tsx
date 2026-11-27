import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { categories, formatDate } from "../lib/blog";
import { getBlogPosts } from "../lib/wordpress";
import signaturePattern from "../assets/forgexd-signature-pattern.png";
import { canonicalLink } from "../lib/site";

export const Route = createFileRoute("/blog/")({
  loader: () => getBlogPosts({}),
  head: () => ({
    links: [canonicalLink("/blog")],
    meta: [
      { title: "Journal | ForgeXD — Strategy, Design & Growth" },
      {
        name: "description",
        content:
          "Practical articles, guides and templates on digital strategy, UX/UI design, web development and SEO from the ForgeXD studio.",
      },
      { property: "og:title", content: "The ForgeXD Journal" },
      {
        property: "og:description",
        content: "Ideas, guides and templates on strategy, design and growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();
  const [active, setActive] = useState<string>("All");
  const [featured, ...rest] = posts;
  const list = active === "All" ? rest : posts.filter((p) => p.categories.includes(active));

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative overflow-hidden bg-brand-ink text-primary-foreground">
        <img
          src={signaturePattern}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-20 w-[640px] rotate-12 opacity-30"
        />
        <SiteHeader />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-[8svh] pt-[6svh] md:px-10 lg:px-16">
          <p className="mb-5 text-xs font-semibold uppercase text-brand-orange">
            The ForgeXD Journal
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-medium leading-[1.08] md:text-6xl lg:text-7xl">
            Ideas worth <span className="text-brand-orange">forging.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/68 md:text-lg">
            Notes, guides and templates on strategy, design and growth — written for people building
            what's next.
          </p>
        </div>
      </section>

      {active === "All" && featured && (
        <section className="px-5 pt-16 md:px-10 md:pt-24 lg:px-16">
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group mx-auto grid max-w-[1400px] gap-8 border-b border-foreground/20 pb-16 lg:grid-cols-[1.3fr_1fr] lg:items-center"
          >
            <div className="aspect-[16/10] overflow-hidden bg-brand-ink">
              <img
                src={featured.coverImage}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-brand-orange">
                Featured · {featured.categories.join(" · ")}
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight md:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">{featured.excerpt}</p>
              <p className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                {formatDate(featured.publishedAt)} · {featured.readTime}{" "}
                <ArrowUpRight
                  className="text-brand-olive transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  size={20}
                />
              </p>
            </div>
          </Link>
        </section>
      )}

      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div
            className="mb-12 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter by category"
          >
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`border px-4 py-2 text-sm transition-colors ${active === c ? "border-brand-orange bg-brand-orange text-primary-foreground" : "border-foreground/20 hover:border-brand-orange"}`}
              >
                {c}
              </button>
            ))}
          </div>
          {list.length === 0 ? (
            <p className="text-muted-foreground">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-brand-ink">
                    <img
                      src={p.coverImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase text-brand-orange">
                    {p.categories.join(" · ")}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium leading-snug group-hover:text-brand-ember">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-5 text-xs text-muted-foreground">
                    {formatDate(p.publishedAt)} · {p.readTime}
                  </p>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-24">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <footer className="bg-brand-ink px-5 py-10 text-sm text-primary-foreground/55 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:justify-between">
          <span>© 2026 ForgeXD</span>
          <Link className="hover:text-primary-foreground" to="/contact">
            Contact
          </Link>
        </div>
      </footer>
    </main>
  );
}
