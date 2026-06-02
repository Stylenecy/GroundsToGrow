import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Recycle,
  Cpu,
  PackageCheck,
  ShoppingBag,
  FlaskConical,
  Leaf,
  Building2,
  Sprout,
  Truck,
  Coffee,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
      accent: "text-highlight",
    },
    {
      value: formatNumber(kgDiverted),
      unit: "kg",
      label: "Ampas dialihkan dari TPA",
      sub: "Total tervalidasi lintas ekosistem GroundsToGrow.",
      accent: "text-accent",
    },
    {
      value: formatNumber(co2Saved),
      unit: "kg CO2-eq",
      label: "Emisi karbon dihindari",
      sub: "Setara ratusan pohon — terukur & audit-ready.",
      accent: "text-accent",
    },
    {
      value: `${entities.length}`,
      unit: "entitas",
      label: "Pelaku dalam value constellation",
      sub: "4 core + 4 supporting, saling beri & terima nilai.",
      accent: "text-highlight",
    },
  ];

  return (
    <>
      {/* ============================================================
          HERO — editorial berani
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* Aksen organik halus (C) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/8 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-accent/8 blur-3xl"
        />

        <div className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="eyebrow text-primary">
              Digital Disruption · Level 4–6–8
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 font-mono text-[0.6rem] font-medium tracking-widest text-success uppercase">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              Ekosistem hidup
            </span>
          </div>

          <div className="mt-7 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            {/* Headline raksasa */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
              <h1 className="font-display text-[3.25rem] leading-[0.95] font-semibold tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl">
                Ubah ampas kopi
                <br />
                jadi{" "}
                <span className="relative inline-block italic text-primary">
                  ekosistem bernilai.
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/25"
                  />
                </span>
              </h1>

              <p className="mt-6 flex items-center gap-2.5 font-mono text-sm tracking-wide text-accent">
                <span aria-hidden className="h-px w-7 bg-accent/40" />
                From Waste to Wealth — From Coffee to Carbon
              </p>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                GroundsToGrow menghubungkan kedai kopi, UMKM hilirisasi,
                konsumen, dan korporasi ESG dalam satu platform sirkular. Limbah
                harian jadi skincare, briket, kompos, hingga carbon credit —
                semua terukur.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="group px-5"
                  render={<Link href="/wastescan" />}
                  nativeButton={false}
                >
                  Coba WasteScan Demo
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
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

            {/* Loop diagram editorial Coffee → Carbon */}
            <div className="animate-in fade-in slide-in-from-bottom-4 relative duration-700">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_0_var(--color-border),0_12px_32px_-18px_var(--color-foreground)] ring-1 ring-foreground/5 transition-shadow hover:shadow-[0_1px_0_var(--color-border),0_18px_44px_-20px_var(--color-foreground)]">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-muted-foreground">The Loop</p>
                  <span className="font-mono text-[0.58rem] tracking-widest text-accent uppercase">
                    Sirkular
                  </span>
                </div>
                <div className="mt-5 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
                      <Coffee className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        Ampas kopi
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Limbah harian kedai
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-1">
                    <span className="flex size-10 shrink-0 items-center justify-center">
                      <ArrowDown className="size-4 text-muted-foreground/50" />
                    </span>
                    <span className="font-mono text-[0.6rem] tracking-widest text-muted-foreground/60 uppercase">
                      diproses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success ring-1 ring-success/25">
                      <Leaf className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        Produk + Carbon
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Skincare, briket, CO2-eq
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini metric ledger */}
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border ring-1 ring-border">
                  <div className="bg-card p-3">
                    <p className="eyebrow text-[0.58rem] text-success">
                      CO2-eq saved
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-foreground">
                      {formatNumber(co2Saved)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        kg
                      </span>
                    </p>
                  </div>
                  <div className="bg-card p-3">
                    <p className="eyebrow text-[0.58rem] text-accent">
                      Grounds Coin
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-foreground">
                      {formatNumber(coinEarned)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STAT STRIP — dark dramatic (B)
          ============================================================ */}
      <section className="bg-ink text-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-highlight">Masalah yang kami lihat</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-background sm:text-4xl">
              Ampas kopi adalah limbah bervolume besar yang{" "}
              <span className="italic text-highlight">kaya nilai.</span>
            </h2>
            <p className="mt-3 text-sm text-background/60">
              Angka di bawah ini brutal — dan jadi alasan platform ini ada.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-background/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="group/stat relative bg-ink p-6 transition-colors hover:bg-background/[0.04]"
              >
                <span className="font-mono text-[0.6rem] tracking-widest text-background/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className={`mt-2 font-mono text-4xl font-bold tracking-tight sm:text-5xl ${stat.accent} transition-transform group-hover/stat:-translate-y-0.5`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-xs tracking-wide text-background/50">
                  {stat.unit}
                </p>
                <p className="mt-4 text-sm font-semibold text-background">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-background/55">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          01 — VALUE CONSTELLATION
          ============================================================ */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow text-primary">01 — Value Constellation</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Bukan rantai linear, tapi{" "}
              <span className="italic text-accent">konstelasi nilai.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Setiap entitas memberi sesuatu ke ekosistem dan mendapat nilai
              balik. Inilah jantung disrupsi GroundsToGrow — delapan pihak,
              satu loop.
            </p>
          </div>

          <EntityConstellation />
        </div>
      </section>

      {/* ============================================================
          02 — CARA KERJA (Submit → Match → Pickup)
          ============================================================ */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-primary">02 — Cara Kerja</p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Tiga langkah, dari ampas{" "}
                <span className="italic text-primary">jadi nilai.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Dari ampas di akhir shift sampai produk bernilai — alurnya
              disengaja sesederhana mungkin.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.step}
                  className="group relative flex flex-col gap-5 bg-card p-7 transition-colors hover:bg-card/60"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-translate-y-0.5 group-hover:rotate-3">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-display text-5xl font-bold leading-none text-foreground/[0.07] transition-colors group-hover:text-primary/15">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          03 — REVENUE / VALUE
          ============================================================ */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow text-primary">03 — Revenue &amp; Value</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Enam aliran nilai,{" "}
              <span className="italic text-accent">satu loop.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <span className="font-medium text-foreground">
                Limbah → resource → wealth.
              </span>{" "}
              Setiap kilogram ampas memicu beberapa monetisasi sekaligus,
              membuat ekosistem makin kuat tiap transaksi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-3">
            {REVENUE_STREAMS.map((stream, i) => {
              const Icon = stream.icon;
              return (
                <article
                  key={stream.title}
                  className="group flex items-start gap-4 bg-card p-6 transition-colors hover:bg-card/60"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/25 transition-transform group-hover:-translate-y-0.5 group-hover:ring-accent/40">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[0.62rem] tracking-widest text-muted-foreground/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {stream.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {stream.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Featured products — bukti produk nyata dari loop */}
          {featured.length > 0 && (
            <div className="mt-16">
              <div className="mb-6 flex items-end justify-between gap-4 border-t border-border pt-6">
                <div>
                  <p className="eyebrow text-success">Bukti Loop</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                    Produk dari ampas
                  </h3>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 text-primary"
                  render={<Link href="/marketplace" />}
                  nativeButton={false}
                >
                  Lihat semua
                  <ArrowUpRight />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {featured.map((product) => (
                  <Link
                    key={product.productId}
                    href="/marketplace"
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_14px_30px_-20px_var(--color-foreground)]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.namaProduk}
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1 p-4">
                      <p className="truncate font-display text-sm font-semibold text-foreground">
                        {product.namaProduk}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.umkmName}
                      </p>
                      <p className="mt-1 font-mono text-sm font-bold text-primary">
                        Rp {formatNumber(product.harga)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          CTA PENUTUP
          ============================================================ */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-highlight/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-accent/30 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <p className="eyebrow text-primary-foreground/70">
                Mulai sekarang
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Siap ubah ampas kopimu jadi{" "}
                <span className="italic">kekayaan ekosistem?</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">
                Coba demo WasteScan — submit ampas, lihat Smart Match jalan, dan
                rasakan bagaimana satu kilogram limbah memicu seluruh konstelasi
                nilai.
              </p>
              <div className="mt-8">
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
