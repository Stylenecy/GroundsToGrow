"use client";

import { X, ShoppingBag, Leaf, Sprout, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

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

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-card shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShoppingBag className="size-5" />
            Keranjang Belanja
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-surface text-muted-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-surface p-6 mb-4">
                <ShoppingBag className="size-12 text-muted-foreground opacity-50" />
              </div>
              <p className="font-display text-xl font-semibold text-foreground mb-2">Keranjang Kosong</p>
              <p className="text-muted-foreground text-sm max-w-[250px] mb-6">Mulai langkah sirkularmu dengan mencari produk atau ampas kopi.</p>
              <Link href="/marketplace" onClick={onClose}>
                <Button className="rounded-full px-8">Mulai Belanja</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border">
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium leading-tight text-sm pr-4">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {getIcon(item.type)} {item.subtitle}
                      </p>
                      <p className="mt-1 font-mono font-semibold text-sm">{formatRupiah(item.price)}</p>
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border bg-surface">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-95"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-95"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.type === "ampas" || item.type === "biji" ? "kg" : "pcs"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-surface/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-muted-foreground">Total Pembelanjaan</span>
              <span className="font-mono text-xl font-bold tracking-tight">{formatRupiah(cartTotal)}</span>
            </div>
            <Link href="/checkout" onClick={onClose} className="block w-full">
              <Button size="lg" className="w-full rounded-full h-14 font-semibold text-base shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.98]">
                Lanjut ke Checkout
              </Button>
            </Link>
          </div>
        )}

      </div>
    </>
  );
}
