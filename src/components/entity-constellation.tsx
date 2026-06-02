"use client";

import {
  Coffee,
  FlaskConical,
  ShoppingBag,
  Building2,
  GraduationCap,
  Landmark,
  Sprout,
  Truck,
  Leaf,
  ArrowUpRight,
  ArrowDownLeft,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getCoreEntities, getSupportingEntities } from "@/data";
import type { Entity } from "@/types";

/** Map nama icon (string di data) → komponen lucide. */
const ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  FlaskConical,
  ShoppingBag,
  Building2,
  GraduationCap,
  Landmark,
  Sprout,
  Truck,
};

function EntityRow({
  entity,
  ordinal,
  index,
}: {
  entity: Entity;
  ordinal: string;
  index: number;
}) {
  const Icon = ICON_MAP[entity.icon] ?? Leaf;
  const isCore = entity.tier === "core";

  return (
    <article
      style={{ animationDelay: `${index * 80}ms`, animationDuration: "560ms" }}
      className={cn(
        "animate-in fade-in slide-in-from-bottom-3 fill-mode-both group relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 bg-card p-5 transition-colors duration-300 hover:bg-card/50",
        "border-l-2",
        isCore ? "border-l-accent" : "border-l-highlight"
      )}
    >
      {/* Ordinal mono + ikon */}
      <div className="flex flex-col items-center gap-2">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3",
            isCore
              ? "bg-accent/12 text-accent ring-1 ring-accent/25 group-hover:ring-accent/45"
              : "bg-highlight/15 text-highlight ring-1 ring-highlight/30 group-hover:ring-highlight/50"
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span
          className={cn(
            "font-mono text-[0.62rem] font-medium tracking-widest transition-colors",
            isCore
              ? "text-accent/60 group-hover:text-accent"
              : "text-highlight/70 group-hover:text-highlight"
          )}
        >
          {ordinal}
        </span>
      </div>

      {/* Nama + role */}
      <div className="min-w-0">
        <h4 className="font-display text-lg leading-tight font-semibold text-foreground">
          {entity.name}
        </h4>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {entity.role}
        </p>
      </div>

      {/* Gives / Gets — span penuh, ala ledger */}
      <dl className="col-span-2 space-y-2 border-t border-border pt-3 text-xs">
        <div className="flex items-start gap-2">
          <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded bg-primary/10">
            <ArrowUpRight className="size-3 text-primary" />
          </span>
          <div className="min-w-0">
            <dt className="eyebrow mb-0.5 text-[0.55rem] text-primary">
              Kasih
            </dt>
            <dd className="leading-snug text-muted-foreground">
              {entity.gives}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded bg-success/10">
            <ArrowDownLeft className="size-3 text-success" />
          </span>
          <div className="min-w-0">
            <dt className="eyebrow mb-0.5 text-[0.55rem] text-success">
              Dapat
            </dt>
            <dd className="leading-snug text-muted-foreground">
              {entity.gets}
            </dd>
          </div>
        </div>
      </dl>
    </article>
  );
}

export function EntityConstellation() {
  const coreEntities = getCoreEntities();
  const supportingEntities = getSupportingEntities();

  return (
    <div className="relative">
      {/* Blob organik halus latar (C) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl"
      />

      {/* Orchestrator di tengah */}
      <div className="mx-auto mb-12 flex max-w-xl flex-col items-center text-center">
        <span className="group relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15">
          <span
            aria-hidden
            className="absolute inset-0 animate-pulse rounded-2xl bg-primary/20 blur-md"
          />
          <Leaf className="relative size-8" strokeWidth={1.75} />
          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-accent font-mono text-[0.55rem] font-bold text-accent-foreground ring-2 ring-card">
            8
          </span>
        </span>
        <p className="eyebrow mt-4 text-accent">Platform Orchestrator</p>
        <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
          Grounds<span className="italic text-accent">To</span>Grow
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Satu platform menengahi <span className="font-mono">8</span> entitas.
          Tiap pihak{" "}
          <span className="font-medium text-foreground">memberi & menerima</span>{" "}
          nilai di loop yang sama, jadi setiap transaksi memperkuat yang lain.
        </p>
        {/* Konektor turun ke grid */}
        <span
          aria-hidden
          className="mt-6 h-8 w-px bg-gradient-to-b from-border to-transparent"
        />
      </div>

      {/* CORE 4 */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
          <p className="eyebrow text-accent">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-accent"
            />
            Core — 4 Pelaku Langsung
          </p>
          <span className="text-xs text-muted-foreground">
            Inti rantai nilai ampas
          </span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
          {coreEntities.map((entity, i) => (
            <EntityRow
              key={entity.id}
              entity={entity}
              ordinal={`C${i + 1}`}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* SUPPORTING 4 */}
      <div className="mt-10 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
          <p className="eyebrow text-highlight">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-highlight"
            />
            Supporting — 4 Enabler
          </p>
          <span className="text-xs text-muted-foreground">
            Jaringan & legitimasi ekosistem
          </span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
          {supportingEntities.map((entity, i) => (
            <EntityRow
              key={entity.id}
              entity={entity}
              ordinal={`S${i + 1}`}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
