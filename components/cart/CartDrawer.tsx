"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Tag } from "@/components/ui/Icons";
import { useCartStore } from "@/store/cart-store";
import { formatCLP } from "@/lib/utils";
import { LOYALTY_POINTS_PER_1000 } from "@/lib/constants";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const open = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const {
    items,
    discount,
    discountCode,
    tipPercent,
    deliveryEnabled,
    couponApplied,
    updateQuantity,
    removeItem,
    setTipPercent,
    setDeliveryEnabled,
    applyCoupon,
    getSubtotal,
    getDelivery,
    getTip,
    getTotal,
  } = useCartStore();

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput);
    if (!ok) {
      setCouponError("Cupón inválido");
      setTimeout(() => setCouponError(""), 3000);
    } else {
      setCouponError("");
      setCouponInput("");
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-balu-charcoal border-l border-white/10 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="font-display text-xl">Tu Pedido</h2>
                <button onClick={() => setOpen(false)} aria-label="Cerrar carrito">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <p className="text-neutral-500 text-center py-12">Tu carrito está vacío</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-balu-gold text-sm">{formatCLP(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded border border-white/10 hover:border-balu-gold/50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded border border-white/10 hover:border-balu-gold/50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="p-1 text-neutral-600 hover:text-balu-red">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/5 space-y-4">
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Cupón de descuento"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-balu-gold"
                    />
                    <button
                      onClick={handleCoupon}
                      className="px-3 py-2 border border-balu-gold/30 rounded-lg text-balu-gold text-sm hover:bg-balu-gold/10"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-green-500 text-xs">Cupón {discountCode} aplicado</p>
                  )}
                  {couponError && <p className="text-balu-red text-xs">{couponError}</p>}

                  <label className="flex items-center gap-2 text-sm text-neutral-400">
                    <input
                      type="checkbox"
                      checked={deliveryEnabled}
                      onChange={(e) => setDeliveryEnabled(e.target.checked)}
                      className="accent-balu-gold"
                    />
                    Despacho a domicilio (+{formatCLP(2500)})
                  </label>

                  <div>
                    <p className="text-xs text-neutral-500 mb-2">Propina</p>
                    <div className="flex gap-2">
                      {[0, 10, 15, 20].map((p) => (
                        <button
                          key={p}
                          onClick={() => setTipPercent(p)}
                          className={`flex-1 py-1.5 rounded text-xs transition ${
                            tipPercent === p
                              ? "bg-balu-gold text-balu-dark font-semibold"
                              : "border border-white/10 text-neutral-400"
                          }`}
                        >
                          {p === 0 ? "No" : `${p}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span><span>{formatCLP(getSubtotal())}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Descuento</span><span>-{formatCLP(discount)}</span>
                      </div>
                    )}
                    {deliveryEnabled && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Despacho</span><span>{formatCLP(getDelivery())}</span>
                      </div>
                    )}
                    {tipPercent > 0 && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Propina ({tipPercent}%)</span><span>{formatCLP(getTip())}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-balu-gold/80 text-xs pt-1">
                      <span>Puntos de fidelización</span>
                      <span>+{Math.floor(getTotal() / 1000) * LOYALTY_POINTS_PER_1000} pts</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-white/5">
                      <span>Total</span><span className="text-balu-gold">{formatCLP(getTotal())}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setOpen(false); setCheckoutOpen(true); }}
                    className="w-full py-3.5 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Checkout Rápido
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
