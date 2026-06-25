import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem, PaymentMethod } from "@/types";
import { DELIVERY_FEE } from "@/lib/constants";

interface CartState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  items: CartItem[];
  discount: number;
  discountCode: string;
  tip: number;
  tipPercent: number;
  deliveryEnabled: boolean;
  couponApplied: boolean;
  loyaltyPoints: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setTipPercent: (percent: number) => void;
  setDeliveryEnabled: (enabled: boolean) => void;
  applyCoupon: (code: string) => boolean;
  clearCart: () => void;
  getSubtotal: () => number;
  getDelivery: () => number;
  getTip: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const VALID_COUPONS: Record<string, number> = {
  BALU10: 0.1,
  AMIGOS15: 0.15,
  BIENVENIDO: 0.05,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),

      items: [],
      discount: 0,
      discountCode: "",
      tip: 0,
      tipPercent: 0,
      deliveryEnabled: false,
      couponApplied: false,
      loyaltyPoints: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      setTipPercent: (percent) => {
        set({ tipPercent: percent });
      },

      setDeliveryEnabled: (enabled) => {
        set({ deliveryEnabled: enabled });
      },

      applyCoupon: (code) => {
        const upper = code.toUpperCase().trim();
        const rate = VALID_COUPONS[upper];
        if (!rate) return false;
        const subtotal = get().getSubtotal();
        set({
          discount: Math.round(subtotal * rate),
          discountCode: upper,
          couponApplied: true,
        });
        return true;
      },

      clearCart: () => {
        set({
          items: [],
          discount: 0,
          discountCode: "",
          tipPercent: 0,
          couponApplied: false,
        });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getDelivery: () => {
        return get().deliveryEnabled ? DELIVERY_FEE : 0;
      },

      getTip: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * (get().tipPercent / 100));
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const delivery = get().getDelivery();
        const tip = get().getTip();
        return subtotal - get().discount + delivery + tip;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: "balu-cart" }
  )
);

export { VALID_COUPONS };
export type { PaymentMethod };
