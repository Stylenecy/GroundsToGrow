"use client"

import { Search, MapPin, Clock, Leaf, ShoppingBag, BadgeCheck } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
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
    <Card className="transition-shadow hover:shadow-md">
      <img
        src={listing.imageUrl}
        alt={`Ampas kopi ${jenisKopiLabel[listing.jenisKopi]} dari ${listing.coffeeShopName}`}
        className="aspect-[4/3] w-full object-cover"
      />
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-base leading-snug font-semibold text-foreground">
              {jenisKopiLabel[listing.jenisKopi]}
            </span>
            <span className="text-sm text-muted-foreground">
              {listing.coffeeShopName}
            </span>
          </div>
          <Badge
            variant={available ? "secondary" : "outline"}
            className={
              available
                ? "bg-success text-success-foreground"
                : undefined
            }
          >
            {statusLabel[listing.status]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Leaf className="size-3.5 text-primary" />
            <span className="font-mono text-foreground">
              {listing.volumeKg.toFixed(1)} kg
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            <span className="font-mono">{listing.freshnessJam} jam</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            Jogja
          </span>
        </div>

        <div>
          {gratis ? (
            <span className="font-mono text-base font-semibold text-success">
              Gratis (disposal)
            </span>
          ) : (
            <span className="font-mono text-base font-semibold text-foreground">
              {formatRupiah(listing.hargaPerKg)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / kg
              </span>
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
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
    <Card className="transition-shadow hover:shadow-md">
      <img
        src={product.imageUrl}
        alt={product.namaProduk}
        className="aspect-square w-full object-cover"
      />
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{kategoriLabel[product.kategori]}</Badge>
          {product.hasCertificate ? (
            <Badge className="bg-success text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified Circular
            </Badge>
          ) : null}
        </div>

        <span className="font-display text-base leading-snug font-semibold text-foreground">
          {product.namaProduk}
        </span>
        <span className="text-sm text-muted-foreground">{product.umkmName}</span>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">
            {formatRupiah(product.harga)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
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
    <Card className="transition-shadow hover:shadow-md">
      <img
        src={bean.imageUrl}
        alt={`Biji kopi dari ${bean.asalKebun}`}
        className="aspect-[4/3] w-full object-cover"
      />
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-base leading-snug font-semibold text-foreground">
              {bean.asalKebun.split(",")[0]}
            </span>
            <span className="text-sm text-muted-foreground">
              {bean.petaniName} · {prosesLabel[bean.proses]}
            </span>
          </div>
          {bean.verified ? (
            <Badge className="bg-success text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground capitalize">
          {bean.profileRasa}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">
            {formatRupiah(bean.hargaPerKg)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / kg
            </span>
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            stok {bean.stokKg} kg
          </span>
        </div>
      </CardContent>
      <CardFooter>
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
  return (
    <>
      {/* Header marketplace */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit">
              <Leaf className="size-3" />
              Ekosistem Sirkular Kopi
            </Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Marketplace GroundsToGrow
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Dari ampas mentah, produk olahan UMKM, sampai biji kopi petani —
              semua dalam satu loop ekonomi sirkular ala Jogja.
            </p>
          </div>

          {/* Search bar dummy (kosmetik) */}
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari ampas, produk, atau biji kopi..."
              className="h-11 pl-9"
              aria-label="Cari di marketplace"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <Tabs defaultValue="ampas" className="gap-8">
          <TabsList className="h-auto w-full max-w-xl flex-wrap justify-start gap-1 bg-muted p-1 md:h-10">
            <TabsTrigger value="ampas" className="px-4 py-2">
              Ampas Mentah ({wasteListings.length})
            </TabsTrigger>
            <TabsTrigger value="produk" className="px-4 py-2">
              Produk Olahan UMKM ({products.length})
            </TabsTrigger>
            <TabsTrigger value="biji" className="px-4 py-2">
              Biji Kopi Petani ({coffeeBeans.length})
            </TabsTrigger>
          </TabsList>

          <Separator />

          {/* Tab 1: Ampas Mentah */}
          <TabsContent value="ampas">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {wasteListings.map((listing) => (
                <AmpasCard key={listing.listingId} listing={listing} />
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Produk Olahan UMKM */}
          <TabsContent value="produk">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Biji Kopi Petani */}
          <TabsContent value="biji">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
