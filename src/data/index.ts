/**
 * Data barrel — re-export semua mock dataset + helper query sederhana.
 * Screen tinggal: `import { products, getProductsByCategory } from "@/data";`
 */
import type {
  CoffeeShop,
  WasteListing,
  Umkm,
  Product,
  ProductCategory,
  CoffeeBean,
  Farmer,
  SmartMatch,
  EsgMetric,
  GroundsCoinTx,
  Entity,
  ListingStatus,
} from "@/types";

import { coffeeShops } from "./coffeeShops";
import { wasteListings } from "./wasteListings";
import { umkms } from "./umkms";
import { products } from "./products";
import { coffeeBeans } from "./coffeeBeans";
import { farmers } from "./farmers";
import { smartMatches } from "./smartMatches";
import { esgMetrics, groundsCoinTxs } from "./esg";
import { entities } from "./entities";

export {
  coffeeShops,
  wasteListings,
  umkms,
  products,
  coffeeBeans,
  farmers,
  smartMatches,
  esgMetrics,
  groundsCoinTxs,
  entities,
};

/* ============================================================
   HELPER QUERIES
   ============================================================ */

// --- Coffee Shops ---
export function getShopById(profileId: string): CoffeeShop | undefined {
  return coffeeShops.find((shop) => shop.profileId === profileId);
}

/** Coffee Shop "demo default" untuk Dashboard (Kopi Sudut). */
export function getFeaturedShop(): CoffeeShop {
  return coffeeShops[0];
}

// --- Waste Listings ---
export function getListingById(listingId: string): WasteListing | undefined {
  return wasteListings.find((listing) => listing.listingId === listingId);
}

export function getListingsByStatus(status: ListingStatus): WasteListing[] {
  return wasteListings.filter((listing) => listing.status === status);
}

export function getOpenListings(): WasteListing[] {
  return getListingsByStatus("open");
}

export function getListingsByShop(profileId: string): WasteListing[] {
  return wasteListings.filter(
    (listing) => listing.coffeeShopProfileId === profileId
  );
}

// --- UMKM ---
export function getUmkmById(profileId: string): Umkm | undefined {
  return umkms.find((umkm) => umkm.profileId === profileId);
}

// --- Products ---
export function getProductById(productId: string): Product | undefined {
  return products.find((product) => product.productId === productId);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.kategori === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getProductsByUmkm(umkmProfileId: string): Product[] {
  return products.filter((product) => product.umkmProfileId === umkmProfileId);
}

// --- Coffee Beans / Farmers ---
export function getBeanById(petaniProductId: string): CoffeeBean | undefined {
  return coffeeBeans.find((bean) => bean.petaniProductId === petaniProductId);
}

export function getFarmerById(farmerId: string): Farmer | undefined {
  return farmers.find((farmer) => farmer.farmerId === farmerId);
}

export function getVerifiedBeans(): CoffeeBean[] {
  return coffeeBeans.filter((bean) => bean.verified);
}

// --- Smart Matches ---
export function getMatchesForListing(listingId: string): SmartMatch[] {
  return smartMatches
    .filter((match) => match.listingId === listingId)
    .sort((a, b) => b.score - a.score);
}

/** Top-N match dengan score tertinggi (untuk WasteScan demo). */
export function getTopMatches(listingId: string, topN = 3): SmartMatch[] {
  return getMatchesForListing(listingId).slice(0, topN);
}

// --- ESG ---
export function getGlobalEsg(): EsgMetric | undefined {
  return esgMetrics.find((metric) => metric.scope === "global");
}

export function getEsgByUser(userId: string): EsgMetric | undefined {
  return esgMetrics.find((metric) => metric.userId === userId);
}

export function getCoffeeShopEsgMetrics(): EsgMetric[] {
  return esgMetrics.filter((metric) => metric.scope === "coffee_shop");
}

// --- Grounds Coin ---
export function getCoinTxsByShop(coffeeShopProfileId: string): GroundsCoinTx[] {
  return groundsCoinTxs.filter(
    (tx) => tx.coffeeShopProfileId === coffeeShopProfileId
  );
}

// --- Entities (8-entity constellation) ---
export function getCoreEntities(): Entity[] {
  return entities.filter((entity) => entity.tier === "core");
}

export function getSupportingEntities(): Entity[] {
  return entities.filter((entity) => entity.tier === "supporting");
}
