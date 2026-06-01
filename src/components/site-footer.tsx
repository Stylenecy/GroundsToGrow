import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/", label: "Beranda", index: "01" },
  { href: "/wastescan", label: "WasteScan", index: "02" },
  { href: "/dashboard", label: "Dashboard", index: "03" },
  { href: "/marketplace", label: "Marketplace", index: "04" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
          {/* Brand + tagline besar */}
          <div className="space-y-5">
            <p className="eyebrow text-highlight">From Coffee to Carbon</p>
            <h2 className="font-display text-3xl leading-[1.05] font-semibold tracking-tight text-background sm:text-4xl">
              From Waste to{" "}
              <span className="italic text-highlight">Wealth.</span>
            </h2>
            <p className="max-w-md text-sm text-background/60">
              Engine sirkular ekonomi 8-entitas — satu kilogram ampas kopi jadi
              skincare, briket, kompos, hingga carbon credit. Powered by
              WasteLoop.
            </p>
          </div>

          {/* Navigasi editorial */}
          <nav className="flex flex-col">
            <span className="eyebrow mb-4 text-background/40">Navigasi</span>
            <ul className="divide-y divide-background/10 border-t border-background/10">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 py-3 text-background/80 transition-colors hover:text-highlight"
                  >
                    <span className="font-mono text-xs text-background/40 transition-colors group-hover:text-highlight">
                      {link.index}
                    </span>
                    <span className="font-display text-lg">{link.label}</span>
                    <ArrowUpRight className="ml-auto size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-5 font-mono text-[0.7rem] tracking-wide text-background/45 md:flex-row md:items-center md:justify-between md:px-8">
          <span>
            © 2026 GROUNDSTOGROW × WASTELOOP — MVP UAS DIGITAL PLATFORM &
            SHARING ECONOMY
          </span>
          <span>DIBUAT OLEH TIM GROUNDSTOGROW</span>
        </div>
      </div>
    </footer>
  );
}
