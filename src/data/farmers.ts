import type { Farmer } from "@/types";

/**
 * Mock Farmers — petani kopi sumber CoffeeBean.
 * Derived dari 10-Mock-Data.md §8 (petani-products.json), dipisah jadi entitas Farmer.
 */
export const farmers: Farmer[] = [
  {
    farmerId: "frm01-sugeng",
    petaniName: "Pak Sugeng",
    petaniPhone: "+62812-9999-1111",
    asalKebun: "Toraja, Sulawesi Selatan",
    imageUrl: "https://placehold.co/120x120/3d5c3f/fbf5ec?text=Pak+Sugeng",
    verified: true,
  },
  {
    farmerId: "frm02-yanto",
    petaniName: "Mas Yanto",
    petaniPhone: "+62813-8888-2222",
    asalKebun: "Gayo Highland, Aceh",
    imageUrl: "https://placehold.co/120x120/3d5c3f/fbf5ec?text=Mas+Yanto",
    verified: true,
  },
  {
    farmerId: "frm03-budi",
    petaniName: "Pak Budi",
    petaniPhone: "+62814-7777-3333",
    asalKebun: "Temanggung, Jawa Tengah",
    imageUrl: "https://placehold.co/120x120/3d5c3f/fbf5ec?text=Pak+Budi",
    verified: true,
  },
  {
    farmerId: "frm04-rina",
    petaniName: "Bu Rina",
    petaniPhone: "+62815-6666-4444",
    asalKebun: "Kintamani, Bali",
    imageUrl: "https://placehold.co/120x120/3d5c3f/fbf5ec?text=Bu+Rina",
    verified: false,
  },
];
