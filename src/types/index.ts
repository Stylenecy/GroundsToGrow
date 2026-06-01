/**
 * GroundsToGrow × WasteLoop — Core TypeScript types
 *
 * Convention (08-Naming-Convention.md §4.4 & §5.1):
 *   - Types/Interfaces: PascalCase
 *   - Fields in TS: camelCase (mock JSON mirrors snake_case di DB, tapi data/*.ts
 *     di-author langsung camelCase supaya screen tinggal pakai tanpa mapper)
 *   - Unions untuk enum-like string values
 *
 * Scope: entitas inti yang dipakai 4 screen MVP
 *   Landing · WasteScan · Coffee Shop Dashboard · Marketplace
 */

/* ============================================================
   ENUMS / UNIONS
   ============================================================ */

export type JenisKopi = "arabika" | "robusta" | "blend" | "any";

export type ListingStatus =
  | "open"
  | "matched"
  | "in_pickup"
  | "completed"
  | "expired"
  | "cancelled";

export type MatchStatus = "suggested" | "accepted" | "declined" | "expired";

export type ProductCategory =
  | "skincare"
  | "briket"
  | "kompos"
  | "pewarna"
  | "jamur"
  | "lainnya";

export type ProductStatus = "active" | "out_of_stock" | "draft";

export type SubscriptionTier = "starter" | "pro" | "enterprise";

export type ProsesKopi = "natural" | "honey" | "washed" | "anaerobic";

export type EsgScope = "global" | "coffee_shop" | "umkm" | "region" | "user";

export type GroundsCoinTxType = "earn" | "redeem";

/** Posisi entitas dalam 8-entity Value Constellation (landing diagram). */
export type EntityTier = "core" | "supporting";

/* ============================================================
   COFFEE SHOP — supply ampas (Screen: Landing, Dashboard, Marketplace)
   ============================================================ */

export interface CoffeeShop {
  profileId: string;
  kedaiName: string;
  alamat: string;
  lat: number;
  lng: number;
  brandStory: string;
  instagramHandle: string;
  imageUrl: string;
  totalListings: number;
  /** ESG sustainability score 0-100 */
  currentEsgScore: number;
  /** Grounds Coin / Eco Coin reward balance */
  ecoCoinBalance: number;
  totalKgDiverted: number;
  totalCo2EqSaved: number;
}

/* ============================================================
   WASTE LISTING — ampas batch yang di-submit Coffee Shop
   (Screen: WasteScan, Marketplace tab "Ampas Mentah", Dashboard)
   ============================================================ */

export interface WasteListing {
  listingId: string;
  coffeeShopProfileId: string;
  /** denormalized untuk display cepat di card */
  coffeeShopName: string;
  jenisKopi: JenisKopi;
  volumeKg: number;
  /** umur ampas dalam jam sejak diseduh (semakin segar semakin tinggi value) */
  freshnessJam: number;
  /** harga indikatif ampas mentah (Rp), 0 = disposal gratis */
  hargaPerKg: number;
  imageUrl: string;
  status: ListingStatus;
  expiresAt: string;
  createdAt: string;
}

/* ============================================================
   UMKM HILIRISASI — transformer ampas (Screen: WasteScan, Marketplace)
   ============================================================ */

export interface Umkm {
  profileId: string;
  brandName: string;
  jenisProduk: ProductCategory;
  lat: number;
  lng: number;
  imageUrl: string;
  preferenceJenisKopi: JenisKopi;
  preferenceVolumeKgPerWeek: number;
  preferenceMaxFreshnessJam: number;
  preferenceMaxRadiusKm: number;
  kapasitasProduksiKgPerMonth: number;
  subscriptionTier: SubscriptionTier;
  /** punya Verified Circular Source certificate aktif */
  isVerified: boolean;
}

/* ============================================================
   PRODUCT — produk olahan UMKM (Screen: Marketplace tab "Produk Olahan")
   ============================================================ */

export interface Product {
  productId: string;
  umkmProfileId: string;
  /** denormalized nama brand UMKM untuk card */
  umkmName: string;
  certificateId: string | null;
  namaProduk: string;
  kategori: ProductCategory;
  /** harga jual (Rp) */
  harga: number;
  stok: number;
  deskripsi: string;
  imageUrl: string;
  status: ProductStatus;
  featured: boolean;
  /** rating 0-5 untuk display marketplace */
  rating: number;
  hasCertificate: boolean;
}

/* ============================================================
   COFFEE BEAN — biji kopi petani (Screen: Marketplace tab "Biji Kopi Petani")
   ============================================================ */

export interface CoffeeBean {
  petaniProductId: string;
  farmerId: string;
  /** denormalized nama petani untuk card */
  petaniName: string;
  asalKebun: string;
  profileRasa: string;
  hargaPerKg: number;
  stokKg: number;
  proses: ProsesKopi;
  imageUrl: string;
  verified: boolean;
}

/* ============================================================
   FARMER — petani kopi (sumber CoffeeBean)
   ============================================================ */

export interface Farmer {
  farmerId: string;
  petaniName: string;
  petaniPhone: string;
  asalKebun: string;
  imageUrl: string;
  verified: boolean;
}

/* ============================================================
   SMART MATCH — hasil matching algorithm listing ↔ UMKM
   (Screen: WasteScan demo, Dashboard)
   ============================================================ */

export interface SmartMatch {
  matchId: string;
  listingId: string;
  umkmProfileId: string;
  /** denormalized nama UMKM untuk result card */
  umkmName: string;
  jenisProduk: ProductCategory;
  /** match score 0-100 (higher = better fit) */
  score: number;
  /** jarak UMKM ke sumber ampas (km) */
  distanceKm: number;
  status: MatchStatus;
  /** alasan match yang ditampilkan ke user (untuk transparansi demo) */
  reasons: string[];
  suggestedAt: string;
  respondedAt: string | null;
}

/* ============================================================
   ESG METRIC — aggregated sustainability metrics
   (Screen: Dashboard, Landing impact counters)
   ============================================================ */

export interface EsgMetric {
  metricId: string;
  scope: EsgScope;
  /** label untuk display (nama kedai / "Global" / nama region) */
  label: string;
  userId: string | null;
  kgDivertedTotal: number;
  co2EqSavedKgTotal: number;
  /** 0-100, null untuk scope global/region */
  ecoScore: number | null;
  ecoCoinTotalEarned: number | null;
  snapshotDate: string;
}

/* ============================================================
   GROUNDS COIN TX — ledger reward coin (earn + redeem)
   (Screen: Dashboard)
   ============================================================ */

export interface GroundsCoinTx {
  txId: string;
  coffeeShopProfileId: string;
  type: GroundsCoinTxType;
  /** jumlah coin (positif untuk earn, akan ditampilkan dengan tanda sendiri) */
  amount: number;
  description: string;
  createdAt: string;
}

/* ============================================================
   ENTITY — 8-entity Value Constellation (Screen: Landing diagram)
   ============================================================ */

export interface Entity {
  id: string;
  /** nama entitas, mis. "Coffee Shop", "UMKM Hilirisasi" */
  name: string;
  /** core 4 vs supporting 4 */
  tier: EntityTier;
  /** nama icon dari lucide-react (di-resolve oleh komponen) */
  icon: string;
  /** peran singkat 1 baris */
  role: string;
  /** apa yang entitas BERIKAN ke ekosistem */
  gives: string;
  /** apa yang entitas DAPAT dari ekosistem */
  gets: string;
}
