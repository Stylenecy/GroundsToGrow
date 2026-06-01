# GroundsToGrow — Design Language (LOCKED v1)

> **Ini hukum visual project. Semua screen WAJIB ikut ini.** Boleh kreatif, tapi DI DALAM rel ini.
> Arah = blend: **Editorial Roastery (A) 50% · Carbon Tech (B) 30% · Organic Craft (C) 20%.**
> Artinya: fondasinya majalah-kopi-premium (A), dipertajam presisi data climate-tech (B), dihangatkan sentuhan organik (C). Bukan 3 gaya ditempel — satu suara.

---

## 1. JIWA (baca dulu, ini yang bikin "terarah")
- **Premium artisanal, bukan template SaaS.** Bayangin brand kopi specialty kelas atas yang juga serius soal data karbon.
- **Editorial**: tipografi berani jadi bintang, layout asimetris, banyak ruang napas, garis rule + nomor seksi ala majalah.
- **Tech precision (B)**: angka/metrik diperlakukan sebagai elemen desain — mono, uppercase eyebrow label, grid rapi, aksen teal "carbon".
- **Warmth (C)**: sentuhan organik secukupnya — lengkung lembut, aksen gold/matcha, anotasi handwritten SANGAT hemat (1-2 per screen max).
- **HARAM** (ini yang bikin generic, jangan diulang): font Inter/Geist/Space Grotesk; layout "hero tengah + 3 kartu sejajar"; semua kartu rounded-xl shadow-sm seragam; emoji jadi ikon utama; pastel datar tanpa kontras/tekstur.

## 2. TIPOGRAFI (sudah dipasang via next/font)
| Peran | Font | Pakai untuk |
|---|---|---|
| **Display** | **Fraunces** (serif, variable, opsz tinggi) | Headline, judul seksi, angka hero. Berani besar. Boleh `italic` untuk aksen/tagline. |
| **Body / UI** | **Hanken Grotesk** | Paragraf, label, nav, tombol, isi kartu. |
| **Mono** | **JetBrains Mono** | Angka/metrik, eyebrow label (uppercase tracking lebar), kode/tag. |
| **Accent script** | **Caveat** (opsional) | Anotasi handwritten, MAX 1-2 per screen. Jangan norak. |

CSS var: `--font-display`, `--font-sans`, `--font-mono`, `--font-script`. Class util: judul otomatis Fraunces (lihat globals base layer), `.font-mono` untuk angka, `.eyebrow` untuk label uppercase mono.

## 3. PALETTE (token Tailwind — JANGAN hardcode hex di komponen)
| Token (class) | Hex | Peran |
|---|---|---|
| `bg-background` | `#F7F0E3` | cream hangat — bg utama |
| `bg-surface` | `#EFE6D6` | kraft — seksi alternatif |
| `bg-card` | `#FBF6EC` | kartu (warm putih) |
| `text-foreground` | `#2A1810` | espresso ink |
| `text-muted-foreground` | `#7A6A54` | teks sekunder |
| `bg-primary` / `text-primary` | `#C0552B` | **terracotta** — brand, CTA utama, aksen A |
| `bg-accent` / `text-accent` | `#008B7C` | **teal carbon** — data/eco/tech, aksen B |
| `bg-highlight` | `#E8A93D` | **eco-gold** — highlight/badge, aksen C |
| `bg-success` / `text-success` | `#3D5C3F` | **matcha** — metrik positif/eco, aksen C |
| `border-border` | `#DDCDB2` | garis rule majalah |
| `bg-ink` (dark sect.) | `#211309` | seksi gelap kontras (opsional, B) |

Dark section (B): boleh 1 seksi gelap `bg-ink text-background` untuk drama (mis. stat strip / metric showcase), teal+gold pop di atasnya.

## 4. LAYOUT & KOMPONEN
- **Container**: `mx-auto w-full max-w-6xl px-5 md:px-8`. Seksi: `py-16 md:py-24`.
- **Nomor seksi** (A): tiap seksi besar dikasih eyebrow `01 — VALUE CONSTELLATION` (mono, uppercase, ada garis rule pendek).
- **Asimetri** (A): hindari grid simetris membosankan. Headline boleh span lebar, konten offset.
- **Garis rule** (A): `border-t border-border` tipis sebagai pemisah editorial, bukan kartu shadow di mana-mana.
- **Kartu**: radius lembut tapi tak seragam — `rounded-2xl` untuk kartu besar, `rounded-lg` kecil. Border `border-border` + shadow halus SECUKUPNYA. Beberapa kartu pakai aksen (border-l-4 border-primary/accent) ala editorial pull-quote.
- **Metric/angka** (B): mono besar, eyebrow label di atasnya, opsional di seksi gelap.
- **Organic touch** (C): 1-2 elemen lengkung/blob SVG halus di background seksi, aksen gold/matcha, atau 1 anotasi Caveat. Hemat.
- **Ikon**: lucide-react (stroke), bukan emoji. Ukuran konsisten.
- **Motion**: halus, tw-animate-css. Fade/slide masuk pada scroll/aksi. Jangan ramai.

## 5. KOMPONEN UI (shadcn varian base-ui — BACA file ui dulu sebelum pakai)
- Button link: `render={<Link href="..."/>} nativeButton={false}`.
- Pakai komponen di `src/components/ui/` (button, card, tabs, select, slider, badge, progress, dll). Restyle via className token, jangan bikin dari nol kecuali perlu.
- Komponen shared: `@/components/site-header`, `site-footer`, `entity-constellation`.

## 6. DATA
- Semua dari `@/data` (baca `src/data/index.ts` — banyak helper). Tipe di `@/types`. Jangan bikin data baru kalau sudah ada.

## 7. "TERARAH" — aturan buat kontributor (Sam/Gatot dll)
✅ BOLEH bebas: komposisi/layout screen kamu, micro-interaction, susunan kartu, ilustrasi/aksen dalam palette, ide visual baru yang MEMPERKUAT jiwa di §1.
⛔ JANGAN: ganti font di luar §2; pakai warna di luar §3 (pakai token); ubah `globals.css`/`layout.tsx`/`tailwind` config; ubah komponen di `src/components/ui/` (itu shared, kepake semua screen); ubah struktur data/types; bikin screen kamu tabrakan jiwa sama yang lain.
🟡 TANYA dulu kalau: mau nambah dependency, mau ubah file shared, ragu sesuatu masih "on-direction" atau enggak.
> Patokan: kalau hasil kerjamu ditaruh sebelah Landing, harus kelihatan **satu keluarga**. Bebas berkreasi, tapi tetap satu suara.
