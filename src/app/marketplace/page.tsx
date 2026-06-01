"use client"

import {
  Search,
  MapPin,
  Clock,
  Leaf,
  ShoppingBag,
  BadgeCheck,
  Sprout,
  Coffee,
  Star,
  ArrowUpRight,
} from "lucide-react"
import { toast } from "sonner"

import {
  wasteListings,
  products,
  coffeeBeans,
} from "@/data"
import type {
  WasteListing,
  Product,
  CoffeeBean,
  JenisKopi,
  ProductCategory,
  ProsesKopi,
  ListingStatus,
} from "@/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* ============================================================
   FORMATTERS & LABEL MAPS
   ============================================================ */

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const jenisKopiLabel: Record<JenisKopi, string> = {
  arabika: "Arabika",
  robusta: "Robusta",
  blend: "Blend",
  any: "Campuran",
}

const kategoriLabel: Record<ProductCategory, string> = {
  skincare: "Skincare",
  briket: "Briket",
  kompos: "Kompos",
  pewarna: "Pewarna Alami",
  jamur: "Media Jamur",
  lainnya: "Lainnya",
}

const prosesLabel: Record<ProsesKopi, string> = {
  natural: "Natural Process",
  honey: "Honey Process",
  washed: "Full Washed",
  anaerobic: "Anaerobic",
}

const statusLabel: Record<ListingStatus, string> = {
  open: "Tersedia",
  matched: "Sudah Dipinang",
  in_pickup: "Sedang Dijemput",
  completed: "Selesai",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
}

/* ============================================================
   CARD: AMPAS MENTAH
   ============================================================ */

