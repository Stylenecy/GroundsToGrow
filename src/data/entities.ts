import type { Entity } from "@/types";

/**
 * 8-Entity Value Constellation (P15 — 9-Level Model of Digital Disruption, Level 8).
 * CORE 4 (langsung di rantai nilai ampas) + SUPPORTING 4 (enabler ekosistem).
 * `icon` = nama komponen lucide-react, di-resolve oleh entity-constellation.tsx.
 * Dipakai di Landing untuk visualisasi multi-sided platform.
 */
export const entities: Entity[] = [
  // ---------- CORE 4 ----------
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    tier: "core",
    icon: "Coffee",
    role: "Sumber ampas kopi",
    gives: "Ampas kopi (limbah harian)",
    gets: "Disposal gratis + ESG/Eco-Badge",
  },
  {
    id: "umkm",
    name: "UMKM Hilirisasi",
    tier: "core",
    icon: "FlaskConical",
    role: "Transformer ampas jadi produk",
    gives: "Subscription + produk olahan",
    gets: "Supply tersortir + Verified Circular Source",
  },
  {
    id: "end-user",
    name: "End User (B2C)",
    tier: "core",
    icon: "ShoppingBag",
    role: "Konsumen produk olahan",
    gives: "Pembelian + komisi marketplace",
    gets: "Produk + konten DIY + Grounds Coin",
  },
  {
    id: "brand-sponsor",
    name: "Brand Sponsor",
    tier: "core",
    icon: "Building2",
    role: "Carbon buyer / korporasi ESG",
    gives: "Pembelian carbon credit",
    gets: "ESG report ready (dorong LST OJK)",
  },
  // ---------- SUPPORTING 4 ----------
  {
    id: "kampus",
    name: "Kampus",
    tier: "supporting",
    icon: "GraduationCap",
    role: "Host Hub + talent mahasiswa",
    gives: "Lokasi Hub + SDM mahasiswa",
    gets: "Living lab + branding sustainability",
  },
  {
    id: "dlh",
    name: "DLH",
    tier: "supporting",
    icon: "Landmark",
    role: "Dinas Lingkungan Hidup",
    gives: "Legitimasi + dukungan regulasi",
    gets: "Data flow waste (Adipura / zero-waste)",
  },
  {
    id: "komunitas",
    name: "Komunitas Urban Farming",
    tier: "supporting",
    icon: "Sprout",
    role: "Demand kompos / media tanam",
    gives: "Demand kompos + edukasi",
    gets: "Kompos & media tanam terjangkau",
  },
  {
    id: "logistik",
    name: "Logistik Partner",
    tier: "supporting",
    icon: "Truck",
    role: "Pickup ampas (idle capacity)",
    gives: "Kapasitas pickup & antar",
    gets: "Fee dari idle capacity",
  },
];
