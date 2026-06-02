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
  const grandTotal = cartTotal + (items.length > 0 ? SHIPPING_FEE : 0);

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
      <div className="flex h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-surface p-6">
          <ShoppingBag className="size-12 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Keranjang Kosong</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Kamu belum menambahkan apa pun ke keranjang. Ayo mulai sirkularitasmu di Marketplace!
        </p>
        <Link href="/marketplace" className="mt-8">
          <Button className="rounded-full px-8">Ke Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/30 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-display text-lg font-semibold">
            Checkout
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column (Address & Items) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Address Form (Dummy) */}
            <section className="rounded-[20px] border border-border bg-card p-6 shadow-sm">
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
            <section className="rounded-[20px] border border-border bg-card p-6 shadow-sm">
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
                        Jumlah: <span className="font-medium text-foreground">{item.quantity}</span> 
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
            <section className="sticky top-24 rounded-[20px] border border-border bg-card p-6 shadow-sm">
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
                  <span className="font-medium">{formatRupiah(SHIPPING_FEE)}</span>
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
