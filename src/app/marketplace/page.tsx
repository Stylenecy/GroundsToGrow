"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Leaf,
  ShoppingBag,
  BadgeCheck,
  Sprout,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

import { wasteListings, products, coffeeBeans } from "@/data";
import type {
  WasteListing,
  Product,
  CoffeeBean,
  JenisKopi,
  ProductCategory,
  ProsesKopi,
  ListingStatus,
} from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ============================================================
   FORMATTERS & LABEL MAPS
   ============================================================ */

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const jenisKopiLabel: Record<JenisKopi, string> = {
  arabika: "Arabika",
  robusta: "Robusta",
  blend: "Blend",
  any: "Campuran",
};

const kategoriLabel: Record<ProductCategory, string> = {
  skincare: "Skincare",
  briket: "Briket",
  kompos: "Kompos",
  pewarna: "Pewarna Alami",
  jamur: "Media Jamur",
  lainnya: "Lainnya",
};

const prosesLabel: Record<ProsesKopi, string> = {
  natural: "Natural Process",
  honey: "Honey Process",
  washed: "Full Washed",
  anaerobic: "Anaerobic",
};

const statusLabel: Record<ListingStatus, string> = {
  open: "Tersedia",
  matched: "Sudah Dipinang",
  in_pickup: "Sedang Dijemput",
  completed: "Selesai",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
};

/* ============================================================
   FLOATING SOURCE TAG (ide Pallet-Ross: bubble @username)
   ============================================================ */

function SourceTag({
  name,
  dotClass,
}: {
  name: string;
  dotClass: string;
}) {
  return (
    <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink/90 px-3 py-1.5 text-xs font-medium text-background shadow-lg backdrop-blur-sm">
      <span className={cn("size-2 rounded-full", dotClass)} />
      {name}
    </span>
  );
}

/* ============================================================
   CARD SHELL — kartu premium, rounded besar, shadow saat hover
   ============================================================ */

function CardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(42,24,16,0.35)]",
        className
      )}
    >
      {children}
    </article>
  );
}

function CardMedia({
  src,
  alt,
  aspect,
  topRight,
  sourceTag,
}: {
  src: string;
  alt: string;
  aspect: string;
  topRight?: React.ReactNode;
  sourceTag?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.06]",
          aspect
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
      {topRight ? <div className="absolute top-3 right-3">{topRight}</div> : null}
      {sourceTag}
    </div>
  );
}

/* ============================================================
   CARD: AMPAS MENTAH
   ============================================================ */

