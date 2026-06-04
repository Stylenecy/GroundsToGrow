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
/* Helpers tampilan                                                     */
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
    className:
      "border-accent/40 text-accent font-mono text-xs uppercase tracking-wider",
  },
  matched: {
    label: "Matched",
    variant: "default",
    className:
      "bg-accent text-background font-mono text-xs uppercase tracking-wider",
  },
  in_pickup: {
    label: "Pickup",
    variant: "default",
    className:
      "bg-highlight text-foreground font-mono text-xs uppercase tracking-wider",
  },
  completed: {
    label: "Selesai",
    variant: "default",
    className:
      "bg-success text-background font-mono text-xs uppercase tracking-wider",
  },
  expired: {
    label: "Kedaluwarsa",
    variant: "outline",
    className:
      "border-border text-muted-foreground font-mono text-xs uppercase tracking-wider",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "outline",
    className:
      "border-border text-muted-foreground font-mono text-xs uppercase tracking-wider",
  },
};

// ESG score label yang mudah dipahami orang awam
function esgPredikat(score: number): string {
  if (score >= 85) return "Sangat Baik";
  if (score >= 70) return "Baik";
  if (score >= 50) return "Cukup";
  return "Perlu Ditingkatkan";
}

// Warna predikat ESG untuk emphasis visual
function esgPredikatColor(score: number): string {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-highlight";
  if (score >= 50) return "text-accent";
  return "text-primary";
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
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
  const coinTxsSorted = [...coinTxs].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );

  const initials = shop.kedaiName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Progress ESG menuju target 90 (dalam persen dari 0–90)
  const esgProgressPct = Math.min(Math.round((esgScore / 90) * 100), 100);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* ============================================================ */}
      {/* 1. HEADER — editorial masthead kedai                          */}
      {/* ============================================================ */}
      <header className="relative overflow-hidden border-b border-border">
        {/* organic blob accent — sangat halus */}
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

        <div className="relative mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-16">
          <p className="eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            00 — Dashboard Mitra Kedai
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <Avatar size="lg" className="size-14 shrink-0 md:size-20">
                <AvatarImage src={shop.imageUrl} alt={shop.kedaiName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2.5">
                <Badge className="w-fit gap-1.5 bg-success text-success-foreground">
                  <BadgeCheck className="size-3.5" />
                  Verified Eco Partner
                </Badge>
                {/* text-3xl di HP supaya tidak terpotong */}
                <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground md:text-6xl md:leading-[0.95]">
                  {shop.kedaiName}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {shop.alamat}
                </p>
              </div>
            </div>

            {/* Tombol CTA — wrap ke bawah di HP tanpa overflow */}
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
      {/* 2. METRIC SHOWCASE — Seksi Gelap Hero Asimetris               */}
      {/* ============================================================ */}
      <section className="bg-ink text-background relative overflow-hidden border-b border-border">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
          {/* Section heading */}
          <div className="flex flex-col gap-3 border-b border-background/10 pb-8 mb-10 md:flex-row md:items-end md:justify-between md:gap-4">
            <div className="space-y-1.5">
              <p className="eyebrow flex items-center gap-3 text-xs tracking-widest text-accent uppercase font-mono">
                <span className="h-px w-6 bg-accent" />
                01 — Performa Keberlanjutan
              </p>
              <h2 className="font-display text-xl font-medium tracking-tight text-background/90 md:text-2xl">
                Ringkasan Kinerja Daur Ulang & Iklim
              </h2>
            </div>
            <p className="text-sm text-background/55 font-sans leading-relaxed md:max-w-xs">
              Semua angka dihitung dari total ampas kopi yang sudah kamu setor
              ke platform.
            </p>
          </div>

          {/* ASYMMETRIC GRID — 1 kolom di HP, 5 kolom di desktop */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-stretch">

            {/* ====================================================== */}
            {/* HERO CARD KIRI: Skor ESG + Karbon (60% lebar desktop)  */}
            {/* ====================================================== */}
            <div className="flex flex-col justify-between gap-8 rounded-2xl border border-background/10 bg-background/[0.02] p-6 md:p-8 lg:col-span-3">

              {/* Aksesori script — tampil ab sm ke atas */}
              <div className="absolute pointer-events-none rotate-3 hidden sm:block self-end -mt-2 mr-2">
                <p className="font-script text-xl text-highlight leading-none">
                  Luar biasa, pertahankan!
                </p>
              </div>

              {/* — SKOR ESG — */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-highlight shrink-0" />
                  {/* Label mudah dipahami awam */}
                  <span className="eyebrow text-xs tracking-wider text-background/50 uppercase font-mono">
                    Skor ESG Kedai
                  </span>
                </div>

                {/* Angka besar */}
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-7xl font-bold tracking-tighter text-background md:text-8xl">
                    {esgScore}
                  </span>
                  <span className="font-mono text-lg text-background/30">
                    /100
                  </span>
                </div>

                {/* Progress bar ESG menuju target 90 */}
                <div className="space-y-2">
                  {/* Bar menggunakan komponen Progress yang sudah ada */}
                  <Progress
                    value={esgProgressPct}
                    className="h-2 [&_[data-slot=progress-track]]:bg-background/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-highlight [&_[data-slot=progress-indicator]]:to-success"
                  />
                  <div className="flex items-center justify-between text-xs font-mono">
                    {/* Predikat dengan warna dinamis */}
                    <span className={`uppercase tracking-wider font-semibold ${esgPredikatColor(esgScore)}`}>
                      {esgPredikat(esgScore)}
                    </span>
                    {/* Progres menuju target eksplisit */}
                    <span className="text-background/40">
                      {esgScore} dari target 90
                    </span>
                  </div>
                  {/* Micro-copy: apa artinya skor ini */}
                  <p className="text-xs text-background/35 leading-relaxed">
                    Skor dihitung dari konsistensi setoran ampas, kecepatan respons, dan dampak lingkungan kumulatif.
                  </p>
                </div>
              </div>

              {/* — KARBON TERHINDARKAN — */}
              <div className="grid grid-cols-1 gap-5 border-t border-background/10 pt-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-accent">
                    <Leaf className="size-4 shrink-0" />
                    <span className="eyebrow text-[11px] tracking-wider uppercase font-mono">
                      Karbon Terhindarkan
                    </span>
                  </div>
                  {/* Angka karbon */}
                  <p className="font-mono text-3xl font-semibold tracking-tight text-background">
                    {numberFmt.format(co2Saved)}{" "}
                    <span className="text-sm font-sans text-accent font-normal">
                      kg CO₂-eq
                    </span>
                  </p>
                  {/* Micro-copy: jelaskan asal angka tanpa mengubah nilainya */}
                  <p className="text-xs text-background/40 leading-snug">
                    ≈ 0,5 × kg ampas yang kamu setor —{" "}
                    emisi gas rumah kaca yang tidak jadi terlepas ke atmosfer.
                  </p>
                </div>

                <div className="space-y-1.5 rounded-xl border border-accent/10 bg-accent/5 p-4">
                  <span className="eyebrow text-[11px] tracking-wider text-accent uppercase font-mono block">
                    Dampak Nyata
                  </span>
                  <p className="text-sm text-background/85 font-medium leading-snug mt-1">
                    Setoran ampas kamu membantu mengurangi beban TPA Yogyakarta
                    dan emisi gas metana dari pembusukan organik.
                  </p>
                </div>
              </div>
            </div>

            {/* ====================================================== */}
            {/* KARTU KANAN: Grounds Coin + Total Ampas (40% desktop)  */}
            {/* ====================================================== */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">

              {/* — GROUNDS COIN — */}
              <article className="flex flex-col justify-between rounded-2xl border border-background/10 bg-background/[0.03] p-5 md:p-6 transition-all hover:border-background/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="eyebrow text-xs tracking-wider text-background/40 uppercase font-mono block">
                      Saldo Grounds Coin
                    </span>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-mono text-4xl font-semibold tracking-tight text-highlight">
                        {numberFmt.format(coinBalance)}
                      </span>
                      <span className="font-mono text-xs text-highlight/70">
                        GRC
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl bg-highlight/10 p-2">
                    <Coins className="size-5 text-highlight" />
                  </div>
                </div>
                {/* Micro-copy: fungsi koin untuk orang awam */}
                <p className="mt-3 text-xs text-background/40 leading-snug">
                  Koin reward dari setoran ampas — bisa ditukar di marketplace mitra.
                </p>
                <div className="mt-4 flex justify-between items-center border-t border-background/5 pt-3 text-xs text-background/50 font-mono">
                  <span>Total koin diterima</span>
                  <span className="text-background/80">
                    {numberFmt.format(coinEarned)} GRC
                  </span>
                </div>
              </article>

              {/* — TOTAL AMPAS DIALIHKAN — */}
              <article className="flex flex-col justify-between rounded-2xl border border-background/10 bg-background/[0.03] p-5 md:p-6 transition-all hover:border-background/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="eyebrow text-xs tracking-wider text-background/40 uppercase font-mono block">
                      Total Ampas Dialihkan
                    </span>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-mono text-4xl font-semibold tracking-tight text-success">
                        {numberFmt.format(kgDiverted)}
                      </span>
                      <span className="font-mono text-xs text-success/70">
                        kg
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl bg-success/10 p-2">
                    <Recycle className="size-5 text-success" />
                  </div>
                </div>
                {/* Micro-copy: apa artinya "dialihkan" */}
                <p className="mt-3 text-xs text-background/40 leading-snug">
                  Ampas kopi yang berhasil diarahkan ke pembeli/mitra — tidak berakhir di TPA.
                </p>
                <div className="mt-4 flex justify-between items-center border-t border-background/5 pt-3 text-xs text-background/50 font-mono">
                  <span>Dari total</span>
                  <span className="text-background/80">
                    {shop.totalListings} setoran
                  </span>
                </div>
              </article>
            </div>
          </div>

          {/* Banner dampak kolektif platform */}
          {globalEsg ? (
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-background/5 bg-background/[0.02] px-4 py-3">
              <span className="flex size-2 shrink-0 animate-pulse rounded-full bg-accent" />
              <p className="text-xs font-mono text-background/55">
                Dampak Kolektif: Seluruh mitra platform telah berhasil mengalihkan{" "}
                <span className="font-semibold text-highlight">
                  {numberFmt.format(globalEsg.kgDivertedTotal)} kg
                </span>{" "}
                ampas kopi dari TPA lokal.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3 & 4. DATA LOGS — Riwayat Setoran + Neraca Grounds Coin      */}
      {/* ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">

          {/* ====================================================== */}
          {/* KIRI: Riwayat Setoran Ampas (7/12 lebar desktop)        */}
          {/* ====================================================== */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <p className="eyebrow text-xs tracking-widest text-muted-foreground uppercase font-mono">
                  02 — Riwayat Setoran Ampas
                </p>
                <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                  Riwayat Setoran Ampas
                </h3>
              </div>
              <div className="rounded-xl border border-border/50 bg-surface p-2">
                <Package className="size-5 text-primary" />
              </div>
            </div>

            {/* Header kolom — hanya muncul di layar md ke atas */}
            <div className="hidden grid-cols-12 gap-4 px-2 text-[11px] font-mono tracking-wider text-muted-foreground uppercase md:grid">
              <span className="col-span-3">Tanggal</span>
              <span className="col-span-4">Jenis Kopi</span>
              <span className="col-span-2 text-right">Berat</span>
              <span className="col-span-3 text-right">Status</span>
            </div>

            <ul className="divide-y divide-border/60 border-b border-t border-border/60">
              {listingsSorted.length > 0 ? (
                listingsSorted.map((listing) => {
                  const meta = statusMeta[listing.status];
                  return (
                    <li
                      key={listing.listingId}
                      className="grid grid-cols-2 items-center gap-y-1.5 rounded-lg px-2 py-4 transition-all duration-200 hover:translate-x-1 hover:bg-surface/50 md:grid-cols-12 md:gap-y-0"
                    >
                      {/* Tanggal */}
                      <span className="col-span-1 font-mono text-sm text-foreground/70 md:col-span-3">
                        {formatTanggal(listing.createdAt)}
                      </span>
                      {/* Jenis kopi */}
                      <span className="col-span-1 text-right text-sm font-medium text-foreground md:col-span-4 md:text-left">
                        {jenisKopiLabel[listing.jenisKopi] ?? listing.jenisKopi}
                      </span>
                      {/* Volume */}
                      <span className="col-span-1 font-mono text-sm font-bold text-foreground md:col-span-2 md:text-right">
                        {listing.volumeKg}{" "}
                        <span className="text-xs font-normal font-sans text-muted-foreground">
                          kg
                        </span>
                      </span>
                      {/* Status badge */}
                      <span className="col-span-1 flex justify-end md:col-span-3">
                        <Badge variant={meta.variant} className={meta.className}>
                          {meta.label}
                        </Badge>
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Belum ada setoran ampas tercatat.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Tekan &ldquo;Submit Ampas Baru&rdquo; untuk memulai setoran pertamamu.
                  </p>
                </li>
              )}
            </ul>
          </div>

          {/* ====================================================== */}
          {/* KANAN: Neraca Grounds Coin (5/12 lebar desktop)         */}
          {/* ====================================================== */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <p className="eyebrow text-xs tracking-widest text-muted-foreground uppercase font-mono">
                  03 — Neraca Koin
                </p>
                <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                  Neraca Grounds Coin
                </h3>
              </div>
              <div className="rounded-xl border border-border/50 bg-surface p-2">
                <Coins className="size-5 text-highlight" />
              </div>
            </div>

            {/* Kartu saldo aktif */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card p-6 shadow-sm">
              {/* Watermark koin di background */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 text-highlight/[0.06] transition-transform duration-500 group-hover:scale-110">
                <Coins className="size-32" />
              </div>
              {/* Aksen vertikal kiri */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-highlight" />

              <span className="eyebrow block text-[11px] tracking-wider text-muted-foreground uppercase font-mono">
                Saldo Koin Aktif
              </span>
              <div className="relative z-10 mt-2 flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
                  {numberFmt.format(coinBalance)}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  GRC
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground/70 leading-snug">
                Bisa ditukar dengan produk atau layanan mitra di marketplace.
              </p>
            </div>

            {/* Riwayat mutasi transaksi */}
            <div className="space-y-3 pt-1">
              <span className="eyebrow block px-1 text-[10px] tracking-wider text-muted-foreground uppercase font-mono">
                Mutasi Terakhir
              </span>

              <div className="divide-y divide-border/50 border-t border-border/50">
                {coinTxsSorted.length > 0 ? (
                  coinTxsSorted.map((tx) => {
                    const isEarn = tx.type === "earn";
                    return (
                      <div
                        key={tx.txId}
                        className="flex items-center justify-between rounded-lg px-1 py-3.5 transition-colors hover:bg-surface/30"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                              isEarn
                                ? "border-success/20 bg-success/5 text-success"
                                : "border-primary/20 bg-primary/5 text-primary"
                            }`}
                          >
                            {isEarn ? (
                              <ArrowDownLeft className="size-3.5" />
                            ) : (
                              <ArrowUpRight className="size-3.5" />
                            )}
                          </span>

                          <div className="min-w-0 space-y-0.5">
                            <p className="max-w-[180px] truncate text-sm font-medium leading-snug text-foreground sm:max-w-xs">
                              {tx.description}
                            </p>
                            {/* Label jenis transaksi — bahasa awam */}
                            <span className="block font-mono text-[11px] text-muted-foreground">
                              {isEarn ? "Reward Masuk" : "Penukaran"} ·{" "}
                              {formatTanggalSingkat(tx.createdAt)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 pl-2 font-mono text-sm font-bold ${
                            isEarn ? "text-success" : "text-primary"
                          }`}
                        >
                          {isEarn ? "+" : "−"}
                          {numberFmt.format(tx.amount)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Belum ada riwayat transaksi koin.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      Koin akan muncul setelah setoran pertamamu diproses.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}