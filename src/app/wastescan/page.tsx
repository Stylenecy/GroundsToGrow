"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
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
} from "lucide-react";

import { smartMatches, umkms } from "@/data";
import type { JenisKopi, MatchStatus, SmartMatch, Umkm } from "@/types";

import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 text-accent" />
        {label}
      </span>
      <span
        className={
          "font-mono text-sm font-medium " +
          (accent ? "text-accent" : "text-foreground")
        }
      >
        {value}
      </span>
    </div>
  );
}

function MatchCard({ item, index }: { item: DisplayMatch; index: number }) {
  const { match, umkm, status } = item;
  const isAccept = status === "accept";
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${index * 140}ms`, animationDuration: "500ms" }}
    >
      <div className="flex items-start gap-3">
        <img
          src={umkm?.imageUrl ?? "https://placehold.co/120x120/008b7c/fbf5ec?text=UMKM"}
          alt={match.umkmName}
          className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-display text-base font-medium text-foreground">
              {match.umkmName}
            </p>
            {umkm?.isVerified ? (
              <ShieldCheckIcon className="size-4 shrink-0 text-success" />
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3.5" />
              <span className="font-mono">{match.distanceKm.toFixed(1)} km</span>
            </span>
            <span className="capitalize">{match.jenisProduk}</span>
            <span className="capitalize">· {umkm?.subscriptionTier ?? "starter"}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Match score</span>
          <Badge className="bg-highlight text-highlight-foreground">
            <span className="font-mono">{match.score}%</span>
          </Badge>
        </div>
        {isAccept ? (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2Icon className="size-3" />
            Accept
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            <Loader2Icon className="size-3 animate-spin" />
            Waiting
          </Badge>
        )}
      </div>

      <ul className="mt-3 space-y-1">
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

  const ActiveStepIcon = ANALYZING_STEPS[stepIndex].icon;

  const avgDistance = useMemo(() => {
    if (matches.length === 0) return 0;
    return matches.reduce((s, m) => s + m.match.distanceKm, 0) / matches.length;
  }, [matches]);

  return (
    <>
      {/* ===== INTRO BANNER ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-3 bg-accent text-accent-foreground">
                <SparklesIcon className="size-3" />
                WasteScan AI
              </Badge>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Submit ampas kopi dalam{" "}
                <span className="text-accent">30 detik</span>.
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Foto ampasmu, AI klasifikasikan grade-nya, lalu cocokkan otomatis
                dengan UMKM hilirisasi terdekat. Tanpa repot, tanpa terbuang.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <img
                src="https://placehold.co/80x80/6B3A2A/FBF5EC?text=Rina"
                alt="Mbak Rina"
                className="size-10 rounded-full object-cover ring-1 ring-border"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">Mbak Rina</p>
                <p className="text-muted-foreground">Owner · Kopi Sudut, Sleman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KONTEN UTAMA: FORM + HASIL ===== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ---------- PANEL INPUT ---------- */}
          <Card className="self-start">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Detail Ampas
              </CardTitle>
              <CardDescription>
                Isi data batch ampas kopimu — AI akan menilai kualitasnya.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Upload foto (dropzone palsu) */}
              <div className="flex flex-col gap-2">
                <Label>Foto Ampas (opsional)</Label>
                <button
                  type="button"
                  onClick={() => setPhotoShown(true)}
                  disabled={phase === "analyzing"}
                  className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface/60 text-center transition-colors hover:border-accent hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60"
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="jenis-trigger">Jenis Kopi</Label>
                <Select
                  value={jenis}
                  onValueChange={(v) => setJenis(v as JenisKopi)}
                  disabled={phase === "analyzing"}
                >
                  <SelectTrigger id="jenis-trigger" className="w-full">
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume-slider">Volume Ampas</Label>
                  <span className="font-mono text-sm font-medium text-accent">
                    {volume.toFixed(1)} kg
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
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-mono">0.1 kg</span>
                  <span className="font-mono">50 kg</span>
                </div>
              </div>

              {/* Freshness */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fresh-slider">Freshness (jam sejak seduh)</Label>
                  <span className="font-mono text-sm font-medium text-accent">
                    {freshness} jam
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
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-mono">0 jam (baru)</span>
                  <span className="font-mono">24 jam</span>
                </div>
              </div>

              <Separator />

              {/* CTA */}
              {phase === "result" ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="h-12 w-full text-base"
                >
                  <RotateCcwIcon className="size-4" />
                  Scan lagi
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={phase === "analyzing"}
                  className="h-12 w-full bg-highlight text-base font-semibold text-highlight-foreground hover:bg-highlight/90"
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
                    </>
                  )}
                </Button>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Demo: hasil disimulasikan dari input. Real AI Vision ada di
                roadmap.
              </p>
            </CardContent>
          </Card>

          {/* ---------- PANEL HASIL ---------- */}
          <div className="flex flex-col gap-6">
            {/* IDLE: empty state */}
            {phase === "idle" ? (
              <Card className="flex min-h-[28rem] items-center justify-center self-stretch border-dashed">
                <div className="flex max-w-xs flex-col items-center gap-4 px-6 py-12 text-center">
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <ZapIcon className="size-8" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-medium text-foreground">
                      Menunggu analisa
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Isi detail ampas di kiri lalu tekan{" "}
                      <span className="font-medium text-foreground">
                        Analisa dengan AI
                      </span>{" "}
                      untuk melihat klasifikasi & UMKM yang cocok.
                    </p>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* ANALYZING: loading meyakinkan */}
            {phase === "analyzing" ? (
              <Card className="self-stretch">
                <CardContent className="flex min-h-[28rem] flex-col items-center justify-center gap-6 py-12">
                  <div className="relative flex size-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
                    <span className="relative flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <ActiveStepIcon className="size-8 animate-pulse" />
                    </span>
                  </div>

                  <div className="w-full max-w-sm space-y-4">
                    <p
                      key={stepIndex}
                      className="animate-in fade-in slide-in-from-bottom-1 text-center font-display text-lg font-medium text-foreground"
                    >
                      {ANALYZING_STEPS[stepIndex].label}
                    </p>
                    <Progress value={progress} />
                    <p className="text-center font-mono text-xs text-muted-foreground">
                      {progress}% · memproses
                    </p>

                    <ul className="space-y-2 pt-2">
                      {ANALYZING_STEPS.map((step, i) => {
                        const done = i < stepIndex;
                        const active = i === stepIndex;
                        return (
                          <li
                            key={step.label}
                            className={
                              "flex items-center gap-2 text-sm transition-colors " +
                              (done
                                ? "text-success"
                                : active
                                  ? "text-foreground"
                                  : "text-muted-foreground/50")
                            }
                          >
                            {done ? (
                              <CheckCircle2Icon className="size-4" />
                            ) : active ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <span className="size-4 rounded-full border border-current" />
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
                <Card className="animate-in fade-in slide-in-from-bottom-3 self-stretch border-accent/30">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 font-display text-lg">
                        <CheckCircle2Icon className="size-5 text-success" />
                        Klasifikasi AI
                      </CardTitle>
                      <Badge className="bg-highlight text-highlight-foreground">
                        {classification.gradeLabel}
                      </Badge>
                    </div>
                    <CardDescription>
                      Hasil estimasi otomatis dari foto & data batch.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-x-6 sm:grid-cols-2">
                      <div className="sm:border-r sm:border-border sm:pr-6">
                        <MetricRow
                          icon={CoffeeIcon}
                          label="Jenis kopi"
                          value={classification.jenisLabel}
                        />
                        <Separator />
                        <MetricRow
                          icon={ScaleIcon}
                          label="Volume estimasi"
                          value={`${classification.volumeKg.toFixed(1)} kg`}
                          accent
                        />
                      </div>
                      <div>
                        <MetricRow
                          icon={ClockIcon}
                          label="Freshness"
                          value={`${classification.freshnessJam} jam`}
                        />
                        <Separator />
                        <MetricRow
                          icon={ShieldCheckIcon}
                          label="Kondisi"
                          value={classification.grade}
                          accent
                        />
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {classification.freshnessLabel}
                    </p>

                    {/* Rekomendasi penggunaan */}
                    <div className="mt-4 rounded-xl bg-accent/10 p-4">
                      <div className="flex items-center gap-2">
                        <TargetIcon className="size-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">
                          Rekomendasi penggunaan
                        </span>
                      </div>
                      <p className="mt-2 font-display text-xl font-semibold text-accent">
                        {classification.rekomendasi}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {classification.rekomendasiAlasan}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* SMART MATCH */}
                <div className="animate-in fade-in slide-in-from-bottom-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-medium text-foreground">
                      Smart Match
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      3 UMKM · rata-rata{" "}
                      <span className="font-mono text-foreground">
                        {avgDistance.toFixed(1)} km
                      </span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matches.map((item, i) => (
                      <MatchCard key={item.match.matchId} item={item} index={i} />
                    ))}
                  </div>

                  {/* Insight card */}
                  <div className="animate-in fade-in flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
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
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Catatan demo: WasteScan ini adalah prototipe UI — hasil klasifikasi &
          matching disimulasikan dari input. Integrasi AI Vision dan algoritma
          matching real ada di roadmap produk.
        </p>
      </section>
    </>
  );
}
