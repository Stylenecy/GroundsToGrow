import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Coins,
  Leaf,
  MapPin,
  Package,
  PlusCircle,
  Recycle,
  TrendingUp,
} from "lucide-react";

import {
  getCoinTxsByShop,
  getEsgByUser,
  getFeaturedShop,
  getGlobalEsg,
  getListingsByShop,
} from "@/data";
import type { ListingStatus } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/* ------------------------------------------------------------------ */
/* Helpers tampilan                                                    */
/* ------------------------------------------------------------------ */

const numberFmt = new Intl.NumberFormat("id-ID");

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTanggalSingkat(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

const jenisKopiLabel: Record<string, string> = {
  arabika: "Arabika",
  robusta: "Robusta",
  blend: "Blend",
  any: "Campuran",
};

type BadgeVariant = "default" | "secondary" | "outline";

const statusMeta: Record<
  ListingStatus,
  { label: string; variant: BadgeVariant; className: string }
> = {
  open: {
    label: "Open",
    variant: "outline",
    className: "border-accent/40 text-accent font-mono text-xs uppercase tracking-wider",
  },
  matched: {
    label: "Matched",
    variant: "default",
    className: "bg-accent text-background font-mono text-xs uppercase tracking-wider",
  },
  in_pickup: {
    label: "Pickup",
    variant: "default",
    className: "bg-highlight text-foreground font-mono text-xs uppercase tracking-wider",
  },
  completed: {
    label: "Selesai",
    variant: "default",
    className: "bg-success text-background font-mono text-xs uppercase tracking-wider",
  },
  expired: {
    label: "Kedaluwarsa",
    variant: "outline",
    className: "border-border text-muted-foreground font-mono text-xs uppercase tracking-wider",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "outline",
    className: "border-border text-muted-foreground font-mono text-xs uppercase tracking-wider",
  },
};

function esgPredikat(score: number): string {
  if (score >= 85) return "Excellent Audit";
  if (score >= 70) return "Good Standings";
  if (score >= 50) return "Fair Progress";
  return "Perlu Ditingkatkan";
}

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const shop = getFeaturedShop();
  const esg = getEsgByUser("u01a-coffee-rina");
  const globalEsg = getGlobalEsg();
  const listings = getListingsByShop(shop.profileId);
  const coinTxs = getCoinTxsByShop(shop.profileId);

  // Metric values — pakai ESG kalau ada, fallback derive dari profil/listing.
  const esgScore = esg?.ecoScore ?? shop.currentEsgScore;
  const coinBalance = shop.ecoCoinBalance;
  const kgDiverted = esg?.kgDivertedTotal ?? shop.totalKgDiverted;
  const co2Saved =
    esg?.co2EqSavedKgTotal ?? shop.totalCo2EqSaved ?? kgDiverted * 0.5;
  const coinEarned = esg?.ecoCoinTotalEarned ?? coinBalance;

  // Sortir listing & transaksi terbaru di atas.
  const listingsSorted = [...listings].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
  const coinTxsSorted = [...coinTxs].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );

  const initials = shop.kedaiName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* ============================================================ */}
      {/* 1. HEADER — editorial masthead kedai                          */}
      {/* ============================================================ */}
      <header className="relative overflow-hidden border-b border-border">
        {/* organic blob accent (C) — sangat halus */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 text-highlight/10"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M44.7,-58.9C57.4,-50.7,66.5,-36.7,70.8,-21.2C75.1,-5.6,74.6,11.5,68.1,25.8C61.6,40.1,49.1,51.6,34.8,59.6C20.5,67.6,4.3,72.1,-12.9,71.2C-30.1,70.3,-48.3,64,-60.2,51.5C-72.1,39,-77.7,20.3,-76.8,2.3C-75.9,-15.7,-68.5,-33,-56.6,-41.9C-44.7,-50.8,-28.3,-51.3,-13.3,-57.9C1.7,-64.5,15.3,-77.2,44.7,-58.9Z"
            transform="translate(100 100)"
          />
        </svg>

        <div className="relative mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <p className="eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            00 — Dashboard Mitra Kedai
          </p>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-5">
              <Avatar size="lg" className="size-16 md:size-20">
                <AvatarImage src={shop.imageUrl} alt={shop.kedaiName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-3">
                <Badge className="w-fit gap-1.5 bg-success text-success-foreground">
                  <BadgeCheck className="size-3.5" />
                  Verified Eco Partner
                </Badge>
                <h1 className="font-display text-4xl leading-[0.95] font-semibold tracking-tight text-foreground md:text-6xl">
                  {shop.kedaiName}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {shop.alamat}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                variant="outline"
                render={<Link href="/marketplace" />}
                nativeButton={false}
              >
                Lihat Marketplace
              </Button>
              <Button
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                render={<Link href="/wastescan" />}
                nativeButton={false}
              >
                <PlusCircle className="size-4" />
                Submit Ampas Baru
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. METRIC SHOWCASE — Seksi Gelap Dramatis Asimetris (Hero)    */}
      {/* ============================================================ */}
      <section className="bg-ink text-background relative overflow-hidden border-b border-border">
        {/* IDE 1: Carbon Tech subtle grid lines accent background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-20">
          <div className="flex flex-col gap-4 border-b border-background/10 pb-10 mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="eyebrow flex items-center gap-3 text-xs tracking-widest text-accent uppercase font-mono">
                <span className="h-px w-6 bg-accent" />
                01 — Performa Keberlanjutan
              </p>
              <h2 className="font-display text-2xl font-medium tracking-tight text-background/90">
                Snapshot Kinerja Sirkular & Keberlanjutan
              </h2>
            </div>
            <p className="max-w-md text-sm text-background/60 font-sans leading-relaxed">
              Data real-time penyerapan emisi karbon dan pemanfaatan kembali limbah padat roastery Anda ke dalam 8 entitas ekosistem.
            </p>
          </div>

          {/* ASYMMETRIC GRID */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 items-stretch">
            
            {/* LEFT SIDE: HERO METRIC (ESG & CARBON COVERAGE - 60% Width) */}
            <div className="grid grid-cols-1 gap-6 lg:col-span-3 bg-background/[0.02] border border-background/10 p-6 md:p-8 rounded-2xl flex-col justify-between relative group">
              
              {/* Organic script positioning for organic warmth accent */}
              <div className="absolute top-4 right-6 pointer-events-none rotate-3 hidden sm:block">
                <p className="font-script text-xl text-highlight leading-none">
                  Luar biasa, pertahankan!
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-4 text-highlight" />
                    <span className="eyebrow text-xs tracking-wider text-background/50 uppercase font-mono">
                      ESG Score Metric Anchor
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-7xl font-bold tracking-tighter text-background md:text-8xl">
                      {esgScore}
                    </span>
                    <span className="font-mono text-lg text-background/30">/100</span>
                  </div>
                  
                  <div className="mt-4 max-w-md space-y-2">
                    <Progress
                      value={esgScore}
                      className="h-2 [&_[data-slot=progress-track]]:bg-background/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-highlight [&_[data-slot=progress-indicator]]:to-success"
                    />
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-highlight uppercase tracking-wider font-semibold">
                        {esgPredikat(esgScore)}
                      </span>
                      <span className="text-background/40">Target Ekosistem: 90+</span>
                    </div>
                  </div>
                </div>

                {/* Sub-featured Carbon Tech Element Inside the Hero Frame */}
                <div className="border-t border-background/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-accent">
                      <Leaf className="size-4 shrink-0" />
                      <span className="eyebrow text-[11px] tracking-wider uppercase font-mono">Carbon Saved Contribution</span>
                    </div>
                    <p className="font-mono text-3xl font-semibold tracking-tight text-background">
                      {numberFmt.format(co2Saved)} <span className="text-sm font-sans text-accent font-normal">kg CO₂-eq</span>
                    </p>
                    <p className="text-xs text-background/40">Emisi gas rumah kaca terhindarkan</p>
                  </div>
                  
                  <div className="space-y-1 bg-accent/5 rounded-xl p-4 border border-accent/10">
                    <span className="eyebrow text-[11px] tracking-wider text-accent uppercase font-mono block">Ecosystem Status</span>
                    <p className="text-sm text-background/90 font-medium leading-snug mt-1">
                      Kedai Anda berkontribusi aktif mereduksi dampak karbon regional TPA Yogyakarta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: SUPPORTING ECONOMIC & VOLUME METRICS (40% Width) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-2">
              
              {/* Grounds Coin Asset Card */}
              <article className="bg-background/[0.03] border border-background/10 p-6 rounded-2xl flex flex-col justify-between hover:border-background/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="eyebrow text-xs tracking-wider text-background/40 uppercase font-mono block">
                      Grounds Coin Balance
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-4xl font-semibold tracking-tight text-highlight">
                        {numberFmt.format(coinBalance)}
                      </span>
                      <span className="font-mono text-xs text-highlight/70">GRC</span>
                    </div>
                  </div>
                  <div className="p-2 bg-highlight/10 rounded-xl">
                    <Coins className="size-5 text-highlight" />
                  </div>
                </div>
                <div className="border-t border-background/5 pt-4 mt-4 flex justify-between items-center text-xs text-background/50 font-mono">
                  <span>Total Keuntungan Sampingan</span>
                  <span className="text-background/80">{numberFmt.format(coinEarned)} Earned</span>
                </div>
              </article>

              {/* Total Ampas Diverted Card */}
              <article className="bg-background/[0.03] border border-background/10 p-6 rounded-2xl flex flex-col justify-between hover:border-background/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="eyebrow text-xs tracking-wider text-background/40 uppercase font-mono block">
                      Total Waste Diverted
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-4xl font-semibold tracking-tight text-success">
                        {numberFmt.format(kgDiverted)}
                      </span>
                      <span className="font-mono text-xs text-success/70">KG</span>
                    </div>
                  </div>
                  <div className="p-2 bg-success/10 rounded-xl">
                    <Recycle className="size-5 text-success" />
                  </div>
                </div>
                <div className="border-t border-background/5 pt-4 mt-4 flex justify-between items-center text-xs text-background/50 font-mono">
                  <span>Frekuensi Sirkulasi</span>
                  <span className="text-background/80">{shop.totalListings} Listings</span>
                </div>
              </article>

            </div>
          </div>

          {globalEsg ? (
            <div className="mt-10 flex items-center gap-3 rounded-xl bg-background/[0.02] border border-background/5 px-4 py-3 max-w-3xl">
              <span className="flex size-2 rounded-full bg-accent animate-pulse" />
              <p className="text-xs font-mono text-background/60">
                Dampak Kolektif: Seluruh mitra platform telah berhasil mengalihkan{" "}
                <span className="text-highlight font-semibold">{numberFmt.format(globalEsg.kgDivertedTotal)} kg</span> ampas kopi dari kerusakan ekologis TPA lokal.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3 & 4. DATA LOGS — Riwayat Listing + Ledger Grounds Coin       */}
      {/* ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          
          {/* --- LEFT COLUMN: Riwayat Setoran Ampas (7/12 Width) --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <p className="eyebrow text-xs tracking-widest text-muted-foreground uppercase font-mono">
                  02 — Waste Stream Tracking
                </p>
                <h3 className="font-display text-3xl font-semibold text-foreground">
                  Riwayat Setoran Ampas
                </h3>
              </div>
              <div className="p-2 bg-surface rounded-xl border border-border/50">
                <Package className="size-5 text-primary" />
              </div>
            </div>

            {/* Header List Editorial */}
            <div className="hidden grid-cols-12 gap-4 px-2 text-[11px] font-mono tracking-wider text-muted-foreground uppercase md:grid">
              <span className="col-span-3">Tanggal Audit</span>
              <span className="col-span-4">Karakteristik Jenis</span>
              <span className="col-span-2 text-right">Volume</span>
              <span className="col-span-3 text-right">Status Sirkulasi</span>
            </div>

            <ul className="divide-y divide-border/60 border-t border-b border-border/60">
              {listingsSorted.map((listing) => {
                const meta = statusMeta[listing.status];
                return (
                  /* IDE 2: Hover state micro-interaction (shifts slightly, changes border highlight color) */
                  <li
                    key={listing.listingId}
                    className="grid grid-cols-2 md:grid-cols-12 items-center gap-y-2 py-4 px-2 transition-all duration-300 hover:bg-surface/50 hover:translate-x-1 hover:border-primary/30 group rounded-lg"
                  >
                    <span className="col-span-1 md:col-span-3 font-mono text-sm text-foreground/80">
                      {formatTanggal(listing.createdAt)}
                    </span>
                    <span className="col-span-1 md:col-span-4 text-sm font-medium text-foreground text-right md:text-left">
                      {jenisKopiLabel[listing.jenisKopi] ?? listing.jenisKopi}
                    </span>
                    <span className="col-span-1 md:col-span-2 md:text-right font-mono text-sm font-bold text-foreground">
                      {listing.volumeKg} <span className="text-xs text-muted-foreground font-sans font-normal">kg</span>
                    </span>
                    <span className="col-span-1 md:col-span-3 flex justify-end">
                      <Badge variant={meta.variant} className={meta.className}>
                        {meta.label}
                      </Badge>
                    </span>
                  </li>
                );
              })}

              {listingsSorted.length === 0 ? (
                <li className="py-12 text-center text-sm text-muted-foreground font-sans">
                  Belum ada aliran ampas kopi tercatat. Mulai kirim setoran pertama Anda.
                </li>
              ) : null}
            </ul>
          </div>

          {/* --- RIGHT COLUMN: Ledger Grounds Coin (5/12 Width) --- */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <p className="eyebrow text-xs tracking-widest text-muted-foreground uppercase font-mono">
                  03 — Economic Node Ledger
                </p>
                <h3 className="font-display text-3xl font-semibold text-foreground">
                  Neraca Grounds Coin
                </h3>
              </div>
              <div className="p-2 bg-surface rounded-xl border border-border/50">
                <Coins className="size-5 text-highlight" />
              </div>
            </div>

            {/* IDE 3: Editorial Roastery ticket-style active balance card with dashed borders & watermarked coin background */}
            <div className="rounded-2xl border-2 border-dashed border-border bg-card p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 text-highlight/[0.06] pointer-events-none transition-transform duration-500 group-hover:scale-110">
                <Coins className="size-32" />
              </div>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-highlight" />
              <span className="eyebrow text-[11px] tracking-wider text-muted-foreground uppercase font-mono block">
                Total Kompensasi Aktif (Liquidity)
              </span>
              <div className="mt-2 flex items-baseline gap-2 relative z-10">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
                  {numberFmt.format(coinBalance)}
                </span>
                <span className="font-mono text-sm text-muted-foreground">GRC</span>
              </div>
            </div>

            {/* Transactions Audit List */}
            <div className="space-y-3 pt-2">
              <span className="eyebrow text-[10px] tracking-wider text-muted-foreground uppercase font-mono block px-1">
                Mutasi Terakhir
              </span>
              
              <div className="divide-y divide-border/50 border-t border-border/50">
                {coinTxsSorted.map((tx) => {
                  const isEarn = tx.type === "earn";
                  return (
                    <div
                      key={tx.txId}
                      className="flex items-center justify-between py-3.5 px-1 hover:bg-surface/30 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                            isEarn
                              ? "bg-success/5 border-success/20 text-success"
                              : "bg-primary/5 border-primary/20 text-primary"
                          }`}
                        >
                          {isEarn ? (
                            <ArrowDownLeft className="size-3.5" />
                          ) : (
                            <ArrowUpRight className="size-3.5" />
                          )}
                        </span>

                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm font-medium leading-snug text-foreground truncate max-w-[180px] sm:max-w-xs">
                            {tx.description}
                          </p>
                          <span className="font-mono text-[11px] text-muted-foreground block">
                            {isEarn ? "Earn Node" : "Redeem Vault"} · {formatTanggalSingkat(tx.createdAt)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 font-mono text-sm font-bold pl-2 ${
                          isEarn ? "text-success" : "text-primary"
                        }`}
                      >
                        {isEarn ? "+" : "−"}
                        {numberFmt.format(tx.amount)}
                      </span>
                    </div>
                  );
                })}

                {coinTxsSorted.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground font-sans">
                    Belum ditemukan riwayat mutasi nilai.
                  </p>
                ) : null}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}