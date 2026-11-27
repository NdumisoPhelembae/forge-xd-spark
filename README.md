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
| Contact form | `src/lib/contact.ts` submits to the Fluent Forms Contact form (ID 4) |
| Newsletter | `src/lib/newsletter.ts` submits to the Fluent Forms Subscription form (ID 3) |
| Canonical URLs | `src/lib/site.ts` builds every canonical from `https://forgexd.co.za` |
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
