"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { PaymentModal } from "@/components/PaymentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Truck, ShieldCheck, ShoppingBag, Leaf, Sprout } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const SHIPPING_FEE = 15000;
  const SERVICE_FEE = 3000;
  const grandTotal = cartTotal + (items.length > 0 ? SHIPPING_FEE + SERVICE_FEE : 0);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const getIcon = (type: string) => {
    if (type === "ampas") return <Leaf className="size-4 text-success" />;
    if (type === "produk") return <ShoppingBag className="size-4 text-primary" />;
    if (type === "biji") return <Sprout className="size-4 text-highlight" />;
    return <ShoppingBag className="size-4" />;
  };

  const handlePaymentSuccess = () => {
    addOrder(items, grandTotal);
    clearCart();
    setIsPaymentOpen(false);
    router.push("/checkout/success");
  };

  if (items.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4 text-center bg-surface/30">
        <div className="mb-6 rounded-full bg-surface p-6 shadow-sm border border-border">
          <ShoppingBag className="size-12 text-muted-foreground opacity-50" />
        </div>
        <h2 className="font-display text-3xl font-semibold text-foreground">Keranjang Kosong</h2>
        <p className="mt-3 text-muted-foreground max-w-sm text-sm">
          Kamu belum menambahkan apa pun ke keranjang. Ayo mulai sirkularitasmu di Marketplace!
        </p>
        <Link href="/marketplace" className="mt-8">
          <Button className="rounded-full px-8 h-12 text-base shadow-sm">Belanja Sekarang</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/30 pb-24">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto max-w-5xl relative">
          <Link href="/marketplace" className="absolute -top-4 left-0 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
          <div className="mt-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <span className="h-px w-6 bg-border" /> 03 — Checkout
            </p>
            <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Selesaikan Pesanan
            </h1>
            <p className="mt-2 text-muted-foreground">
              Pastikan alamat pengiriman dan rincian pesanan Anda sudah benar.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column (Address & Items) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Address Form (Dummy) */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <h2 className="font-semibold">Alamat Pengiriman</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Nama Penerima</label>
                    <Input defaultValue="John Doe" className="rounded-xl bg-surface/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                    <Input defaultValue="081234567890" className="rounded-xl bg-surface/50" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Alamat Lengkap</label>
                  <Input defaultValue="Jl. Kaliurang KM 5.5, Gg. Pandega Karya No. 10" className="rounded-xl bg-surface/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Kota</label>
                    <Input defaultValue="Sleman, Yogyakarta" disabled className="rounded-xl bg-surface/50 opacity-70" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Kode Pos</label>
                    <Input defaultValue="55281" className="rounded-xl bg-surface/50" />
                  </div>
                </div>
              </div>
            </section>

            {/* Cart Items */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <ShoppingBag className="size-4" />
                </div>
                <h2 className="font-semibold">Pesanan Anda ({items.length} item)</h2>
              </div>
              
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium leading-tight">{item.name}</h3>
                          <span className="font-mono font-semibold">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          {getIcon(item.type)}
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Jumlah: <span className="font-mono font-medium text-foreground">{item.quantity}</span> 
                        {item.type === "ampas" || item.type === "biji" ? " kg" : " pcs"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (Summary) */}
          <div className="lg:col-span-5">
            <section className="sticky top-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-semibold mb-4 border-b border-border pb-4">Ringkasan Belanja</h2>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Harga ({items.length} Barang)</span>
                  <span className="font-medium">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="size-3.5" /> Ongkos Kirim (Flat Rate)
                  </span>
                  <span className="font-mono font-medium">{formatRupiah(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" /> Biaya Layanan
                  </span>
                  <span className="font-mono font-medium">{formatRupiah(SERVICE_FEE)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-semibold">Total Tagihan</span>
                  <span className="font-mono text-2xl font-bold tracking-tight text-primary">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="bg-success/10 rounded-xl p-3 flex gap-2 items-start mb-6 border border-success/20">
                <ShieldCheck className="size-4 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-success-foreground leading-relaxed">
                  Transaksi Anda aman. Dana baru akan diteruskan ke penjual setelah pesanan selesai.
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full rounded-full h-14 text-base font-semibold shadow-md"
                onClick={() => setIsPaymentOpen(true)}
              >
                Bayar Sekarang
              </Button>
            </section>
          </div>

        </div>
      </main>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={grandTotal}
      />
    </div>
  );
}
