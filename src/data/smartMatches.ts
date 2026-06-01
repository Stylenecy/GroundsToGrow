import type { SmartMatch } from "@/types";

/**
 * Mock Smart Matches — hasil matching algorithm listing ↔ UMKM.
 * Sumber: 10-Mock-Data.md §6 (matches.json), di-author camelCase + enrichment
 * (umkmName, jenisProduk, distanceKm, reasons) untuk demo WasteScan yang transparan.
 * Catatan: WasteScan = MOCK UI, bukan real AI. Score & reasons hardcoded.
 */
export const smartMatches: SmartMatch[] = [
  {
    matchId: "mtc01-lst01-brewskin",
    listingId: "lst01-kopisudut-27may",
    umkmProfileId: "um01-brewskin",
    umkmName: "Brewskin Co",
    jenisProduk: "skincare",
    score: 95,
    distanceKm: 1.4,
    status: "suggested",
    reasons: [
      "Preferensi jenis kopi cocok: arabika",
      "Jarak hanya 1.4 km (dalam radius 5 km)",
      "Freshness 2 jam < batas maks 4 jam",
    ],
    suggestedAt: "2026-05-27T16:00:05Z",
    respondedAt: null,
  },
  {
    matchId: "mtc02-lst01-lulurnusa",
    listingId: "lst01-kopisudut-27may",
    umkmProfileId: "um02-lulur-nusa",
    umkmName: "Lulur Nusa",
    jenisProduk: "skincare",
    score: 88,
    distanceKm: 2.1,
    status: "suggested",
    reasons: [
      "Preferensi jenis kopi cocok: arabika",
      "Jarak 2.1 km (dalam radius 4 km)",
      "Kapasitas produksi mencukupi volume",
    ],
    suggestedAt: "2026-05-27T16:00:05Z",
    respondedAt: null,
  },
  {
    matchId: "mtc03-lst01-earthly",
    listingId: "lst01-kopisudut-27may",
    umkmProfileId: "um03-earthly",
    umkmName: "Earthly Body",
    jenisProduk: "skincare",
    score: 75,
    distanceKm: 3.8,
    status: "suggested",
    reasons: [
      "Menerima semua jenis kopi (any)",
      "Jarak 3.8 km (dalam radius 8 km)",
      "Toleransi freshness longgar (12 jam)",
    ],
    suggestedAt: "2026-05-27T16:00:05Z",
    respondedAt: null,
  },
  {
    matchId: "mtc04-lst03-briketbara",
    listingId: "lst03-warkopmbah-27may",
    umkmProfileId: "um04-briket-bara",
    umkmName: "Briket Bara",
    jenisProduk: "briket",
    score: 98,
    distanceKm: 2.7,
    status: "accepted",
    reasons: [
      "Preferensi jenis kopi cocok: robusta",
      "Volume 4.2 kg ideal untuk produksi briket",
      "Jarak 2.7 km (dalam radius 10 km)",
    ],
    suggestedAt: "2026-05-27T14:00:05Z",
    respondedAt: "2026-05-27T14:15:00Z",
  },
  {
    matchId: "mtc05-lst06-komposhijau",
    listingId: "lst06-kopisudut-26may",
    umkmProfileId: "um05-kompos-hijau",
    umkmName: "Kompos Hijau",
    jenisProduk: "kompos",
    score: 85,
    distanceKm: 4.2,
    status: "accepted",
    reasons: [
      "Menerima semua jenis kopi (any)",
      "Toleransi freshness sangat longgar (48 jam)",
      "Jarak 4.2 km (dalam radius 7 km)",
    ],
    suggestedAt: "2026-05-26T15:00:05Z",
    respondedAt: "2026-05-26T15:30:00Z",
  },
];
