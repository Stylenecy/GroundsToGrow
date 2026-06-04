"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useListings } from "@/context/ListingsContext";
import {
  SparklesIcon,
  CameraIcon,
  ImageIcon,
  CheckCircle2Icon,
  ScaleIcon,
  ClockIcon,
  TargetIcon,
  MapPinIcon,
  Loader2Icon,
  RotateCcwIcon,
  CoffeeIcon,
  ShieldCheckIcon,
  ZapIcon,
  LeafIcon,
  ArrowRightIcon,
} from "lucide-react";

import { smartMatches, umkms } from "@/data";
import type { JenisKopi, MatchStatus, SmartMatch, Umkm } from "@/types";

import { Button } from "@/components/ui/button";
import { HeroHeadline } from "@/components/hero-headline";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ============================================================
   TIPE & KONSTAN LOKAL
   ============================================================ */

type Phase = "idle" | "analyzing" | "result";

interface Classification {
  jenisLabel: string;
  grade: "A" | "B" | "C";
  gradeLabel: string;
  volumeKg: number;
  freshnessJam: number;
  freshnessLabel: string;
  rekomendasi: string;
  rekomendasiAlasan: string;
}

interface DisplayMatch {
  match: SmartMatch;
  umkm: Umkm | undefined;
  status: "accept" | "waiting";
}

const JENIS_OPTIONS: { value: JenisKopi; label: string }[] = [
  { value: "arabika", label: "Arabika" },
  { value: "robusta", label: "Robusta" },
  { value: "blend", label: "Blend" },
];

const ANALYZING_STEPS = [
  { label: "Mendeteksi jenis ampas...", icon: CoffeeIcon },
  { label: "Menghitung volume & freshness...", icon: ScaleIcon },
  { label: "Mencocokkan UMKM terdekat...", icon: MapPinIcon },
] as const;

/* ============================================================
   LOGIKA SIMULASI (derive dari input → terasa "pintar")
   ============================================================ */

function deriveClassification(
  jenis: JenisKopi,
  volumeKg: number,
  freshnessJam: number,
): Classification {
  // Grade dari freshness: makin segar makin tinggi.
  let grade: "A" | "B" | "C";
  let gradeLabel: string;
  if (freshnessJam <= 4) {
    grade = "A";
    gradeLabel = "Grade A · Premium";
  } else if (freshnessJam <= 12) {
    grade = "B";
    gradeLabel = "Grade B · Standar";
  } else {
    grade = "C";
    gradeLabel = "Grade C · Industri";
  }

  let freshnessLabel: string;
  if (freshnessJam <= 2) freshnessLabel = "Optimal — masih lembap";
  else if (freshnessJam <= 6) freshnessLabel = "Baik — layak skincare";
  else if (freshnessJam <= 12) freshnessLabel = "Cukup — cocok kompos";
  else freshnessLabel = "Kering — terbaik untuk briket";

  // Rekomendasi penggunaan: derive dari freshness & volume.
  let rekomendasi: string;
  let rekomendasiAlasan: string;
  if (grade === "A") {
    rekomendasi = "Skincare (pH cocok)";
    rekomendasiAlasan =
      "Ampas masih segar & berminyak — antioksidan tinggi, ideal untuk lulur/scrub kopi.";
  } else if (grade === "B") {
    rekomendasi = volumeKg >= 10 ? "Kompos premium" : "Pewarna alami / kompos";
    rekomendasiAlasan =
      "Freshness sedang — nutrisi tanah masih terjaga, cocok diolah jadi kompos atau pewarna.";
  } else {
    rekomendasi = volumeKg >= 5 ? "Briket bio-energi" : "Media tanam jamur";
    rekomendasiAlasan =
      "Ampas sudah kering — kalori karbon tinggi, paling efisien untuk briket atau media jamur.";
  }

  const jenisLabel =
    JENIS_OPTIONS.find((o) => o.value === jenis)?.label ?? "Arabika";

  return {
    jenisLabel,
    grade,
    gradeLabel,
    volumeKg,
    freshnessJam,
    freshnessLabel,
    rekomendasi,
    rekomendasiAlasan,
  };
}

/**
 * Pilih 3 UMKM "cocok". Untuk arabika/blend → kandidat skincare (lst01),
 * untuk robusta → kandidat industri. Selalu balikkan 3 kartu yang meyakinkan.
 */
