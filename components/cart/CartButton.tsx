"use client";

import { ShoppingBag } from "@/components/ui/Icons";
import { useCartStore } from "@/store/cart-store";

export default function CartButton() {
  const count = useCartStore((s) => s.getItemCount());
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Carrito (${count} items)`}
      className="relative p-2 rounded-full border border-white/10 hover:border-balu-gold/50 transition-colors"
    >
      <ShoppingBag className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-balu-red text-white text-[10px] font-bold rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
