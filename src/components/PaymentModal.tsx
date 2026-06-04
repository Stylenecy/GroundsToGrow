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
    if (status !== "idle") return; // Prevent double submit
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
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-card shadow-2xl animate-in zoom-in-95 duration-200 border border-border">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <ShieldCheck className="size-5" />
            <span className="font-semibold text-sm tracking-wide">SECURE CHECKOUT</span>
          </div>
          {status === "idle" && (
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-border text-muted-foreground hover:text-foreground transition-all">
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
              <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-success/10 mb-6">
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-20" />
                <CheckCircle2 className="size-10 text-success relative z-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Pembayaran Berhasil</h3>
              <p className="text-muted-foreground mt-2 text-sm">Meneruskan ke halaman sukses...</p>
            </div>
          ) : status === "processing" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
              <Loader2 className="size-12 animate-spin text-primary mb-6" />
              <h3 className="font-display text-2xl font-bold text-foreground">Memproses Pembayaran</h3>
              <p className="text-muted-foreground mt-2 text-sm max-w-[200px]">Mohon tunggu sebentar, jangan tutup jendela ini.</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Tagihan</p>
                <p className="font-mono text-4xl font-bold text-foreground tracking-tight">
                  {formatRupiah(amount)}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-sm font-semibold text-foreground mb-3">Pilih Metode Pembayaran</p>
                
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
                      "flex w-full items-center gap-3 rounded-xl border p-4 transition-all active:scale-[0.98]",
                      method === opt.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-transparent hover:bg-surface hover:border-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-full transition-colors",
                      method === opt.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-surface text-muted-foreground"
                    )}>
                      <opt.icon className="size-5" />
                    </div>
                    <span className={cn("font-medium", method === opt.id ? "text-foreground" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                    {method === opt.id && (
                      <div className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full rounded-full h-14 text-base font-semibold shadow-md active:scale-[0.98] transition-transform"
                onClick={handlePay}
              >
                Bayar Sekarang
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

