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
}: {
  entity: Entity;
  ordinal: string;
}) {
  const Icon = ICON_MAP[entity.icon] ?? Leaf;
  const isCore = entity.tier === "core";

  return (
    <article
      className={cn(
        "group relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 bg-card p-5 transition-colors",
        "border-l-2",
        isCore ? "border-l-accent" : "border-l-highlight"
      )}
    >
      {/* Ordinal mono + ikon */}
      <div className="flex flex-col items-center gap-2">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl transition-transform group-hover:-translate-y-0.5",
            isCore
              ? "bg-accent/12 text-accent ring-1 ring-accent/25"
              : "bg-highlight/15 text-highlight ring-1 ring-highlight/30"
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[0.62rem] tracking-widest text-muted-foreground/60">
          {ordinal}
        </span>
      </div>

      {/* Nama + role */}
      <div className="min-w-0">
        <h4 className="font-display text-lg leading-tight font-semibold text-foreground">
          {entity.name}
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{entity.role}</p>
      </div>

      {/* Gives / Gets — span penuh, ala ledger */}
      <dl className="col-span-2 space-y-2 border-t border-border pt-3 text-xs">
        <div className="flex items-start gap-2">
          <ArrowUpRight className="mt-px size-3.5 shrink-0 text-primary" />
          <div>
            <dt className="eyebrow mb-0.5 text-[0.58rem] text-primary">
              Kasih
            </dt>
            <dd className="text-muted-foreground">{entity.gives}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ArrowDownLeft className="mt-px size-3.5 shrink-0 text-success" />
          <div>
            <dt className="eyebrow mb-0.5 text-[0.58rem] text-success">
              Dapat
            </dt>
            <dd className="text-muted-foreground">{entity.gets}</dd>
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
        <span className="relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15">
          <Leaf className="size-8" strokeWidth={1.75} />
          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-accent text-[0.55rem] font-bold text-accent-foreground ring-2 ring-card">
            8
          </span>
        </span>
        <p className="eyebrow mt-4 text-accent">Platform Orchestrator</p>
        <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
          Grounds<span className="italic text-accent">To</span>Grow
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Satu platform menengahi <span className="font-mono">8</span> entitas —
          tiap pihak{" "}
          <span className="font-medium text-foreground">memberi & menerima</span>{" "}
          nilai dalam loop sirkular, bukan rantai linear.
        </p>
      </div>

      {/* CORE 4 */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
          <p className="eyebrow text-accent">Core — 4 Pelaku Langsung</p>
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
            />
          ))}
        </div>
      </div>

      {/* SUPPORTING 4 */}
      <div className="mt-10 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
          <p className="eyebrow text-highlight">Supporting — 4 Enabler</p>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
