import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { getAnalyticsMeasurementId } from "../lib/analytics";
import { DEFAULT_OG_IMAGE, SITE_NAME, organizationSchema, websiteSchema } from "../lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  console.error(normalizedError);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getAnalyticsMeasurementId(),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ForgeXD — Digital Agency" },
      {
        name: "description",
        content:
          "ForgeXD creates digital experiences, brands, campaigns and strategies built for what’s next.",
      },
      { name: "author", content: "ForgeXD" },
      // Site-wide share defaults. Pages override og:url, and articles override
      // the image with their own cover.
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_ZA" },
      { property: "og:image", content: DEFAULT_OG_IMAGE.url },
      { property: "og:image:width", content: String(DEFAULT_OG_IMAGE.width) },
      { property: "og:image:height", content: String(DEFAULT_OG_IMAGE.height) },
      { property: "og:image:alt", content: DEFAULT_OG_IMAGE.alt },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE.url },
      { name: "twitter:image:alt", content: DEFAULT_OG_IMAGE.alt },
      { "script:ld+json": organizationSchema },
      { "script:ld+json": websiteSchema },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    // Google Analytics on every page, present and future. The measurement ID
    // is loaded from the secret store on the server.
    scripts: loaderData
      ? [
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${loaderData}`,
            async: true,
          },
          {
            type: "text/javascript",
            children:
              "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '" +
              loaderData +
              "');",
          },
        ]
      : [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // After a new deploy, old chunk hashes disappear. Reload once to fetch fresh files.
  useEffect(() => {
    const KEY = "forgexd-chunk-reload";
    const reloadOnce = () => {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
      window.location.reload();
    };
    const onPreloadError = (e: Event) => {
      e.preventDefault();
      reloadOnce();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = String((e.reason as Error)?.message ?? e.reason);
      if (/Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg))
        reloadOnce();
    };
    window.addEventListener("vite:preloadError", onPreloadError);
    window.addEventListener("unhandledrejection", onRejection);
    const clear = window.setTimeout(() => sessionStorage.removeItem(KEY), 10000);
    return () => {
      window.removeEventListener("vite:preloadError", onPreloadError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.clearTimeout(clear);
    };
  }, []);

  // gtag only tracks the initial page load on its own — report every route
  // change as a page view so client-side navigation is counted too.
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    const withGtag = window as unknown as { gtag?: (...args: unknown[]) => void };
    withGtag.gtag?.("event", "page_view", { page_path: pathname, page_title: document.title });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
