import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";

const NAV_ITEMS = [
  { label: "Services", href: "/#services" },
  { label: "About", to: "/about" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "Approach", href: "/#approach" },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
        <Link to="/" aria-label="ForgeXD home" onClick={() => setMenuOpen(false)}>
          <img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" />
        </Link>
        <nav
          className="hidden items-center gap-8 text-sm text-primary-foreground/75 md:flex"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) =>
            "to" in item ? (
              <Link
                key={item.label}
                className="hover:text-primary-foreground"
                activeProps={{ className: "text-brand-orange" }}
                to={item.to}
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} className="hover:text-primary-foreground" href={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>
        <Link
          to="/contact"
          className="hidden items-center gap-2 border border-primary-foreground/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-orange hover:text-brand-orange md:flex"
        >
          Start a project <ArrowUpRight size={16} />
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:border-brand-orange hover:text-brand-orange md:hidden"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-y border-primary-foreground/15 bg-brand-ink/95 backdrop-blur md:hidden">
          <nav className="flex flex-col px-5 py-4" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) =>
              "to" in item ? (
                <Link
                  key={item.label}
                  className="border-b border-primary-foreground/10 py-4 text-base text-primary-foreground/85"
                  activeProps={{ className: "text-brand-orange" }}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  className="border-b border-primary-foreground/10 py-4 text-base text-primary-foreground/85"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 border border-primary-foreground/30 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              Start a project <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