function AmpasCard({ listing }: { listing: WasteListing }) {
  const available = listing.status === "open";
  const gratis = listing.hargaPerKg === 0;

  return (
    <CardShell>
      <CardMedia
        src={listing.imageUrl}
        alt={`Ampas kopi ${jenisKopiLabel[listing.jenisKopi]} dari ${listing.coffeeShopName}`}
        aspect="aspect-[4/3]"
        sourceTag={<SourceTag name={listing.coffeeShopName} dotClass="bg-accent" />}
        topRight={
          <Badge
            className={
              available
                ? "bg-success text-success-foreground"
                : "bg-card/90 text-foreground backdrop-blur-sm"
            }
          >
            {statusLabel[listing.status]}
          </Badge>
        }
      />

      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
            Ampas {jenisKopiLabel[listing.jenisKopi]}
          </h3>
          <Leaf className="mt-1 size-4 shrink-0 text-success" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono text-foreground">
              {listing.volumeKg.toFixed(1)} kg
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-accent" />
            <span className="font-mono">{listing.freshnessJam} jam</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            Jogja
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          {gratis ? (
            <span className="font-mono text-lg font-bold tracking-tight text-success">
              Gratis
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                disposal
              </span>
            </span>
          ) : (
            <span className="font-mono text-lg font-bold tracking-tight text-foreground">
              {formatRupiah(listing.hargaPerKg)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                /kg
              </span>
            </span>
          )}
          <Button
            size="sm"
            className="rounded-full"
            disabled={!available}
            onClick={() =>
              toast.success("Permintaan pickup terkirim", {
                description: `Ampas ${jenisKopiLabel[listing.jenisKopi]} ${listing.volumeKg.toFixed(1)} kg — ${listing.coffeeShopName}.`,
              })
            }
          >
            {available ? "Ambil" : "Habis"}
            {available ? <ArrowUpRight className="size-4" /> : null}
          </Button>
        </div>
      </div>
    </CardShell>
  );
}

/* ============================================================
   CARD: PRODUK OLAHAN UMKM
   ============================================================ */

function ProductCard({ product }: { product: Product }) {
  const inStock = product.status === "active" && product.stok > 0;

  return (
    <CardShell>
      <CardMedia
        src={product.imageUrl}
        alt={product.namaProduk}
        aspect="aspect-square"
        sourceTag={<SourceTag name={product.umkmName} dotClass="bg-primary" />}
        topRight={
          product.hasCertificate ? (
            <Badge className="bg-success text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified
            </Badge>
          ) : (
            <Badge className="bg-highlight text-foreground">
              {kategoriLabel[product.kategori]}
            </Badge>
          )
        }
      />

      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow before:hidden">{kategoriLabel[product.kategori]}</span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Star className="size-3 fill-highlight text-highlight" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
          {product.namaProduk}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {formatRupiah(product.harga)}
          </span>
          <Button
            size="sm"
            className="rounded-full"
            disabled={!inStock}
            onClick={() =>
              toast.success("Ditambahkan ke keranjang", {
                description: `${product.namaProduk} — ${formatRupiah(product.harga)}.`,
              })
            }
          >
            <ShoppingBag className="size-4" />
            {inStock ? "Beli" : "Stok Habis"}
          </Button>
        </div>
      </div>
    </CardShell>
  );
}

/* ============================================================
   CARD: BIJI KOPI PETANI
   ============================================================ */

function BeanCard({ bean }: { bean: CoffeeBean }) {
  return (
    <CardShell>
      <CardMedia
        src={bean.imageUrl}
        alt={`Biji kopi dari ${bean.asalKebun}`}
        aspect="aspect-[4/3]"
        sourceTag={<SourceTag name={bean.petaniName} dotClass="bg-highlight" />}
        topRight={
          bean.verified ? (
            <Badge className="bg-accent text-accent-foreground">
              <BadgeCheck className="size-3" />
              Verified
            </Badge>
          ) : null
        }
      />

      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <span className="eyebrow before:hidden">{prosesLabel[bean.proses]}</span>
        <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
          {bean.asalKebun.split(",")[0]}
        </h3>
        <p className="text-sm text-muted-foreground capitalize">{bean.profileRasa}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {formatRupiah(bean.hargaPerKg)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/kg</span>
          </span>
          <Button
            size="sm"
            className="rounded-full"
            onClick={() =>
              toast.success("Ditambahkan ke keranjang", {
                description: `Biji ${bean.asalKebun.split(",")[0]} — ${bean.petaniName}.`,
              })
            }
          >
            <ShoppingBag className="size-4" />
            Beli
          </Button>
        </div>
      </div>
    </CardShell>
  );
}

/* ============================================================
   SEGMENTED TABS (custom useState — bulletproof, full styling)
   ============================================================ */

type TabKey = "ampas" | "produk" | "biji";

const TABS: { key: TabKey; label: string; icon: typeof Leaf; count: number }[] = [
  { key: "ampas", label: "Ampas Mentah", icon: Leaf, count: wasteListings.length },
  { key: "produk", label: "Produk Olahan", icon: ShoppingBag, count: products.length },
  { key: "biji", label: "Biji Kopi Petani", icon: Sprout, count: coffeeBeans.length },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function MarketplacePage() {
  const [active, setActive] = useState<TabKey>("ampas");

  const grid =
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {/* HEADER — editorial + blur blobs (Pallet-Ross flavor) */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute -top-28 -right-24 size-80 rounded-full bg-highlight/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-accent/12 blur-3xl" />
        <div className="pointer-events-none absolute top-10 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow">01 — Sirkular Marketplace</p>

          <div className="mt-5 grid items-end gap-8 lg:grid-cols-[1.55fr_1fr]">
            <h1 className="font-display text-4xl leading-[1.04] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.4rem]">
              Satu loop, dari <span className="text-primary">ampas</span>
              <br className="hidden sm:block" /> sampai{" "}
              <span className="italic text-accent">biji petani.</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:pb-2">
              Telusuri ampas mentah, produk olahan UMKM, hingga green bean petani —
              satu ekonomi sirkular kopi ala Jogja, terukur dan transparan.
            </p>
          </div>

          {/* Search dummy (kosmetik) */}
          <div className="relative mt-9 max-w-2xl">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-[1.1rem] -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari ampas, produk olahan, atau green bean petani..."
              className="h-13 rounded-full border-border bg-card pr-24 pl-11 text-base shadow-sm"
              aria-label="Cari di marketplace"
            />
            <Button className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full px-5">
              Cari
            </Button>
          </div>

          {/* Stat strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            {TABS.map((t) => (
              <div key={t.key} className="inline-flex items-center gap-2">
                <t.icon className="size-4 text-primary" />
                <span className="font-mono text-sm font-semibold text-foreground">
                  {t.count}
                </span>
                <span className="text-xs text-muted-foreground">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATALOG */}
      <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">02 — Katalog</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Pilih lapis ekosistemnya
            </h2>
          </div>

          {/* Segmented control */}
          <div className="inline-flex w-full flex-wrap gap-1.5 rounded-full border border-border bg-card p-1.5 md:w-auto">
            {TABS.map((t) => {
              const on = active === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  aria-pressed={on}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all md:flex-none",
                    on
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  )}
                >
                  <t.icon className="size-4" />
                  {t.label}
                  <span
                    className={cn(
                      "font-mono text-xs",
                      on ? "text-primary-foreground/80" : "text-muted-foreground/70"
                    )}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid — conditional, animasi masuk per ganti tab */}
        <div
          key={active}
          className="mt-10 animate-in fade-in slide-in-from-bottom-3 duration-500"
        >
          {active === "ampas" && (
            <div className={grid}>
              {wasteListings.map((l) => (
                <AmpasCard key={l.listingId} listing={l} />
              ))}
            </div>
          )}
          {active === "produk" && (
            <div className={grid}>
              {products.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>
          )}
          {active === "biji" && (
            <div className={grid}>
              {coffeeBeans.map((b) => (
                <BeanCard key={b.petaniProductId} bean={b} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
