import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Display — Fraunces (serif ekspresif, editorial). Variable, normal + italic.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body / UI — Hanken Grotesk (grotesk humanis berkarakter).
const sans = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono — JetBrains Mono (angka, eyebrow label, tag).
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Script — Caveat (anotasi handwritten, hemat).
const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GroundsToGrow — From Waste to Wealth, From Coffee to Carbon",
  description:
    "Platform sharing economy yang mengubah ampas kopi jadi multi-sided ecosystem: menghubungkan Coffee Shop, UMKM Hilirisasi, End User, Brand Sponsor, dan 4 entitas pendukung dalam value constellation circular economy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