function deriveMatches(jenis: JenisKopi, freshnessJam: number): DisplayMatch[] {
  const skincareIds = ["um01-brewskin", "um02-lulur-nusa", "um03-earthly"];
  const industriIds = ["um04-briket-bara", "um05-kompos-hijau", "um06-jamur-tani"];
  const targetIds = jenis === "robusta" ? industriIds : skincareIds;

  return targetIds.map((umkmId, idx) => {
    const umkm = umkms.find((u) => u.profileId === umkmId);
    // cari match yang sudah ada (untuk reasons/score), fallback sintetik.
    const existing = smartMatches.find((m) => m.umkmProfileId === umkmId);
    const baseScore = existing?.score ?? 90 - idx * 9;
    const distanceKm = existing?.distanceKm ?? 1.2 + idx * 1.3;

    // 2 kartu pertama "accept", terakhir "waiting" — sesuai wireframe.
    const status: "accept" | "waiting" = idx < 2 ? "accept" : "waiting";

    const reasons = existing?.reasons ?? [
      `Preferensi jenis kopi cocok: ${jenis}`,
      `Jarak ${distanceKm.toFixed(1)} km (dalam radius layanan)`,
      `Freshness ${freshnessJam} jam diterima`,
    ];

    const match: SmartMatch = existing
      ? { ...existing, distanceKm, status: status === "accept" ? "accepted" : "suggested" }
      : {
          matchId: `synthetic-${umkmId}`,
          listingId: "lst-demo",
          umkmProfileId: umkmId,
          umkmName: umkm?.brandName ?? "UMKM",
          jenisProduk: umkm?.jenisProduk ?? "lainnya",
          score: baseScore,
          distanceKm,
          status: (status === "accept" ? "accepted" : "suggested") as MatchStatus,
          reasons,
          suggestedAt: new Date().toISOString(),
          respondedAt: null,
        };

    return { match, umkm, status };
  });
}

/* ============================================================
   KOMPONEN KECIL
   ============================================================ */

