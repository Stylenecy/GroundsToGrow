import type { CoffeeBean } from "@/types";

/**
 * Mock Coffee Beans — 4 biji kopi petani (Marketplace tab "Biji Kopi Petani").
 * Sumber: 10-Mock-Data.md §8 (petani-products.json), di-author camelCase + farmerId.
 */
export const coffeeBeans: CoffeeBean[] = [
  {
    petaniProductId: "pet01-sugeng-toraja",
    farmerId: "frm01-sugeng",
    petaniName: "Pak Sugeng",
    asalKebun: "Toraja, Sulawesi Selatan",
    profileRasa: "fruity, dark chocolate, floral",
    hargaPerKg: 85000,
    stokKg: 50,
    proses: "honey",
    imageUrl: "https://placehold.co/400x300/6b3a2a/fbf5ec?text=Toraja+Honey",
    verified: true,
  },
  {
    petaniProductId: "pet02-yanto-aceh",
    farmerId: "frm02-yanto",
    petaniName: "Mas Yanto",
    asalKebun: "Gayo Highland, Aceh",
    profileRasa: "earthy, nutty, low acidity",
    hargaPerKg: 95000,
    stokKg: 30,
    proses: "washed",
    imageUrl: "https://placehold.co/400x300/6b3a2a/fbf5ec?text=Gayo+Washed",
    verified: true,
  },
  {
    petaniProductId: "pet03-budi-temanggung",
    farmerId: "frm03-budi",
    petaniName: "Pak Budi",
    asalKebun: "Temanggung, Jawa Tengah",
    profileRasa: "robusta classic, full body, bitter chocolate",
    hargaPerKg: 55000,
    stokKg: 120,
    proses: "natural",
    imageUrl: "https://placehold.co/400x300/6b3a2a/fbf5ec?text=Temanggung",
    verified: true,
  },
  {
    petaniProductId: "pet04-rina-bali",
    farmerId: "frm04-rina",
    petaniName: "Bu Rina",
    asalKebun: "Kintamani, Bali",
    profileRasa: "bright acidity, lemon zest, balanced sweetness",
    hargaPerKg: 110000,
    stokKg: 25,
    proses: "anaerobic",
    imageUrl: "https://placehold.co/400x300/6b3a2a/fbf5ec?text=Kintamani",
    verified: false,
  },
];
