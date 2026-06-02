"use client";

import { useState } from "react";
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
  X,
  Coffee,
  Scale,
  Clock,
  Sparkles,
} from "lucide-react";

import {
  getCoinTxsByShop,
  getEsgByUser,
  getFeaturedShop,
  getGlobalEsg,
} from "@/data";
import { useListings } from "@/context/ListingsContext";
import type { ListingStatus } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { JenisKopi } from "@/types";

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
    className: "border-accent/40 text-accent",
  },
  matched: {
    label: "Matched",
    variant: "default",
    className: "bg-accent text-accent-foreground",
  },
  in_pickup: {
    label: "Pickup",
    variant: "default",
    className: "bg-highlight text-highlight-foreground",
  },
  completed: {
    label: "Selesai",
    variant: "default",
    className: "bg-success text-success-foreground",
  },
  expired: {
    label: "Kedaluwarsa",
    variant: "outline",
    className: "border-border text-muted-foreground",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "outline",
    className: "border-border text-muted-foreground",
  },
};

function esgPredikat(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Perlu Ditingkatkan";
}

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const shop = getFeaturedShop();
  const esg = getEsgByUser("u01a-coffee-rina");
  const globalEsg = getGlobalEsg();
  const { getListingsByShop, addListing } = useListings();
  const listings = getListingsByShop(shop.profileId);
  const coinTxs = getCoinTxsByShop(shop.profileId);

  // Form state for inline ampas submission
  const [showForm, setShowForm] = useState(false);
  const [formJenis, setFormJenis] = useState<JenisKopi>("arabika");
  const [formVolume, setFormVolume] = useState("2.5");
  const [formFreshness, setFormFreshness] = useState("2");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAmpas = () => {
    const vol = parseFloat(formVolume);
    const fresh = parseInt(formFreshness);
    if (isNaN(vol) || vol <= 0) { toast.error("Volume harus > 0"); return; }
    if (isNaN(fresh) || fresh < 0) { toast.error("Freshness harus >= 0 jam"); return; }

    setIsSubmitting(true);
    // Simulate short delay
    setTimeout(() => {
      const newListing = {
        listingId: `lst-dash-${Date.now()}`,
        coffeeShopProfileId: shop.profileId,
        coffeeShopName: shop.kedaiName,
        jenisKopi: formJenis,
        volumeKg: vol,
        freshnessJam: fresh,
        hargaPerKg: fresh <= 4 ? 2000 : fresh <= 12 ? 1000 : 0,
        imageUrl: "https://placehold.co/600x400/6B3A2A/F5ECD7?text=Ampas+Kopi",
        status: "open" as const,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      addListing(newListing);
      toast.success("Ampas Berhasil Diterbitkan!", {
        description: `${vol} kg ${formJenis} · freshness ${fresh} jam`,
      });
      setShowForm(false);
      setFormJenis("arabika");
      setFormVolume("2.5");
      setFormFreshness("2");
      setIsSubmitting(false);
    }, 600);
  };
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
    <div className="bg-background text-foreground">
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
                onClick={() => setShowForm(true)}
              >
                <PlusCircle className="size-4" />
                Submit Ampas Baru
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MODAL FORM: Submit Ampas Baru                                */}
      {/* ============================================================ */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Submit Ampas Baru</h3>
                  <p className="text-sm text-muted-foreground">Langsung terbitkan ke Marketplace</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-full p-2 hover:bg-surface text-muted-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col gap-5 p-6">
                {/* Jenis Kopi */}
                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-muted-foreground flex items-center gap-1.5">
                    <Coffee className="size-3.5 text-primary" />
                    Jenis Kopi
                  </label>
                  <div className="flex gap-2">
                    {(["arabika", "robusta", "blend"] as JenisKopi[]).map((j) => (
                      <button
                        key={j}
                        onClick={() => setFormJenis(j)}
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium capitalize transition-all ${
                          formJenis === j
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                            : "border-border bg-surface text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                        }`}
                      >
                        {j}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume */}
                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-muted-foreground flex items-center gap-1.5">
                    <Scale className="size-3.5 text-primary" />
                    Volume (kg)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-4 font-mono text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="contoh: 5.0"
                  />
                </div>

                {/* Freshness */}
                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    Freshness (jam sejak seduh)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="48"
                    step="1"
                    value={formFreshness}
                    onChange={(e) => setFormFreshness(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-4 font-mono text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="contoh: 2"
                  />
                </div>

                {/* Grade Preview */}
                <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Estimasi Grade</p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    {parseInt(formFreshness) <= 4
                      ? "⭐ Grade A · Premium (Skincare)"
                      : parseInt(formFreshness) <= 12
                        ? "🟡 Grade B · Standar (Kompos)"
                        : "🔵 Grade C · Industri (Briket)"}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 border-t border-border px-6 py-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
                <Button
                  className="flex-[2] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  onClick={handleSubmitAmpas}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Menerbitkan...</>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Terbitkan ke Marketplace
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* 2. METRIC SHOWCASE — seksi gelap dramatis (B)                 */}
      {/* ============================================================ */}
      <section className="bg-ink text-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="flex flex-col gap-2 border-b border-background/15 pb-8 md:flex-row md:items-end md:justify-between">
            <p className="eyebrow flex items-center gap-3 text-highlight">
              <span className="h-px w-8 bg-highlight/50" />
              01 — Performa Keberlanjutan
            </p>
            <p className="max-w-md text-sm text-background/60">
              Ringkasan dampak {shop.kedaiName} per snapshot terbaru — skor ESG,
              reward coin, dan karbon yang dicegah.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
            {/* ESG Score */}
            <article className="flex flex-col gap-4 bg-background/[0.04] p-6 ring-1 ring-background/10">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-background/50">ESG Score</span>
                <TrendingUp className="size-4 text-highlight" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-5xl font-semibold tracking-tighter text-background">
                  {esgScore}
                </span>
                <span className="font-mono text-sm text-background/50">
                  /100
                </span>
              </div>
              <Progress
                value={esgScore}
                className="[&_[data-slot=progress-track]]:bg-background/15 [&_[data-slot=progress-indicator]]:bg-highlight"
              />
              <span className="font-mono text-xs tracking-wide text-highlight uppercase">
                {esgPredikat(esgScore)}
              </span>
            </article>

            {/* Grounds Coin */}
            <article className="flex flex-col gap-4 bg-background/[0.04] p-6 ring-1 ring-background/10">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-background/50">Grounds Coin</span>
                <Coins className="size-4 text-highlight" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-semibold tracking-tighter text-background">
                  {numberFmt.format(coinBalance)}
                </span>
                <span className="font-mono text-sm text-background/50">GRC</span>
              </div>
              <span className="mt-auto text-xs text-background/55">
                {numberFmt.format(coinEarned)} total earned
              </span>
            </article>

            {/* Carbon Saved — aksen teal carbon (B) */}
            <article className="flex flex-col gap-4 bg-accent/15 p-6 ring-1 ring-accent/30">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-accent">Carbon Saved</span>
                <Leaf className="size-4 text-accent" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-semibold tracking-tighter text-background">
                  {numberFmt.format(co2Saved)}
                </span>
                <span className="font-mono text-sm text-accent">
                  kg CO₂-eq
                </span>
              </div>
              <span className="mt-auto text-xs text-background/55">
                Setara emisi yang dicegah
              </span>
            </article>

            {/* Total Ampas */}
            <article className="flex flex-col gap-4 bg-background/[0.04] p-6 ring-1 ring-background/10">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-background/50">Total Ampas</span>
                <Recycle className="size-4 text-success" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-semibold tracking-tighter text-background">
                  {numberFmt.format(kgDiverted)}
                </span>
                <span className="font-mono text-sm text-background/50">kg</span>
              </div>
              <span className="mt-auto text-xs text-background/55">
                {listings.length} listing sepanjang waktu
              </span>
            </article>
          </div>

          {globalEsg ? (
            <p className="mt-6 text-sm text-background/55">
              Kontribusi ke ekosistem global:{" "}
              <span className="font-mono text-highlight">
                {numberFmt.format(globalEsg.kgDivertedTotal)} kg
              </span>{" "}
              ampas dialihkan dari TPA oleh seluruh mitra GroundsToGrow.
            </p>
          ) : null}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3 & 4. RIWAYAT LISTING + GROUNDS COIN                         */}
      {/* ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
          {/* --- Riwayat Listing (2/3) --- */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
              <div className="flex flex-col gap-1">
                <p className="eyebrow text-muted-foreground">
                  02 — Riwayat Setoran
                </p>
                <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                  Listing Ampas
                </h2>
              </div>
              <Package className="size-6 shrink-0 text-primary" />
            </div>

            {/* Header tabel — hanya tampil di md+ */}
            <div className="hidden grid-cols-[1fr_1fr_auto_auto] gap-4 px-1 pt-5 pb-3 md:grid">
              <span className="eyebrow text-muted-foreground">Tanggal</span>
              <span className="eyebrow text-muted-foreground">Jenis</span>
              <span className="eyebrow text-right text-muted-foreground">
                Volume
              </span>
              <span className="eyebrow text-right text-muted-foreground">
                Status
              </span>
            </div>

            <ul className="flex flex-col">
              {listingsSorted.map((listing) => {
                const meta = statusMeta[listing.status];
                return (
                  <li
                    key={listing.listingId}
                    className="grid grid-cols-2 items-center gap-x-4 gap-y-1 border-t border-border px-1 py-4 transition-colors hover:bg-surface/60 md:grid-cols-[1fr_1fr_auto_auto]"
                  >
                    <span className="font-mono text-sm text-foreground">
                      {formatTanggal(listing.createdAt)}
                    </span>
                    <span className="text-sm text-foreground">
                      {jenisKopiLabel[listing.jenisKopi] ?? listing.jenisKopi}
                    </span>
                    <span className="text-right font-mono text-sm font-medium text-foreground">
                      {listing.volumeKg} kg
                    </span>
                    <span className="flex justify-end">
                      <Badge variant={meta.variant} className={meta.className}>
                        {meta.label}
                      </Badge>
                    </span>
                  </li>
                );
              })}

              {listingsSorted.length === 0 ? (
                <li className="border-t border-border px-1 py-10 text-center text-sm text-muted-foreground">
                  Belum ada listing. Mulai setor ampas pertamamu.
                </li>
              ) : null}
            </ul>
          </div>

          {/* --- Riwayat Grounds Coin (1/3) --- */}
          <aside className="lg:col-span-1">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
              <div className="flex flex-col gap-1">
                <p className="eyebrow text-muted-foreground">03 — Ledger</p>
                <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                  Grounds Coin
                </h2>
              </div>
              <Coins className="size-6 shrink-0 text-highlight" />
            </div>

            <div className="flex flex-col">
              {coinTxsSorted.map((tx) => {
                const isEarn = tx.type === "earn";
                return (
                  <div
                    key={tx.txId}
                    className="flex items-start gap-3 border-t border-border py-4 first:border-t-0 first:pt-5"
                  >
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
                        isEarn
                          ? "bg-success/15 text-success"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isEarn ? (
                        <ArrowDownLeft className="size-4" />
                      ) : (
                        <ArrowUpRight className="size-4" />
                      )}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-sm leading-snug text-foreground">
                        {tx.description}
                      </p>
                      <span className="eyebrow text-muted-foreground">
                        {isEarn ? "Earn" : "Redeem"} ·{" "}
                        {formatTanggalSingkat(tx.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 font-mono text-sm font-semibold ${
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
                <p className="border-t border-border py-8 text-center text-sm text-muted-foreground">
                  Belum ada transaksi coin.
                </p>
              ) : null}
            </div>

            {/* Saldo — kartu aksen editorial */}
            <div className="mt-6 rounded-2xl border-l-4 border-highlight bg-card p-5 ring-1 ring-foreground/10">
              <span className="eyebrow text-muted-foreground">Saldo Aktif</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                  {numberFmt.format(coinBalance)}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  GRC
                </span>
              </div>
              <p className="font-script mt-2 text-lg text-primary">
                terus tumbuh setiap setoran!
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