function MetricRow({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-[0.625rem] text-muted-foreground">{label}</p>
        <p
          className={
            "mt-0.5 font-mono text-base font-semibold tracking-tight " +
            (accent ? "text-accent" : "text-foreground")
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function MatchCard({ item, index }: { item: DisplayMatch; index: number }) {
  const { match, umkm, status } = item;
  const isAccept = status === "accept";
  return (
    <div
      className={
        "animate-in fade-in slide-in-from-bottom-4 fill-mode-both group/match relative overflow-hidden rounded-2xl border border-border border-l-4 bg-card p-5 transition-all hover:border-l-accent hover:shadow-md " +
        (isAccept ? "border-l-success" : "border-l-highlight")
      }
      style={{ animationDelay: `${index * 140}ms`, animationDuration: "550ms" }}
    >
      {/* Rank editorial */}
      <span className="absolute top-3 right-4 font-display text-4xl font-semibold text-foreground/5 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={umkm?.imageUrl ?? "https://placehold.co/120x120/008b7c/fbf5ec?text=UMKM"}
            alt={match.umkmName}
            className="size-14 rounded-xl object-cover ring-1 ring-border"
          />
          <span className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full bg-foreground font-mono text-[0.6rem] font-bold text-background ring-2 ring-card">
            {index + 1}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-lg leading-tight font-semibold text-foreground">
              {match.umkmName}
            </p>
            {umkm?.isVerified ? (
              <ShieldCheckIcon className="size-4 shrink-0 text-success" />
            ) : null}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3.5 text-accent" />
              <span className="font-mono">{match.distanceKm.toFixed(1)} km</span>
            </span>
            <span className="capitalize">{match.jenisProduk}</span>
            <span className="capitalize">· {umkm?.subscriptionTier ?? "starter"}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-tight text-accent">
              <span className="font-mono">{match.score}</span>
              <span className="ml-0.5 align-baseline text-sm font-medium text-muted-foreground">
                % match
              </span>
            </span>
          </div>
          {isAccept ? (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle2Icon className="size-3" />
              Accept
            </Badge>
          ) : (
            <Badge variant="outline" className="border-highlight/50 text-muted-foreground">
              <Loader2Icon className="size-3 animate-spin" />
              Menunggu
            </Badge>
          )}
        </div>
        {/* Bar skor — visual match strength */}
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
            style={{ width: `${match.score}%` }}
          />
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {match.reasons.slice(0, 2).map((r) => (
          <li
            key={r}
            className="flex items-start gap-1.5 text-xs text-muted-foreground"
          >
            <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-accent" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   HALAMAN
   ============================================================ */

export default function WasteScanPage() {
  // form state
  const [photoShown, setPhotoShown] = useState(false);
  const [jenis, setJenis] = useState<JenisKopi>("arabika");
  const [volume, setVolume] = useState<number>(2.5);
  const [freshness, setFreshness] = useState<number>(2);

  // flow state
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // result
  const [classification, setClassification] = useState<Classification | null>(
    null,
  );
  const [matches, setMatches] = useState<DisplayMatch[]>([]);
  
  const { addListing } = useListings();
  const router = useRouter();

  const samplePhoto =
    "https://placehold.co/600x400/6B3A2A/F5ECD7?text=Foto+Ampas+Kopi";

  const handleAnalyze = useCallback(() => {
    setPhase("analyzing");
    setStepIndex(0);
    setProgress(8);

    // Tahap 1
    const t1 = setTimeout(() => {
      setStepIndex(1);
      setProgress(42);
    }, 600);
    // Tahap 2
    const t2 = setTimeout(() => {
      setStepIndex(2);
      setProgress(78);
    }, 1200);
    // Selesai (~1.8s)
    const t3 = setTimeout(() => {
      setProgress(100);
      const result = deriveClassification(jenis, volume, freshness);
      const derivedMatches = deriveMatches(jenis, freshness);
      setClassification(result);
      setMatches(derivedMatches);
      setPhase("result");
      toast.success("Analisis selesai · 3 UMKM cocok ditemukan", {
        description: `${result.jenisLabel} · ${result.gradeLabel} · ${result.volumeKg} kg`,
      });
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [jenis, volume, freshness]);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setClassification(null);
    setMatches([]);
    setProgress(0);
    setStepIndex(0);
    setPhotoShown(false);
    setJenis("arabika");
    setVolume(2.5);
    setFreshness(2);
  }, []);

  const handlePublish = () => {
    const newListing = {
      listingId: `lst-mock-${Math.floor(Math.random() * 1000)}`,
      coffeeShopProfileId: "cs01-kopi-sudut",
      coffeeShopName: "Kopi Sudut",
      jenisKopi: jenis,
      volumeKg: volume,
      freshnessJam: freshness,
      hargaPerKg: freshness <= 4 ? 2000 : freshness <= 12 ? 1000 : 0,
      imageUrl: samplePhoto,
      status: "open" as const,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    addListing(newListing);
    toast.success("Ampas Berhasil Diterbitkan!", {
      description: "Listing ampas kopi Anda sekarang tayang di Marketplace.",
    });
    router.push("/dashboard");
  };

  const ActiveStepIcon = ANALYZING_STEPS[stepIndex].icon;

  const avgDistance = useMemo(() => {
    if (matches.length === 0) return 0;
    return matches.reduce((s, m) => s + m.match.distanceKm, 0) / matches.length;
  }, [matches]);

  return (
    <>
      {/* ===== INTRO BANNER ===== */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        {/* Organic blobs (C) */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-highlight/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-accent">01 — WasteScan AI Demo</p>
              <HeroHeadline className="mt-5 font-display text-[2.75rem] leading-[1.02] font-bold tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
                Submit ampas kopi dalam{" "}
                <span className="relative inline-block text-primary italic">
                  30 detik
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/30"
                  />
                </span>
                .
              </HeroHeadline>
              <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                Foto ampas di akhir shift. AI menilai grade A, B, atau C dari
                freshness, lalu mencocokkannya dengan UMKM hilirisasi terdekat.
                Tidak ada yang berakhir di TPA.
              </p>

              {/* Trust chips */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {[
                  { icon: ZapIcon, label: "Hasil < 2 detik" },
                  { icon: TargetIcon, label: "3 UMKM cocok" },
                  { icon: ShieldCheckIcon, label: "Audit-ready ESG" },
                ].map((chip) => {
                  const ChipIcon = chip.icon;
                  return (
                    <span
                      key={chip.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      <ChipIcon className="size-3.5 text-accent" />
                      {chip.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_1px_0_var(--color-border),0_12px_28px_-20px_var(--color-foreground)] ring-1 ring-foreground/5">
              <div className="relative">
                <img
                  src="https://placehold.co/80x80/6B3A2A/FBF5EC?text=Rina"
                  alt="Mbak Rina"
                  className="size-11 rounded-full object-cover ring-1 ring-border"
                />
                <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-success ring-2 ring-card">
                  <CheckCircle2Icon className="size-2.5 text-success-foreground" />
                </span>
              </div>
              <div className="leading-tight">
                <p className="eyebrow text-[0.625rem] text-muted-foreground">
                  Demo persona
                </p>
                <p className="mt-0.5 font-display text-base font-semibold text-foreground">
                  Mbak Rina
                </p>
                <p className="text-xs text-muted-foreground">
                  Owner · Kopi Sudut, Sleman
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KONTEN UTAMA: FORM + HASIL ===== */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          {/* ---------- PANEL INPUT ---------- */}
          <Card className="self-start rounded-2xl shadow-[0_1px_0_var(--color-border),0_18px_44px_-28px_var(--color-foreground)]">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-primary">02 — Detail batch</p>
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                  02
                </span>
              </div>
              <CardTitle className="mt-3 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
                <CoffeeIcon className="size-5 text-primary" />
                Detail Ampas
              </CardTitle>
              <CardDescription>
                Isi data batch ampas kopimu — AI akan menilai kualitasnya.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-7 pt-2">
              {/* Upload foto (dropzone palsu) */}
              <div className="flex flex-col gap-2.5">
                <Label className="eyebrow text-muted-foreground">
                  Foto Ampas · opsional
                </Label>
                <button
                  type="button"
                  onClick={() => setPhotoShown(true)}
                  disabled={phase === "analyzing"}
                  className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface/60 text-center transition-colors hover:border-accent hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60"
                >
                  {photoShown ? (
                    <>
                      <img
                        src={samplePhoto}
                        alt="Pratinjau ampas kopi"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute right-2 bottom-2">
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle2Icon className="size-3" />
                          Foto siap
                        </Badge>
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-6 text-muted-foreground">
                      <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-hover:scale-105">
                        <CameraIcon className="size-6" />
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        Klik untuk unggah foto ampas
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <ImageIcon className="size-3.5" />
                        JPG/PNG · maks 5MB · demo memakai contoh
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {/* Jenis kopi */}
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="jenis-trigger" className="eyebrow text-muted-foreground">
                  Jenis Kopi
                </Label>
                <Select
                  value={jenis}
                  onValueChange={(v) => setJenis(v as JenisKopi)}
                  disabled={phase === "analyzing"}
                >
                  <SelectTrigger id="jenis-trigger" className="h-11 w-full">
                    <SelectValue placeholder="Pilih jenis kopi" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Volume */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-end justify-between">
                  <Label htmlFor="volume-slider" className="eyebrow text-muted-foreground">
                    Volume Ampas
                  </Label>
                  <span className="font-mono text-2xl font-bold leading-none tracking-tight text-accent">
                    {volume.toFixed(1)}
                    <span className="ml-1 align-baseline text-xs font-medium text-muted-foreground">
                      kg
                    </span>
                  </span>
                </div>
                <Slider
                  id="volume-slider"
                  min={0.1}
                  max={50}
                  step={0.1}
                  value={[volume]}
                  onValueChange={(v) =>
                    setVolume(Array.isArray(v) ? v[0] : v)
                  }
                  disabled={phase === "analyzing"}
                />
                <div className="flex justify-between font-mono text-[0.6875rem] text-muted-foreground">
                  <span>0.1 kg</span>
                  <span>50 kg</span>
                </div>
              </div>

              {/* Freshness */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-end justify-between">
                  <Label htmlFor="fresh-slider" className="eyebrow text-muted-foreground">
                    Freshness · jam sejak seduh
                  </Label>
                  <span className="font-mono text-2xl font-bold leading-none tracking-tight text-accent">
                    {freshness}
                    <span className="ml-1 align-baseline text-xs font-medium text-muted-foreground">
                      jam
                    </span>
                  </span>
                </div>
                <Slider
                  id="fresh-slider"
                  min={0}
                  max={24}
                  step={1}
                  value={[freshness]}
                  onValueChange={(v) =>
                    setFreshness(Array.isArray(v) ? v[0] : v)
                  }
                  disabled={phase === "analyzing"}
                />
                <div className="flex justify-between font-mono text-[0.6875rem] text-muted-foreground">
                  <span>0 jam (baru)</span>
                  <span>24 jam</span>
                </div>
              </div>

              <Separator />

              {/* CTA */}
              {phase === "result" ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="h-12 flex-1 rounded-xl text-base"
                  >
                    <RotateCcwIcon className="size-4" />
                    Reset
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePublish}
                    className="h-12 flex-[2] rounded-xl text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                  >
                    <SparklesIcon className="size-4 mr-2" />
                    Terbitkan ke Marketplace
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={phase === "analyzing"}
                  className="group h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  {phase === "analyzing" ? (
                    <>
                      <Loader2Icon className="size-5 animate-spin" />
                      Menganalisa...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-5" />
                      Analisa dengan AI
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              )}

              <p className="flex items-center justify-center gap-1.5 rounded-lg bg-highlight/8 px-3 py-2 text-center text-xs text-muted-foreground">
                <ZapIcon className="size-3 shrink-0 text-highlight" />
                Demo: hasil disimulasikan dari input. Real AI Vision ada di
                roadmap.
              </p>
            </CardContent>
          </Card>

          {/* ---------- PANEL HASIL ---------- */}
          <div className="flex flex-col gap-6">
            {/* IDLE: empty state */}
            {phase === "idle" ? (
              <Card className="relative flex min-h-[28rem] items-center justify-center self-stretch overflow-hidden rounded-2xl border-dashed">
                <div className="pointer-events-none absolute -right-16 -bottom-20 size-56 rounded-full bg-accent/10 blur-3xl" />
                <div className="relative flex max-w-xs flex-col items-center gap-5 px-6 py-12 text-center">
                  <span className="relative flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-pulse rounded-2xl bg-accent/10"
                    />
                    <ZapIcon className="relative size-8" />
                  </span>
                  <div>
                    <p className="eyebrow text-muted-foreground">Standby</p>
                    <p className="mt-2 font-display text-xl font-semibold text-foreground">
                      Menunggu analisa
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Isi detail ampas di kiri lalu tekan{" "}
                      <span className="font-medium text-foreground">
                        Analisa dengan AI
                      </span>{" "}
                      untuk melihat klasifikasi & UMKM yang cocok.
                    </p>
                  </div>
                  {/* Skeleton hint — bentuk hasil yang akan muncul */}
                  <div className="mt-1 w-full space-y-2.5 opacity-60">
                    <div className="flex items-center gap-2.5">
                      <span className="size-9 shrink-0 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <span className="block h-2.5 w-2/3 rounded bg-muted" />
                        <span className="block h-2 w-1/3 rounded bg-muted/70" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="size-9 shrink-0 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <span className="block h-2.5 w-1/2 rounded bg-muted" />
                        <span className="block h-2 w-2/5 rounded bg-muted/70" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* ANALYZING: loading meyakinkan */}
            {phase === "analyzing" ? (
              <Card className="relative self-stretch overflow-hidden rounded-2xl bg-ink text-background">
                <div className="pointer-events-none absolute -top-20 -left-16 size-56 rounded-full bg-accent/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-16 size-56 rounded-full bg-highlight/15 blur-3xl" />
                <CardContent className="relative flex min-h-[28rem] flex-col items-center justify-center gap-7 py-12">
                  <div className="relative flex size-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
                    <span className="relative flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <ActiveStepIcon className="size-8 animate-pulse" />
                    </span>
                  </div>

                  <div className="w-full max-w-sm space-y-5">
                    <div className="text-center">
                      <p className="eyebrow text-accent">Memproses</p>
                      <p
                        key={stepIndex}
                        className="animate-in fade-in slide-in-from-bottom-1 mt-2 font-display text-xl font-semibold text-background"
                      >
                        {ANALYZING_STEPS[stepIndex].label}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <span className="font-mono text-4xl font-bold tracking-tight text-background">
                        {progress}
                        <span className="text-base font-medium text-background/50">%</span>
                      </span>
                      <span className="eyebrow text-background/50">analyzing</span>
                    </div>
                    <Progress value={progress} className="[&_[data-slot=progress-track]]:bg-background/15 [&_[data-slot=progress-indicator]]:bg-accent" />

                    <ul className="space-y-2.5 border-t border-background/10 pt-4">
                      {ANALYZING_STEPS.map((step, i) => {
                        const done = i < stepIndex;
                        const active = i === stepIndex;
                        return (
                          <li
                            key={step.label}
                            className={
                              "flex items-center gap-2.5 text-sm transition-colors " +
                              (done
                                ? "text-success"
                                : active
                                  ? "text-background"
                                  : "text-background/35")
                            }
                          >
                            {done ? (
                              <CheckCircle2Icon className="size-4 shrink-0" />
                            ) : active ? (
                              <Loader2Icon className="size-4 shrink-0 animate-spin text-accent" />
                            ) : (
                              <span className="size-4 shrink-0 rounded-full border border-current" />
                            )}
                            {step.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* RESULT */}
            {phase === "result" && classification ? (
              <>
                {/* Kartu klasifikasi */}
                <Card className="animate-in fade-in slide-in-from-bottom-3 self-stretch rounded-2xl border-l-4 border-l-accent ring-accent/20">
                  <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="eyebrow text-accent">03 — Hasil klasifikasi</p>
                        <CardTitle className="mt-2 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
                          <CheckCircle2Icon className="size-5 text-success" />
                          Klasifikasi AI
                        </CardTitle>
                      </div>
                      <Badge
                        className={
                          "shrink-0 " +
                          (classification.grade === "A"
                            ? "bg-success text-success-foreground"
                            : classification.grade === "B"
                              ? "bg-highlight text-highlight-foreground"
                              : "bg-primary text-primary-foreground")
                        }
                      >
                        {classification.gradeLabel}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      Hasil estimasi otomatis dari foto & data batch.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid gap-x-6 sm:grid-cols-2">
                      <div className="divide-y divide-border sm:border-r sm:border-border sm:pr-6">
                        <MetricRow
                          icon={CoffeeIcon}
                          label="Jenis kopi"
                          value={classification.jenisLabel}
                        />
                        <MetricRow
                          icon={ScaleIcon}
                          label="Volume estimasi"
                          value={`${classification.volumeKg.toFixed(1)} kg`}
                          accent
                        />
                      </div>
                      <div className="divide-y divide-border">
                        <MetricRow
                          icon={ClockIcon}
                          label="Freshness"
                          value={`${classification.freshnessJam} jam`}
                        />
                        <MetricRow
                          icon={ShieldCheckIcon}
                          label="Kondisi"
                          value={classification.grade}
                          accent
                        />
                      </div>
                    </div>

                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <LeafIcon className="size-3.5 text-success" />
                      {classification.freshnessLabel}
                    </p>

                    {/* Rekomendasi penggunaan */}
                    <div className="relative mt-5 overflow-hidden rounded-xl border border-accent/20 bg-accent/8 p-5">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -top-10 -right-8 size-32 rounded-full bg-accent/10 blur-2xl"
                      />
                      <div className="relative flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                          <TargetIcon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="eyebrow text-accent">
                            Rekomendasi penggunaan
                          </p>
                          <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-accent">
                            {classification.rekomendasi}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {classification.rekomendasiAlasan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SMART MATCH */}
                <div className="animate-in fade-in slide-in-from-bottom-3 space-y-4">
                  <div className="flex items-end justify-between border-t border-border pt-5">
                    <div>
                      <p className="eyebrow text-primary">04 — Smart Match</p>
                      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                        UMKM yang cocok
                      </h2>
                    </div>
                    <div className="flex items-stretch gap-px overflow-hidden rounded-xl border border-border bg-border text-center">
                      <div className="bg-card px-3.5 py-2">
                        <p className="font-mono text-lg font-bold leading-none text-foreground">
                          {matches.length}
                        </p>
                        <p className="mt-1 text-[0.625rem] tracking-wide text-muted-foreground">
                          UMKM
                        </p>
                      </div>
                      <div className="bg-card px-3.5 py-2">
                        <p className="font-mono text-lg font-bold leading-none text-accent">
                          {avgDistance.toFixed(1)}
                        </p>
                        <p className="mt-1 text-[0.625rem] tracking-wide text-muted-foreground">
                          km rata2
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {matches.map((item, i) => (
                      <MatchCard key={item.match.matchId} item={item} index={i} />
                    ))}
                  </div>

                  {/* Insight card */}
                  <div className="animate-in fade-in flex items-start gap-3 rounded-2xl border border-border border-l-4 border-l-highlight bg-surface p-5">
                    <SparklesIcon className="mt-0.5 size-4 shrink-0 text-highlight" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Insight:</span>{" "}
                      Match diprioritaskan dari kecocokan jenis kopi, jarak
                      pickup, dan freshness — partner Pro mendapat prioritas
                      notifikasi.
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Footer jujur (mock disclaimer) */}
        <div className="mt-16 border-t border-border pt-8">
          <p className="font-script text-center text-xl text-primary/70">
            dibangun dengan jujur — ini prototipe, bukan sulap.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-muted-foreground">
            Catatan demo: WasteScan ini adalah prototipe UI — hasil klasifikasi &
            matching disimulasikan dari input. Integrasi AI Vision dan algoritma
            matching real ada di roadmap produk.
          </p>
        </div>
      </section>
    </>
  );
}
