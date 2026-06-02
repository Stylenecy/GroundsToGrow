# 📦 GroundsToGrow — Status Repo (buat tim)

> Projek UAS **Digital Platform & Sharing Economy** — platform sharing economy ampas kopi ♻️☕
> Repo ini = **kode app MVP** (Next.js) + **pitch deck**. Update terakhir: 2 Juni 2026.

## 🌐 Yang udah jalan (LIVE)
- **App:** https://groundstogrow-mvp.vercel.app — 4 screen: Landing · WasteScan (demo AI mock) · Coffee Shop Dashboard · Marketplace 3-tab.
- **Pitch deck:** https://groundstogrow-mvp.vercel.app/deck — 14 slide HTML, navigasi panah kiri/kanan, ada live-demo + diagram foundation asli.

## ✅ Progres sekarang
- Foundation app: Next 16 + React 19 + Tailwind v4 + shadcn/ui. Build bersih, ke-deploy Vercel.
- 4 screen jadi + mock data realistis (`src/data/`).
- **Design Language v1 dikunci** → `docs/DESIGN-LANGUAGE.md` (ini HUKUM visual, baca sebelum ngoding UI).
- Deck 14 slide + 5 diagram (DFD/ERD/Activity/Flowchart) embedded.
- Riset data + script demo + Q&A → ada di folder Drive tim (`team/`).

## 🗂️ Struktur repo (yang perlu kamu tau)
```
src/app/page.tsx ............ Landing
src/app/wastescan/page.tsx .. WasteScan (demo AI — MOCK, jangan diubah logikanya)
src/app/dashboard/page.tsx .. Dashboard  ← garapan Gatot
src/app/marketplace/page.tsx  Marketplace ← garapan Samuel
src/components/ ............. shell (header/footer/constellation) + ui/ (shadcn, JANGAN diubah)
src/data/ .................. mock data + helper (jangan bikin data baru kalau udah ada)
src/types/ ................. tipe TypeScript
docs/DESIGN-LANGUAGE.md .... hukum visual (font, warna, do/don't)
public/deck/ .............. pitch deck (HTML statik)
```

## 👥 Siapa garap apa
| Orang | Bagian | File |
|---|---|---|
| Samuel | UI Marketplace | `src/app/marketplace/page.tsx` |
| Gatot | UI Dashboard | `src/app/dashboard/page.tsx` |
| Elseva | Narasi deck | (brief di Drive) |
| Elsava | Substansi bisnis deck | (brief di Drive) |

> Tugas detail tiap orang ada di folder **Drive** (`Brief-<Nama>.md`) + file **"00 - MULAI DI SINI"**. Baca itu dulu.

## 🛠️ Cara jalanin di laptop (kalau mau ngoding langsung)
```bash
pnpm install        # atau: npm install
pnpm dev            # buka http://localhost:3000
```
> Gak akrab git/terminal? Gak apa. Kerjain via AI (paste kode + brief), balikin file-nya ke grup — nanti tim inti yang gabungin.

## 🌿 Cara kontribusi (yang bisa git)
1. Bikin branch sendiri: `git checkout -b ui/marketplace-sam` (sesuaikan).
2. Edit **cuma bagianmu**. JANGAN sentuh: `globals.css`, `layout.tsx`, `src/components/ui/*`, `src/data/`, `src/types/`, screen orang lain.
3. Ikut `docs/DESIGN-LANGUAGE.md` (font + warna token). Bebas kreatif, tapi tetap satu vibe.
4. Push branch-mu → kabarin grup. Tim inti review + merge (ide oke dipakai).

## ⏳ Next (yang belum)
- UI Marketplace & Dashboard di-level-up (Samuel, Gatot).
- Narasi + isi slide deck dirapihin (Elseva, Elsava).
- Dress rehearsal demo 2 menit (script ada di Drive `Demo-Script.md`).

**Deadline internal: Rabu 3 Juni** · **UAS: Jumat 5 Juni, ruang D.1.3.**
