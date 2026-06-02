import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[85vh] bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-[24px] shadow-sm border border-border p-8 text-center animate-in zoom-in-95 duration-500 fade-in">
        
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/10 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-20" />
          <CheckCircle2 className="size-10 text-success relative z-10" />
        </div>
        
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">Pesanan Berhasil!</h1>
        <p className="text-muted-foreground mb-8">
          Terima kasih telah berkontribusi dalam ekonomi sirkular. Pesanan Anda sedang diproses dan akan segera dikirimkan.
        </p>

        <div className="bg-surface rounded-xl p-4 mb-8 text-left space-y-3">
          <div className="flex items-center gap-3">
            <Package className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Status Pesanan</p>
              <p className="text-xs text-muted-foreground">Menunggu Konfirmasi Penjual</p>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex items-center gap-3">
            <Leaf className="size-5 text-success" />
            <div>
              <p className="text-sm font-medium">Dampak Lingkungan</p>
              <p className="text-xs text-muted-foreground">Anda telah membantu mengurangi jejak karbon!</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/dashboard" className="block w-full">
            <Button className="w-full rounded-full h-12">
              Lacak Pesanan
            </Button>
          </Link>
          <Link href="/marketplace" className="block w-full">
            <Button variant="outline" className="w-full rounded-full h-12 text-muted-foreground">
              Kembali Belanja <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
