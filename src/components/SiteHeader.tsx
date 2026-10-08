import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import logoAsset from "../assets/forgexd-logo-cropped.png";

export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
      <Link to="/" aria-label="ForgeXD home"><img src={logoAsset} alt="ForgeXD logo" className="h-11 w-auto md:h-[50px]" /></Link>
      <nav className="hidden items-center gap-8 text-sm text-primary-foreground/75 md:flex" aria-label="Main navigation">
        <a className="hover:text-primary-foreground" href="/#services">Services</a>
        <Link className="hover:text-primary-foreground" activeProps={{ className: "text-brand-orange" }} to="/about">About</Link>
        <Link className="hover:text-primary-foreground" activeProps={{ className: "text-brand-orange" }} to="/blog">Blog</Link>
        <a className="hover:text-primary-foreground" href="/#approach">Approach</a>
        <a className="hover:text-primary-foreground" href="/#contact">Contact</a>
      </nav>
      <a href="/#contact" className="hidden items-center gap-2 border border-primary-foreground/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-orange hover:text-brand-orange md:flex">Start a project <ArrowUpRight size={16} /></a>
      <a href="/#services" aria-label="Open services" className="flex h-10 w-10 items-center justify-center border border-primary-foreground/30 md:hidden"><span className="text-lg leading-none">≡</span></a>
    </header>
  );
}
