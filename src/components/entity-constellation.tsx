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
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

function EntityCard({ entity }: { entity: Entity }) {
  const Icon = ICON_MAP[entity.icon] ?? Leaf;
  const isCore = entity.tier === "core";

  return (
    <Card
      className={cn(
        "flex flex-col gap-2 p-4 transition-shadow hover:shadow-md",
        isCore ? "border-accent/40" : "border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            isCore
              ? "bg-accent text-accent-foreground"
              : "bg-surface text-primary"
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {entity.name}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {entity.role}
          </p>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <p className="text-muted-foreground">
          <span className="font-semibold text-primary">Kasih:</span>{" "}
          {entity.gives}
        </p>
        <p className="text-muted-foreground">
          <span className="font-semibold text-success">Dapat:</span>{" "}
          {entity.gets}
        </p>
      </div>
    </Card>
  );
}

export function EntityConstellation() {
  const coreEntities = getCoreEntities();
  const supportingEntities = getSupportingEntities();

  return (
    <section className="w-full space-y-8">
      {/* Platform di tengah */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Leaf className="size-7" />
        </span>
        <h2 className="text-xl font-semibold text-foreground">
          Grounds<span className="text-accent">To</span>Grow
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Satu platform, 8 entitas saling memberi & menerima nilai —{" "}
          <span className="font-medium text-foreground">
            value constellation
          </span>{" "}
          circular economy.
        </p>
      </div>

      {/* CORE 4 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-accent text-accent-foreground">Core 4</Badge>
          <span className="text-sm text-muted-foreground">
            Pelaku langsung rantai nilai ampas
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {coreEntities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} />
          ))}
        </div>
      </div>

      {/* SUPPORTING 4 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Supporting 4</Badge>
          <span className="text-sm text-muted-foreground">
            Enabler ekosistem & jaringan
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {supportingEntities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} />
          ))}
        </div>
      </div>
    </section>
  );
}