function AmpasCard({ listing }: { listing: WasteListing }) {
  const available = listing.status === "open"
  const gratis = listing.hargaPerKg === 0

  return (
    <Card className="group/ampas gap-0 rounded-2xl border-l-4 border-l-accent p-0 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={`Ampas kopi ${jenisKopiLabel[listing.jenisKopi]} dari ${listing.coffeeShopName}`}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover/ampas:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="eyebrow rounded-full bg-ink/85 px-2.5 py-1 text-[0.6rem] text-background backdrop-blur-sm before:hidden">
            Ampas Mentah
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant={available ? "default" : "outline"}
            className={
              available
                ? "bg-success text-success-foreground"
                : "bg-card/90 backdrop-blur-sm"
            }
          >
            {statusLabel[listing.status]}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col gap-3 px-5 py-5">
        <div>
          <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
            {jenisKopiLabel[listing.jenisKopi]}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {listing.coffeeShopName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Leaf className="size-3.5 text-success" />
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

        <div className="pt-1">
          {gratis ? (
            <span className="font-mono text-lg font-bold tracking-tight text-success">
              Gratis
              <span className="ml-1 align-baseline text-xs font-normal text-muted-foreground">
                disposal
              </span>
            </span>
          ) : (
            <span className="font-mono text-lg font-bold tracking-tight text-foreground">
              {formatRupiah(listing.hargaPerKg)}
              <span className="ml-1 align-baseline text-xs font-normal text-muted-foreground">
                / kg
              </span>
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="rounded-b-2xl border-t border-border bg-surface/60 px-5 py-4">
        <Button
          className="w-full"
          disabled={!available}
          onClick={() =>
            toast.success("Permintaan pickup terkirim", {
              description: `${jenisKopiLabel[listing.jenisKopi]} ${listing.volumeKg.toFixed(
                1
              )} kg dari ${listing.coffeeShopName}.`,
            })
          }
        >
          {available ? "Ambil" : "Tidak Tersedia"}
          {available ? <ArrowUpRight /> : null}
        </Button>
      </CardFooter>
    </Card>
  )
}

/* ============================================================
   CARD: PRODUK OLAHAN UMKM
   ============================================================ */

function ProductCard({ product }: { product: Product }) {
  const inStock = product.status === "active" && product.stok > 0

  return (
    <Card className="group/prod gap-0 rounded-2xl border-l-4 border-l-primary p-0 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.namaProduk}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover/prod:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-highlight text-foreground">
            {kategoriLabel[product.kategori]}
          </Badge>
        </div>
        {product.hasCertificate ? (
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified Circular
            </Badge>
          </div>
        ) : null}
      </div>

      <CardContent className="flex flex-col gap-2 px-5 py-5">
        <div>
          <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
            {product.namaProduk}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {product.umkmName}
          </p>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-border pt-3">
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {formatRupiah(product.harga)}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Star className="size-3 fill-highlight text-highlight" />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="rounded-b-2xl border-t border-border bg-surface/60 px-5 py-4">
        <Button
          className="w-full"
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
      </CardFooter>
    </Card>
  )
}

/* ============================================================
   CARD: BIJI KOPI PETANI
   ============================================================ */

function BeanCard({ bean }: { bean: CoffeeBean }) {
  return (
    <Card className="group/bean gap-0 rounded-2xl border-l-4 border-l-highlight p-0 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative overflow-hidden">
        <img
          src={bean.imageUrl}
          alt={`Biji kopi dari ${bean.asalKebun}`}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover/bean:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="eyebrow rounded-full bg-ink/85 px-2.5 py-1 text-[0.6rem] text-background backdrop-blur-sm before:hidden">
            {prosesLabel[bean.proses]}
          </span>
        </div>
        {bean.verified ? (
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent text-accent-foreground">
              <BadgeCheck className="size-3" />
              Verified
            </Badge>
          </div>
        ) : null}
      </div>

      <CardContent className="flex flex-col gap-2 px-5 py-5">
        <div>
          <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
            {bean.asalKebun.split(",")[0]}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {bean.petaniName}
          </p>
        </div>

        <p className="text-sm text-muted-foreground capitalize">
          {bean.profileRasa}
        </p>

        <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-border pt-3">
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {formatRupiah(bean.hargaPerKg)}
            <span className="ml-1 align-baseline text-xs font-normal text-muted-foreground">
              / kg
            </span>
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            stok {bean.stokKg} kg
          </span>
        </div>
      </CardContent>

      <CardFooter className="rounded-b-2xl border-t border-border bg-surface/60 px-5 py-4">
        <Button
          className="w-full"
          onClick={() =>
            toast.success("Ditambahkan ke keranjang", {
              description: `Biji ${bean.asalKebun.split(",")[0]} dari ${bean.petaniName}.`,
            })
          }
        >
          <ShoppingBag className="size-4" />
          Beli
        </Button>
      </CardFooter>
    </Card>
  )
}

/* ============================================================
   PAGE
   ============================================================ */

export default function MarketplacePage() {
  const gridClass =
    "grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <>
      {/* ============================================================
          HEADER — editorial marketplace
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        {/* Organic touch (C): blob lengkung halus */}
        <div className="pointer-events-none absolute -top-28 -right-24 size-80 rounded-full bg-highlight/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow">01 — Sirkular Marketplace</p>

          <div className="mt-5 grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
            <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Satu loop, dari{" "}
              <span className="text-primary">ampas</span> sampai{" "}
              <span className="italic text-accent">biji petani.</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:pb-2">
              Telusuri ampas mentah, produk olahan UMKM, hingga green bean petani
              — semua dalam satu ekonomi sirkular kopi ala Jogja, terukur dan
              transparan.
            </p>
          </div>

          {/* Search bar dummy (kosmetik) */}
          <div className="relative mt-9 max-w-2xl">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari ampas, produk olahan, atau green bean petani..."
              className="h-13 rounded-full border-border bg-card pr-28 pl-11 text-base shadow-sm"
              aria-label="Cari di marketplace"
            />
            <Button
              size="lg"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full px-5"
            >
              Cari
            </Button>
          </div>

          {/* Stat strip ringkas (B): mono + ikon lucide */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="inline-flex items-center gap-2">
              <Leaf className="size-4 text-success" />
              <span className="font-mono text-sm font-semibold text-foreground">
                {wasteListings.length}
              </span>
              <span className="text-xs text-muted-foreground">listing ampas</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              <span className="font-mono text-sm font-semibold text-foreground">
                {products.length}
              </span>
              <span className="text-xs text-muted-foreground">produk UMKM</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Coffee className="size-4 text-highlight" />
              <span className="font-mono text-sm font-semibold text-foreground">
                {coffeeBeans.length}
              </span>
              <span className="text-xs text-muted-foreground">green bean</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          KATALOG — tabs
          ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Tabs defaultValue="ampas" className="gap-10">
          <div className="flex flex-col gap-5 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">02 — Katalog</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                Pilih lapis ekosistemnya
              </h2>
            </div>

            <TabsList
              variant="line"
              className="h-auto flex-wrap justify-start gap-x-6 gap-y-2 p-0"
            >
              <TabsTrigger
                value="ampas"
                className="flex-none gap-1.5 px-0 font-display text-base data-active:text-primary"
              >
                <Leaf className="size-4" />
                Ampas Mentah
                <span className="font-mono text-xs text-muted-foreground">
                  {wasteListings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="produk"
                className="flex-none gap-1.5 px-0 font-display text-base data-active:text-primary"
              >
                <ShoppingBag className="size-4" />
                Produk Olahan UMKM
                <span className="font-mono text-xs text-muted-foreground">
                  {products.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="biji"
                className="flex-none gap-1.5 px-0 font-display text-base data-active:text-primary"
              >
                <Sprout className="size-4" />
                Biji Kopi Petani
                <span className="font-mono text-xs text-muted-foreground">
                  {coffeeBeans.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Ampas Mentah */}
          <TabsContent value="ampas">
            <div className={gridClass}>
              {wasteListings.map((listing) => (
                <AmpasCard key={listing.listingId} listing={listing} />
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Produk Olahan UMKM */}
          <TabsContent value="produk">
            <div className={gridClass}>
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Biji Kopi Petani */}
          <TabsContent value="biji">
            <div className={gridClass}>
              {coffeeBeans.map((bean) => (
                <BeanCard key={bean.petaniProductId} bean={bean} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}
