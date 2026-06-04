"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  index: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Beranda", index: "01" },
  { href: "/wastescan", label: "WasteScan", index: "02" },
  { href: "/dashboard", label: "Dashboard", index: "03" },
  { href: "/marketplace", label: "Marketplace", index: "04" },
  { href: "/orders", label: "Histori", index: "05" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
        {/* Wordmark editorial */}
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            Grounds<span className="italic text-primary">To</span>Grow
          </span>
          <span className="eyebrow hidden text-[0.6rem] text-muted-foreground sm:inline-flex">
            Circular Engine
          </span>
        </Link>

        {/* Nav editorial — desktop */}
        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
          {NAV_LINKS.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group inline-flex items-baseline gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.62rem] tracking-widest transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground/60 group-hover:text-accent"
                  )}
                >
                  {link.index}
                </span>
                <span className={cn("font-medium", active && "font-semibold")}>
                  {link.label}
                </span>
                {active && (
                  <span className="ml-0.5 size-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-surface sm:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="border-t border-border bg-background/95 backdrop-blur sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2">
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-3 text-base transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  )}
                >
                  <span className="font-mono text-xs tracking-widest text-muted-foreground/60">
                    {link.index}
                  </span>
                  <span className={cn("font-medium", active && "font-semibold")}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
