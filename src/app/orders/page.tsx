"use client";

import { useOrders } from "@/context/OrderContext";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Package, Leaf, ShoppingBag, Sprout, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { orders } = useOrders();

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

  return (
    <div className="min-h-screen bg-surface/30 pb-24">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-muted-foreground mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-border" /> 04 — Histori Belanja
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            Riwayat Transaksi
          </h1>
          <p className="mt-2 text-muted-foreground">
            Lacak pesanan dan lihat kontribusi sirkular Anda sebelumnya.
          </p>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-4xl px-4 md:px-8">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
            <ReceiptText className="size-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="font-display text-xl font-semibold">Belum Ada Transaksi</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mb-6">
              Anda belum melakukan pembelian apa pun. Yuk belanja di Marketplace untuk memulai!
            </p>
            <Link href="/marketplace">
              <Button className="rounded-full px-6">Mulai Belanja</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.orderId}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface/50 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Package className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Pesanan {order.orderId}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.date), "dd MMM yyyy, HH:mm", { locale: id })}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-highlight text-highlight-foreground">
                    {order.status}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-border px-6 py-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
                          {getIcon(item.type)} {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold">{formatRupiah(item.price * item.quantity)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.quantity} {item.type === "ampas" || item.type === "biji" ? "kg" : "pcs"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-surface/30 px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Total Belanja ({order.items.length} Barang)
                  </p>
                  <p className="font-mono text-lg font-bold text-primary">
                    {formatRupiah(order.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
