import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { formatDate, siteAuthor, type BlogPost } from "../lib/blog";
import { getBlogPost, getBlogPosts } from "../lib/wordpress";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: params.slug });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found | ForgeXD" }, { name: "robots", content: "noindex" }] };
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} | ForgeXD Journal` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

function PostNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-ink px-5 text-center text-primary-foreground">
      <h1 className="font-display text-4xl">This article doesn't exist.</h1>
      <Link to="/blog" className="text-brand-orange">Back to the journal</Link>
    </main>
  );
}

function BlogPost() {
  const { post } = Route.useLoaderData();
  const [related, setRelated] = useState<BlogPost[]>([]);
  useEffect(() => {
    let cancelled = false;
    void getBlogPosts({}).then((all) => {
      if (!cancelled) setRelated(all.filter((p) => p.slug !== post.slug).slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
  }, [post.slug]);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="bg-brand-ink text-primary-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-[5svh] md:px-0">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-brand-orange"><ArrowLeft size={16} /> Journal</Link>
          <p className="text-xs font-bold uppercase text-brand-orange">{post.category}</p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] md:text-6xl">{post.title}</h1>
          <p className="mt-6 text-sm text-primary-foreground/60">{post.author.name} · {formatDate(post.publishedAt)} · {post.readTime}</p>
        </div>
        <div className="mx-auto max-w-5xl px-5 md:px-10"><div className="aspect-[16/9] translate-y-16 overflow-hidden"><img src={post.coverImage} alt="" className="h-full w-full object-cover" /></div></div>
      </section>

      <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 md:px-0">
        <p className="text-xl leading-8 text-foreground/80">{post.excerpt}</p>
        {post.takeaways.length > 0 && (
          <aside className="my-12 border-l-2 border-brand-orange bg-accent p-6 md:p-8">
            <p className="mb-4 text-xs font-bold uppercase text-brand-ember">Key takeaways</p>
            <ul className="space-y-2">{post.takeaways.map((t) => <li key={t} className="flex gap-3 text-sm leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-olive" />{t}</li>)}</ul>
          </aside>
        )}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        <aside className="mt-16 border-t border-foreground/20 pt-10">
          <div className="flex items-center gap-5">
            <img src={siteAuthor.headshot} alt={siteAuthor.name} className="h-16 w-16 shrink-0 rounded-full object-cover" />
            <div>
              <p className="font-display text-xl font-medium">{siteAuthor.name}</p>
              <p className="mt-1 text-sm font-semibold text-brand-orange">{siteAuthor.role}</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-foreground">Credentials</p>
            <ul className="mt-3 space-y-2">
              {siteAuthor.credentials.map((c) => (
                <li key={c} className="flex gap-3 text-sm leading-6 text-foreground/80">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-brand-olive" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-foreground">Professional summary</p>
            <p className="mt-3 text-sm leading-6 text-foreground/80">{siteAuthor.summary}</p>
          </div>
        </aside>
        <div className="mt-16"><NewsletterSignup title="Get the next one first." copy="Join the ForgeXD letter for new articles, templates and guides." /></div>
      </article>

      <section className="border-t border-foreground/20 px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-10 font-display text-3xl font-medium md:text-4xl">Keep reading</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-brand-ink"><img src={p.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <p className="mt-5 text-xs font-bold uppercase text-brand-orange">{p.category}</p>
                <h3 className="mt-2 font-display text-xl font-medium leading-snug group-hover:text-brand-ember">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-brand-ink px-5 py-10 text-sm text-primary-foreground/55 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:justify-between"><span>© 2026 ForgeXD</span><Link className="hover:text-primary-foreground" to="/contact">Contact</Link></div>
      </footer>
    </main>
  );
}
