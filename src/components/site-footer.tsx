import Link from "next/link";
import { Leaf } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/wastescan", label: "WasteScan" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-3.5" />
            </span>
            <span>
              Grounds<span className="text-accent">To</span>Grow
            </span>
          </div>
          <p className="text-sm font-medium text-primary">
            From Waste to Wealth, From Coffee to Carbon.
          </p>
          <p className="text-xs text-muted-foreground">
            Engine sirkular ekonomi 8-entitas — powered by WasteLoop.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Navigasi
          </span>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 GroundsToGrow × WasteLoop — MVP UAS Digital Platform &
            Sharing Economy.
          </span>
          <span>Dibuat oleh Tim GroundsToGrow.</span>
        </div>
      </div>
    </footer>
  );
}
