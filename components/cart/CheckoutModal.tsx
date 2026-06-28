"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@/components/ui/Icons";
import { useCartStore } from "@/store/cart-store";
import { buildOrderWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { formatCLP } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "webpay", label: "Webpay Plus" },
  { id: "mercadopago", label: "Mercado Pago" },
  { id: "stripe", label: "Stripe (Tarjeta)" },
  { id: "transferencia", label: "Transferencia Bancaria" },
  { id: "whatsapp", label: "Coordinar por WhatsApp" },
];

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("whatsapp");
  const [loading, setLoading] = useState(false);

  const store = useCartStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      items: store.items,
      subtotal: store.getSubtotal(),
      discount: store.discount,
      tip: store.getTip(),
      delivery: store.getDelivery(),
      total: store.getTotal(),
      customerName: name,
      customerAddress: address,
      paymentMethod: payment,
    };

    try {
      if (payment === "whatsapp" || payment === "transferencia") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        
        if (res.ok) {
          const json = await res.json();
          const orderId = json.data?.id || "";
          store.clearCart();
          onClose();
          window.location.href = `/checkout/success?orderId=${orderId}&method=${payment}`;
        } else {
          throw new Error("Error creating order");
        }
      } else if (payment === "stripe") {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (res.ok) {
          const json = await res.json();
          store.clearCart();
          onClose();
          window.location.href = json.url;
        } else {
          throw new Error("Stripe error");
        }
      } else if (payment === "webpay") {
        const res = await fetch("/api/checkout/webpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (res.ok) {
          const json = await res.json();
          store.clearCart();
          onClose();
          // Transbank redirect format: URL + ?token_ws=token
          window.location.href = `${json.url}?token_ws=${json.token}`;
        } else {
          throw new Error("Webpay error");
        }
      } else if (payment === "mercadopago") {
        const res = await fetch("/api/checkout/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (res.ok) {
          const json = await res.json();
          store.clearCart();
          onClose();
          window.location.href = json.url;
        } else {
          throw new Error("Mercado Pago error");
        }
      }
    } catch (error) {
      console.error("Payment redirect failed:", error);
      alert("Hubo un problema al iniciar el pago. Por favor intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-balu-charcoal border border-white/10 rounded-2xl z-[70] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-display text-xl">Checkout</h2>
              <button onClick={onClose}><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Nombre</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Dirección</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none"
                  placeholder="Dirección de entrega o 'Retiro en local'"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">
                  Método de pago
                </label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        payment === m.id
                          ? "border-balu-gold bg-balu-gold/5"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                        className="accent-balu-gold"
                      />
                      <span className="text-sm">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span className="text-balu-gold">{formatCLP(store.getTotal())}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 ${
                    payment === "whatsapp"
                      ? "bg-[#25D366] text-white"
                      : "bg-balu-gold text-balu-dark"
                  }`}
                >
                  {loading ? "Procesando..." : 
                    payment === "whatsapp"
                      ? "Confirmar pedido vía WhatsApp"
                      : payment === "transferencia"
                      ? "Confirmar pedido (Transferencia)"
                      : payment === "stripe"
                      ? "Pagar con Stripe (Tarjeta)"
                      : payment === "webpay"
                      ? "Pagar con Webpay Plus"
                      : payment === "mercadopago"
                      ? "Pagar con Mercado Pago"
                      : "Confirmar pedido"
                  }
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
