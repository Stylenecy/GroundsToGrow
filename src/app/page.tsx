import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Recycle,
  Cpu,
  PackageCheck,
  ShoppingBag,
  FlaskConical,
  Leaf,
  Building2,
  Sprout,
  Coins,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EntityConstellation } from "@/components/entity-constellation";
import { getGlobalEsg, getFeaturedProducts, entities } from "@/data";

/** Format angka besar dengan pemisah ribuan ala Indonesia. */
function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    value
  );
}

const STEPS = [
  {
    icon: Recycle,
    step: "01",
    title: "Submit Ampas",
    desc: "Owner kedai foto & submit ampas kopi lewat WasteScan — jenis, volume, dan kesegaran tercatat dalam 30 detik.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Smart Match",
    desc: "Algoritma matching memetakan ampas ke UMKM hilirisasi terdekat berdasar jenis kopi, jarak Hub, dan kesegaran.",
  },
  {
    icon: PackageCheck,
    step: "03",
    title: "Pickup di Hub",
    desc: "Kurir partner antar ampas ke Hub kampus. UMKM ambil, olah jadi produk, kedai dapat Eco-Badge & Grounds Coin.",
  },
] as const;

const REVENUE_STREAMS = [
  {
    icon: FlaskConical,
    title: "Subscription UMKM",
    desc: "Tier Starter–Pro–Enterprise untuk supply ampas tersortir.",
  },
  {
    icon: ShoppingBag,
    title: "Komisi Marketplace",
    desc: "Fee tiap transaksi produk olahan & biji kopi petani.",
  },
  {
    icon: Building2,
    title: "Carbon Credit",
    desc: "Brand sponsor beli CO2-eq, dapat ESG report siap LST OJK.",
  },
  {
    icon: Leaf,
    title: "Eco-Badge & Sertifikasi",
    desc: "Verified Circular Source jadi alat branding kedai & UMKM.",
  },
  {
    icon: Sprout,
    title: "Kompos & Media Tanam",
    desc: "Surplus ampas jadi demand komunitas urban farming.",
  },
  {
    icon: Truck,
    title: "Logistik Idle Capacity",
    desc: "Fee pickup dari driver memanfaatkan jam kosong.",
  },
] as const;

