import type { EsgMetric, GroundsCoinTx } from "@/types";

/**
 * Mock ESG Metrics — aggregated sustainability metrics per scope.
 * Sumber: 10-Mock-Data.md §10 (esg-metrics.json), di-author camelCase + label display.
 */
export const esgMetrics: EsgMetric[] = [
  {
    metricId: "esg-global-current",
    scope: "global",
    label: "Global (semua entitas)",
    userId: null,
    kgDivertedTotal: 5432.5,
    co2EqSavedKgTotal: 2716.25,
    ecoScore: null,
    ecoCoinTotalEarned: 542100,
    snapshotDate: "2026-05-27",
  },
  {
    metricId: "esg-cs01-rina",
    scope: "coffee_shop",
    label: "Kopi Sudut",
    userId: "u01a-coffee-rina",
    kgDivertedTotal: 156.5,
    co2EqSavedKgTotal: 78.25,
    ecoScore: 87,
    ecoCoinTotalEarned: 3892,
    snapshotDate: "2026-05-27",
  },
  {
    metricId: "esg-cs02-brewlab",
    scope: "coffee_shop",
    label: "Brew Lab",
    userId: null,
    kgDivertedTotal: 124.0,
    co2EqSavedKgTotal: 62.0,
    ecoScore: 82,
    ecoCoinTotalEarned: 2718,
    snapshotDate: "2026-05-27",
  },
  {
    metricId: "esg-region-sleman",
    scope: "region",
    label: "Sleman",
    userId: null,
    kgDivertedTotal: 3210.0,
    co2EqSavedKgTotal: 1605.0,
    ecoScore: null,
    ecoCoinTotalEarned: null,
    snapshotDate: "2026-05-27",
  },
  {
    metricId: "esg-region-yogyakarta",
    scope: "region",
    label: "Yogyakarta",
    userId: null,
    kgDivertedTotal: 2222.5,
    co2EqSavedKgTotal: 1111.25,
    ecoScore: null,
    ecoCoinTotalEarned: null,
    snapshotDate: "2026-05-27",
  },
];

/**
 * Mock Grounds Coin ledger — earn + redeem untuk Coffee Shop "Kopi Sudut".
 * Dipakai di Dashboard (panel reward gamification).
 */
export const groundsCoinTxs: GroundsCoinTx[] = [
  {
    txId: "gct01-earn-lst01",
    coffeeShopProfileId: "cs01-kopi-sudut",
    type: "earn",
    amount: 250,
    description: "Setor 2.5 kg ampas arabika (Listing #lst01)",
    createdAt: "2026-05-27T16:05:00Z",
  },
  {
    txId: "gct02-earn-lst06",
    coffeeShopProfileId: "cs01-kopi-sudut",
    type: "earn",
    amount: 150,
    description: "Setor 1.5 kg ampas blend (Listing #lst06)",
    createdAt: "2026-05-26T15:10:00Z",
  },
  {
    txId: "gct03-redeem-voucher",
    coffeeShopProfileId: "cs01-kopi-sudut",
    type: "redeem",
    amount: 500,
    description: "Tukar voucher diskon packaging eco-friendly",
    createdAt: "2026-05-25T10:00:00Z",
  },
  {
    txId: "gct04-earn-bonus",
    coffeeShopProfileId: "cs01-kopi-sudut",
    type: "earn",
    amount: 300,
    description: "Bonus streak 7 hari setor ampas",
    createdAt: "2026-05-24T09:00:00Z",
  },
  {
    txId: "gct05-redeem-merch",
    coffeeShopProfileId: "cs01-kopi-sudut",
    type: "redeem",
    amount: 200,
    description: "Tukar Eco-Badge sticker pack untuk display kedai",
    createdAt: "2026-05-22T14:00:00Z",
  },
];
