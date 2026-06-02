"use client";

import { useState, useEffect } from "react";
import { CreditCard, QrCode, Building, Loader2, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, onSuccess, amount }: PaymentModalProps) {
  const [method, setMethod] = useState<"qris" | "transfer" | "cc">("qris");
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setMethod("qris");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <ShieldCheck className="size-5" />
            <span>Secure Checkout</span>
          </div>
          {status === "idle" && (
            <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5 text-muted-foreground transition-colors">
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-50">
              <div className="rounded-full bg-success/20 p-4 mb-4">
                <CheckCircle2 className="size-12 text-success" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Pembayaran Berhasil</h3>
              <p className="text-muted-foreground mt-2">Meneruskan ke halaman sukses...</p>
            </div>
          ) : status === "processing" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="size-12 animate-spin text-primary mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground">Memproses Pembayaran...</h3>
              <p className="text-muted-foreground mt-2">Mohon jangan tutup jendela ini.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Total Tagihan</p>
                <p className="font-mono text-3xl font-bold text-foreground tracking-tight mt-1">
                  {formatRupiah(amount)}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-sm font-medium text-foreground mb-2">Pilih Metode Pembayaran</p>
                
                {/* Method Options */}
                {[
                  { id: "qris", label: "QRIS", icon: QrCode },
                  { id: "transfer", label: "Virtual Account", icon: Building },
                  { id: "cc", label: "Kartu Kredit", icon: CreditCard },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMethod(opt.id as any)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-4 transition-all",
                      method === opt.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-transparent hover:bg-surface"
                    )}
                  >
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-full",
                      method === opt.id ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
                    )}>
                      <opt.icon className="size-5" />
                    </div>
                    <span className={cn("font-medium", method === opt.id ? "text-foreground" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                    {method === opt.id && (
                      <div className="ml-auto size-4 rounded-full border-[4px] border-primary" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full rounded-full h-14 text-base font-semibold"
                onClick={handlePay}
              >
                Bayar Sekarang
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
