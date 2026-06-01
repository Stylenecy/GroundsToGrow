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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  const listings = getListingsByShop(shop.profileId);
  const coinTxs = getCoinTxsByShop(shop.profileId);

  // Metric values — pakai ESG kalau ada, fallback derive dari profil/listing.
  const esgScore = esg?.ecoScore ?? shop.currentEsgScore;
  const coinBalance = shop.ecoCoinBalance;
  const kgDiverted = esg?.kgDivertedTotal ?? shop.totalKgDiverted;
  const co2Saved =
    esg?.co2EqSavedKgTotal ?? shop.totalCo2EqSaved ?? kgDiverted * 0.5;

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

  const metrics = [
    {
      key: "esg",
      icon: TrendingUp,
      label: "ESG Score",
      value: `${esgScore}`,
      unit: "/100",
      caption: esgPredikat(esgScore),
      progress: esgScore,
    },
    {
      key: "coin",
      icon: Coins,
      label: "Grounds Coin",
      value: numberFmt.format(coinBalance),
      unit: "GRC",
      caption: `${esg?.ecoCoinTotalEarned ? numberFmt.format(esg.ecoCoinTotalEarned) : numberFmt.format(coinBalance)} total earned`,
    },
    {
      key: "co2",
      icon: Leaf,
      label: "Carbon Saved",
      value: numberFmt.format(co2Saved),
      unit: "kg CO₂-eq",
      caption: "Setara emisi yang dicegah",
    },
    {
      key: "ampas",
      icon: Recycle,
      label: "Total Ampas",
      value: numberFmt.format(kgDiverted),
      unit: "kg disposed",
      caption: `${shop.totalListings} listing sepanjang waktu`,
    },
  ] as const;

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        {/* ============================================================ */}
        {/* 1. HEADER                                                    */}
        {/* ============================================================ */}
        <header className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-16">
              <AvatarImage src={shop.imageUrl} alt={shop.kedaiName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                  {shop.kedaiName}
                </h1>
                <Badge className="gap-1 bg-success text-success-foreground">
                  <BadgeCheck className="size-3" />
                  Verified Eco Partner
                </Badge>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                {shop.alamat}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              render={<Link href="/marketplace" />}
              nativeButton={false}
            >
              Lihat Marketplace
            </Button>
            <Button
              className="gap-1.5 bg-highlight text-highlight-foreground hover:bg-highlight/90"
              render={<Link href="/waste-scan" />}
              nativeButton={false}
            >
              <PlusCircle className="size-4" />
              Submit Ampas Baru
            </Button>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 2. METRIC CARDS                                              */}
        {/* ============================================================ */}
        <section className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <Card key={m.key} className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {m.label}
                      </CardDescription>
                      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="size-4" />
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                        {m.value}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {m.unit}
                      </span>
                    </div>

                    {"progress" in m && m.progress !== undefined ? (
                      <Progress value={m.progress} className="mt-1" />
                    ) : null}

                    <p className="text-xs text-muted-foreground">{m.caption}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {globalEsg ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Kontribusi ke ekosistem global:{" "}
              <span className="font-mono text-foreground">
                {numberFmt.format(globalEsg.kgDivertedTotal)} kg
              </span>{" "}
              ampas dialihkan dari TPA oleh seluruh mitra GroundsToGrow.
            </p>
          ) : null}
        </section>

        {/* ============================================================ */}
        {/* 3 & 4. RIWAYAT LISTING + GROUNDS COIN                        */}
        {/* ============================================================ */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* --- Riwayat Listing (2/3) --- */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-display text-lg">
                    Riwayat Listing Ampas
                  </CardTitle>
                  <CardDescription>
                    Setoran ampas kopi dari {shop.kedaiName}
                  </CardDescription>
                </div>
                <Package className="size-5 shrink-0 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Header tabel — hanya tampil di md+ */}
              <div className="hidden grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase md:grid">
                <span>Tanggal</span>
                <span>Jenis</span>
                <span className="text-right">Volume</span>
                <span className="text-right">Status</span>
              </div>

              <Separator className="hidden md:block" />

              <ul className="flex flex-col">
                {listingsSorted.map((listing, idx) => {
                  const meta = statusMeta[listing.status];
                  return (
                    <li
                      key={listing.listingId}
                      className={`grid grid-cols-2 items-center gap-x-4 gap-y-1 px-4 py-3 md:grid-cols-[1fr_1fr_auto_auto] ${
                        idx > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <span className="font-mono text-sm text-foreground">
                        {formatTanggal(listing.createdAt)}
                      </span>
                      <span className="text-sm text-foreground">
                        {jenisKopiLabel[listing.jenisKopi] ??
                          listing.jenisKopi}
                      </span>
                      <span className="text-right font-mono text-sm text-foreground">
                        {listing.volumeKg} kg
                      </span>
                      <span className="flex justify-end">
                        <Badge
                          variant={meta.variant}
                          className={meta.className}
                        >
                          {meta.label}
                        </Badge>
                      </span>
                    </li>
                  );
                })}

                {listingsSorted.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Belum ada listing. Mulai setor ampas pertamamu.
                  </li>
                ) : null}
              </ul>
            </CardContent>
          </Card>

          {/* --- Riwayat Grounds Coin (1/3) --- */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-display text-lg">
                    Grounds Coin
                  </CardTitle>
                  <CardDescription>Ledger earn &amp; redeem</CardDescription>
                </div>
                <Coins className="size-5 shrink-0 text-highlight" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {coinTxsSorted.map((tx) => {
                const isEarn = tx.type === "earn";
                return (
                  <div
                    key={tx.txId}
                    className="flex items-start gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <span
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
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
                      <span className="font-mono text-xs text-muted-foreground">
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
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Belum ada transaksi coin.
                </p>
              ) : null}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Saldo saat ini
                </span>
                <span className="font-mono text-base font-semibold text-foreground">
                  {numberFmt.format(coinBalance)} GRC
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
