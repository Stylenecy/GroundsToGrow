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
import { HeroHeadline } from "@/components/hero-headline";
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
    title: "Foto & Submit Ampas",
    desc: "Owner kedai foto ampas di akhir shift. WasteScan mencatat jenis kopi, volume kilogram, dan jam sejak seduh. Tiga puluh detik, selesai.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Smart Match Otomatis",
    desc: "Algoritma membaca jenis kopi, jarak ke Hub, dan freshness ampas, lalu mengusulkan UMKM hilirisasi paling cocok. Skor match keluar di layar.",
  },
  {
    icon: PackageCheck,
    step: "03",
    title: "Pickup di Hub Kampus",
    desc: "Kurir partner mengangkut ampas ke Hub. UMKM mengolahnya jadi lulur, briket, atau kompos. Kedai dapat Eco-Badge plus Grounds Coin.",
  },
] as const;

const REVENUE_STREAMS = [
  {
    icon: FlaskConical,
    title: "Subscription UMKM",
    desc: "Tier Starter, Pro, dan Enterprise membayar untuk supply ampas tersortir per grade A/B/C.",
  },
  {
    icon: ShoppingBag,
    title: "Komisi Marketplace",
    desc: "Fee tiap transaksi produk olahan dan biji kopi petani yang laku di etalase.",
  },
  {
    icon: Building2,
    title: "Carbon Credit",
    desc: "Brand sponsor membeli CO2-eq, mengacu harga bursa karbon IDXCarbon sejak 2023, lalu menerima ESG report siap LST OJK.",
  },
  {
    icon: Leaf,
    title: "Eco-Badge & Sertifikasi",
    desc: "Status Verified Circular Source jadi alat branding kedai maupun UMKM.",
  },
  {
    icon: Sprout,
    title: "Kompos & Media Tanam",
    desc: "Ampas mengandung nitrogen sekitar 2 persen. Surplus disalurkan ke komunitas urban farming sebagai kompos siap pakai.",
  },
  {
    icon: Truck,
    title: "Logistik Jam Kosong",
    desc: "Fee pickup mengisi idle capacity driver di jam sepi, jadi armada tetap produktif.",
  },
] as const;

