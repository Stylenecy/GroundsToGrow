import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Leaf, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[85vh] bg-surface flex flex-col items-center justify-center p-4 py-20">
      <div className="max-w-md w-full bg-card rounded-[24px] shadow-lg border border-border p-8 md:p-10 text-center animate-in zoom-in-95 duration-500 fade-in">
        
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-success/10 mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-20" />
          <CheckCircle2 className="size-12 text-success relative z-10" />
        </div>

        <h1 className="font-display text-4xl font-bold text-foreground mb-4">Pesanan Berhasil!</h1>
        <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
          Terima kasih telah berkontribusi dalam ekonomi sirkular. Pesanan Anda sedang diproses dan akan segera dikirimkan.
        </p>

        <div className="bg-surface/50 rounded-2xl p-5 mb-8 text-left space-y-4 border border-border">
          <div className="flex items-start gap-3">
            <Package className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Status Pesanan</p>
              <p className="text-xs text-muted-foreground mt-0.5">Menunggu Konfirmasi Penjual</p>
            </div>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="flex items-start gap-3">
            <Leaf className="size-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Dampak Positif</p>
              <p className="text-xs text-success mt-0.5">Anda telah membantu mengurangi jejak karbon hari ini!</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/orders" className="block w-full">
            <Button className="w-full rounded-full h-14 text-base font-semibold shadow-md">
              Lacak Pesanan Saya
            </Button>
          </Link>
          <Link href="/marketplace" className="block w-full">
            <Button variant="outline" className="w-full rounded-full h-14 text-base font-medium text-muted-foreground hover:text-foreground">
              Kembali Belanja <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in delay-300">
        <ShieldCheck className="size-4 text-success" /> Transaksi aman dan terenkripsi
      </div>
    </div>
  );
}