export default function LandingPage() {
  const esg = getGlobalEsg();
  const featured = getFeaturedProducts().slice(0, 4);

  const kgDiverted = esg?.kgDivertedTotal ?? 5432.5;
  const co2Saved = esg?.co2EqSavedKgTotal ?? 2716.25;
  const coinEarned = esg?.ecoCoinTotalEarned ?? 542100;

  const stats = [
    {
      value: "95Jt",
      unit: "kg / tahun",
      label: "Ampas kopi terbuang di Indonesia",
      sub: "Mayoritas berakhir di TPA sebagai limbah organik.",
    },
    {
      value: formatNumber(kgDiverted),
      unit: "kg",
      label: "Ampas dialihkan dari TPA",
      sub: "Total tervalidasi lintas ekosistem GroundsToGrow.",
    },
    {
      value: formatNumber(co2Saved),
      unit: "kg CO2-eq",
      label: "Emisi karbon dihindari",
      sub: "Setara menanam ratusan pohon — terukur & audit-ready.",
    },
    {
      value: `${entities.length}`,
      unit: "entitas",
      label: "Pelaku dalam value constellation",
      sub: "4 core + 4 supporting, saling beri & terima nilai.",
    },
  ];

  return (
    <>
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <Badge
              variant="outline"
              className="border-accent/40 bg-card text-xs text-muted-foreground"
            >
              <Sparkles className="text-accent" />
              Digital Disruption · Level 4–6–8 · 8-Entity Value Constellation
            </Badge>

            <p className="text-sm font-medium tracking-wide text-accent-foreground">
              <span className="rounded-md bg-accent/20 px-2 py-1 text-accent-foreground">
                From Waste to Wealth — From Coffee to Carbon
              </span>
            </p>

            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Ubah ampas kopi jadi{" "}
              <span className="text-primary">ekosistem bernilai.</span>
            </h1>

            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              GroundsToGrow menghubungkan kedai kopi, UMKM hilirisasi, konsumen,
              dan korporasi ESG dalam satu platform sirkular. Limbah harian jadi
              skincare, briket, kompos, hingga carbon credit — semua terukur.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="px-5"
                render={<Link href="/wastescan" />}
                nativeButton={false}
              >
                Coba WasteScan Demo
                <ArrowRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-5"
                render={<Link href="/marketplace" />}
                nativeButton={false}
              >
                Lihat Marketplace
              </Button>
            </div>
          </div>

          {/* Hero visual: bean → network nodes */}
          <div className="relative">
            <Card className="gap-0 p-0 ring-foreground/10">
              <img
                src="https://placehold.co/600x420/F5ECD7/6B3A2A?text=Coffee+%E2%86%92+Carbon"
                alt="Ilustrasi ampas kopi berubah menjadi jaringan ekosistem"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </Card>
            <Card className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 flex-row items-center justify-between gap-3 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-success text-success-foreground">
                  <Leaf className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs text-muted-foreground">CO2-eq saved</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {formatNumber(co2Saved)} kg
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Coins className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs text-muted-foreground">Grounds Coin</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {formatNumber(coinEarned)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. STAT STRIP
          ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Masalah yang kami lihat
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ampas kopi adalah limbah bervolume besar yang sebenarnya kaya nilai.
            Angka di bawah ini brutal — dan jadi alasan platform ini ada.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="gap-3 p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.value}
                <span className="ml-1 align-baseline text-sm font-medium text-muted-foreground">
                  {stat.unit}
                </span>
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ============================================================
          3. VALUE CONSTELLATION
          ============================================================ */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-8 max-w-2xl">
            <Badge className="mb-3 bg-primary text-primary-foreground">
              Multi-sided Platform
            </Badge>
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              8-Entity Value Constellation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bukan rantai linear, tapi konstelasi nilai: setiap entitas memberi
              sesuatu ke ekosistem dan mendapat nilai balik. Inilah jantung
              disrupsi GroundsToGrow.
            </p>
          </div>

          <EntityConstellation />
        </div>
      </section>

      {/* ============================================================
          4. CARA KERJA
          ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Cara kerja, 3 langkah
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Dari ampas di akhir shift sampai produk bernilai — alurnya
            disengaja sesederhana mungkin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.step}
                className="relative gap-4 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-3xl font-bold text-accent/60">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-2.5 top-1/2 hidden size-5 -translate-y-1/2 text-border md:block" />
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          5. REVENUE / VALUE TEASER
          ============================================================ */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-8 max-w-2xl">
            <Badge variant="outline" className="mb-3">
              Value Creation
            </Badge>
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Enam aliran nilai, satu loop
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Limbah → resource → wealth.
              </span>{" "}
              Setiap kilogram ampas memicu beberapa monetisasi sekaligus,
              membuat ekosistem makin kuat tiap transaksi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REVENUE_STREAMS.map((stream) => {
              const Icon = stream.icon;
              return (
                <Card
                  key={stream.title}
                  className="flex-row items-start gap-3 p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                      {stream.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {stream.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Featured products preview — bukti produk nyata dari loop */}
          {featured.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Produk dari loop
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0"
                  render={<Link href="/marketplace" />}
                  nativeButton={false}
                >
                  Lihat semua
                  <ArrowRight />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {featured.map((product) => (
                  <Card key={product.productId} className="gap-0 p-0">
                    <img
                      src={product.imageUrl}
                      alt={product.namaProduk}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-col gap-1 p-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {product.namaProduk}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.umkmName}
                      </p>
                      <p className="font-mono text-sm font-semibold text-primary">
                        Rp {formatNumber(product.harga)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          6. CTA PENUTUP
          ============================================================ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <Card className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative flex flex-col items-start gap-5 p-8 md:p-12">
            <h2 className="font-display max-w-2xl text-2xl font-semibold sm:text-3xl md:text-4xl">
              Siap ubah ampas kopimu jadi kekayaan ekosistem?
            </h2>
            <p className="max-w-xl text-sm text-primary-foreground/80 md:text-base">
              Coba demo WasteScan — submit ampas, lihat Smart Match jalan, dan
              rasakan bagaimana satu kilogram limbah memicu seluruh konstelasi
              nilai.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="px-5"
              render={<Link href="/wastescan" />}
              nativeButton={false}
            >
              Coba WasteScan Demo Sekarang
              <ArrowRight />
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}