export default function LandingPage() {
  const esg = getGlobalEsg();
  const featured = getFeaturedProducts().slice(0, 4);

  const co2Saved = esg?.co2EqSavedKgTotal ?? 2716.25;
  const coinEarned = esg?.ecoCoinTotalEarned ?? 542100;

  const stats = [
    {
      value: "290rb",
      unit: "ton / tahun",
      label: "Kopi yang diminum Indonesia",
      sub: "Angka konsumsi nasional versi BPS. Tiap cangkir menyisakan ampas.",
      accent: "text-highlight",
    },
    {
      value: "250rb",
      unit: "ton ampas",
      label: "Limbah ampas yang menumpuk",
      sub: "Estimasi 250–300 ribu ton per tahun. Saat TPA Piyungan tutup Maret 2024, sisa organik tak lagi punya tempat.",
      accent: "text-highlight",
    },
    {
      value: formatNumber(co2Saved),
      unit: "kg CO2-eq",
      label: "Emisi yang sudah dihindari",
      sub: "Tercatat lintas ekosistem GroundsToGrow, dihitung audit-ready untuk laporan ESG.",
      accent: "text-accent",
    },
    {
      value: `${entities.length}`,
      unit: "entitas",
      label: "Pelaku dalam satu loop",
      sub: "Empat inti, empat pendukung. Tiap pihak memberi sekaligus menerima nilai.",
      accent: "text-accent",
    },
  ];

  return (
    <>
      {/* ============================================================
          HERO — komposisi gelap berani (bg-ink, disengaja & konsisten
          dengan stat-strip di bawahnya)
          ============================================================ */}
      <section className="relative overflow-hidden bg-ink text-background">
        {/* Cahaya ambient sefamili palette — tinted, bukan hitam polos */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-primary/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 -left-40 size-[30rem] rounded-full bg-accent/18 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 right-1/4 size-[26rem] rounded-full bg-highlight/12 blur-[120px]"
        />
        {/* Angka raksasa di latar — tekstur editorial, bukan section kosong */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 right-2 font-display text-[16rem] leading-none font-bold text-background/[0.035] select-none md:text-[22rem]"
        >
          250k
        </span>

        <div className="relative mx-auto w-full max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
          <div
            className="animate-in fade-in slide-in-from-bottom-2 flex flex-wrap items-center gap-x-4 gap-y-2 fill-mode-both duration-700"
            style={{ animationDelay: "0ms" }}
          >
            <p className="eyebrow text-highlight">
              Digital Disruption · Level 4–6–8
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/15 px-2.5 py-1 font-mono text-[0.6rem] font-medium tracking-widest text-success uppercase">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              Ekosistem hidup
            </span>
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:items-end">
            {/* Headline raksasa — Fraunces variable, animasi wght/opsz */}
            <div>
              <HeroHeadline className="font-display text-[3.5rem] leading-[0.92] font-semibold tracking-[-0.04em] text-background sm:text-7xl md:text-[5.5rem]">
                Ampas kopi
                <br />
                hari ini,{" "}
                <span className="relative inline-block text-primary italic">
                  modal esok.
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-0 h-[4px] w-full rounded-full bg-primary/40"
                  />
                </span>
              </HeroHeadline>

              <p
                className="animate-in fade-in slide-in-from-bottom-2 mt-7 flex items-center gap-2.5 font-mono text-sm tracking-wide text-accent fill-mode-both duration-700"
                style={{ animationDelay: "220ms" }}
              >
                <span aria-hidden className="h-px w-7 bg-accent/50" />
                From Waste to Wealth — From Coffee to Carbon
              </p>

              <p
                className="animate-in fade-in slide-in-from-bottom-2 mt-5 max-w-xl text-base leading-relaxed text-background/70 fill-mode-both duration-700 md:text-lg"
                style={{ animationDelay: "340ms" }}
              >
                Indonesia minum sekitar 290 ribu ton kopi setahun versi BPS.
                Ampasnya, 250 ribu ton, dulu menumpuk di TPA. GroundsToGrow
                menyambungkan kedai kopi, UMKM hilirisasi, konsumen, dan
                korporasi ESG dalam satu loop. Satu kilogram ampas memicu lulur,
                briket, kompos, sampai carbon credit yang terukur.
              </p>

              <div
                className="animate-in fade-in slide-in-from-bottom-2 mt-9 flex flex-col gap-3 fill-mode-both duration-700 sm:flex-row"
                style={{ animationDelay: "460ms" }}
              >
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
                  className="border-background/25 bg-transparent px-5 text-background hover:bg-background/10 hover:text-background"
                  render={<Link href="/marketplace" />}
                  nativeButton={false}
                >
                  Lihat Marketplace
                </Button>
              </div>
            </div>

            {/* Loop diagram — kartu glass dengan inner-border halus, overlap ke atas */}
            <div
              className="animate-in fade-in slide-in-from-bottom-4 relative fill-mode-both duration-700 lg:-mt-10"
              style={{ animationDelay: "560ms" }}
            >
              <div className="rounded-2xl border border-background/12 bg-background/[0.06] p-6 shadow-[inset_0_1px_0_rgba(247,240,227,0.12),0_24px_60px_-30px_var(--color-primary)] ring-1 ring-background/10 backdrop-blur-md transition-shadow hover:shadow-[inset_0_1px_0_rgba(247,240,227,0.16),0_30px_70px_-28px_var(--color-primary)]">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-background/50">The Loop</p>
                  <span className="font-mono text-[0.58rem] tracking-widest text-accent uppercase">
                    Sirkular
                  </span>
                </div>
                <div className="mt-5 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
                      <Coffee className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-background">
                        Ampas kopi
                      </p>
                      <p className="text-xs text-background/55">
                        Sisa akhir shift kedai
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-1">
                    <span className="flex size-10 shrink-0 items-center justify-center">
                      <ArrowDown className="size-4 text-background/40" />
                    </span>
                    <span className="font-mono text-[0.6rem] tracking-widest text-background/45 uppercase">
                      diproses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/25 text-success ring-1 ring-success/35">
                      <Leaf className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-background">
                        Produk + Carbon
                      </p>
                      <p className="text-xs text-background/55">
                        Lulur, briket, CO2-eq
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini metric ledger */}
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-background/12 ring-1 ring-background/12">
                  <div className="bg-ink/40 p-3">
                    <p className="eyebrow text-[0.58rem] text-success">
                      CO2-eq saved
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-background">
                      {formatNumber(co2Saved)}
                      <span className="ml-1 text-xs font-normal text-background/55">
                        kg
                      </span>
                    </p>
                  </div>
                  <div className="bg-ink/40 p-3">
                    <p className="eyebrow text-[0.58rem] text-accent">
                      Grounds Coin
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-background">
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
          STAT STRIP — dark dramatic (B), menyambung hero gelap
          ============================================================ */}
      <section className="border-t border-background/10 bg-ink text-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-highlight">Masalah yang kami lihat</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-background sm:text-4xl">
              Limbah bervolume besar yang sebenarnya{" "}
              <span className="text-highlight italic">kaya nitrogen.</span>
            </h2>
            <p className="mt-3 text-sm text-background/60">
              Empat angka di bawah ini jadi alasan platform ini dibangun. Baca
              pelan-pelan.
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
              Delapan pihak, satu{" "}
              <span className="text-accent italic">konstelasi nilai.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Tiap entitas menyetor sesuatu ke loop dan menarik nilai balik.
              Kedai memberi ampas, menerima Eco-Badge. UMKM memberi produk,
              menerima bahan baku murah. Hapus satu simpul, loop pincang. Itu
              jantung disrupsi GroundsToGrow.
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
              Dari ampas di akhir shift sampai produk jadi, alurnya sengaja
              dibuat sependek mungkin. Owner kedai cukup pegang HP.
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
              Satu kilogram ampas yang sama bisa dibayar UMKM lewat langganan,
              menghasilkan komisi saat produknya laku, lalu dihitung lagi sebagai
              carbon credit. Tiga pendapatan dari satu input.
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
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-[0_40px_80px_-40px_var(--color-primary)] ring-1 ring-inset ring-primary-foreground/10 md:p-14">
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
                Ampas hari ini, jadi{" "}
                <span className="italic">modal esok?</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">
                Buka WasteScan, submit satu batch ampas, dan lihat Smart Match
                memilih UMKM dalam dua detik. Tiga puluh detik untuk paham
                seluruh loop bekerja.
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
