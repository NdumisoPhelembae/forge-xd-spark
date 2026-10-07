import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";

export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
      <Link to="/" aria-label="ForgeXD home"><img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" /></Link>
      <nav className="flex items-center gap-5 text-sm text-primary-foreground/75 md:gap-8" aria-label="Main navigation">
        <Link className="hidden hover:text-primary-foreground sm:inline" to="/about">About</Link>
        <Link className="hover:text-primary-foreground" activeProps={{ className: "text-brand-orange" }} to="/blog">Blog</Link>
        <a href="mailto:hello@forgexd.co.za" className="hidden items-center gap-2 border border-primary-foreground/30 px-5 py-3 font-semibold text-primary-foreground transition-colors hover:border-brand-orange hover:text-brand-orange md:flex">Start a project <ArrowUpRight size={16} /></a>
      </nav>
    </header>
  );
}
