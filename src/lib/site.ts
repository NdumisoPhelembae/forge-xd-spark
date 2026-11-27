// Single source of truth for the public site address. Every canonical URL is
// built from this, so Google always credits forgexd.co.za, never a preview or
// Lovable subdomain.
export const SITE_URL = "https://forgexd.co.za";

export function canonicalLink(path: string) {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return { rel: "canonical", href: `${SITE_URL}${clean}` };
}
