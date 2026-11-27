# ForgeXD Website

The marketing site for ForgeXD, a digital agency offering web design and development, UX/UI design, digital business strategy and SEO.

**Live site:** https://forgexd.co.za

## Stack

- TanStack Start (React 19, server rendering) on Vite
- Tailwind CSS v4 with shadcn/ui components
- Headless WordPress at https://cms.forgexd.co.za for blog posts
- Fluent Forms on the same WordPress install for the contact form and newsletter
- Built as a Node server and hosted on xCloud

## How it fits together

| Area | Where it lives |
| --- | --- |
| Pages | `src/routes` (one file per route) |
| Blog data | `src/lib/wordpress.ts` reads the WordPress REST API, caches results on the server for 5 minutes and falls back to the sample posts in `src/lib/blog.ts` if the CMS is empty or unreachable |
| Free SEO audit | `/tools/free-seo-audit`. Scoring engine in `src/lib/seo-audit.ts` (runs in the browser, tested in `seo-audit.test.ts`); URL fetching in `src/lib/page-fetch.server.ts` (public addresses only, redirects re-checked, 2 MB cap, 20 fetches per IP per 10 minutes) |
| Contact form | `src/lib/contact.ts` submits to the Fluent Forms Contact form (ID 4) |
| Newsletter | `src/lib/newsletter.ts` submits to the Fluent Forms Subscription form (ID 3) |
| SEO | `src/lib/site.ts` builds canonicals, share tags and JSON-LD (Organization, WebSite, Person, Service, BlogPosting, BreadcrumbList) from `https://forgexd.co.za` |
| Sitemap | `src/lib/sitemap.ts`, served at `/sitemap.xml` by `src/server.ts`. Static pages plus live WordPress posts, cached 15 minutes. Add new static routes to `STATIC_PAGES` |
| CMS outages | The last good blog data is served; with none cached, blog pages and the sitemap answer 503 with Retry-After |
| Analytics | GA4, loaded in `src/routes/__root.tsx`; set `GOOGLE_ANALYTICS_MEASUREMENT_ID` to override the default tag |

All CMS and form requests run on the server, so nothing about the WordPress backend is shipped to the browser.

## Development

Requires Node.js 22 or later and [Bun](https://bun.sh).

```sh
bun install
bun run dev       # local dev server
bun run build     # production build (Node server output in .output/)
bun run start     # run the production build
bun run lint      # ESLint with Prettier
bun run format    # format everything with Prettier
```

## Deployment

Pushing to `main` deploys to xCloud through the GitHub integration. The repo is also connected to Lovable, so commits sync both ways. Do not force push or rewrite history on `main`.
