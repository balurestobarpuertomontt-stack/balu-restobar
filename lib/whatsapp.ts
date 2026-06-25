import { SITE } from "@/lib/constants";
import type { CartItem, PaymentMethod } from "@/types";
import { formatCLP } from "@/lib/utils";

interface OrderMessageParams {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tip: number;
  delivery: number;
  total: number;
  customerName: string;
  customerAddress: string;
  paymentMethod: PaymentMethod;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  webpay: "Webpay Plus",
  mercadopago: "Mercado Pago",
  stripe: "Stripe (Tarjeta)",
  transferencia: "Transferencia Bancaria",
  whatsapp: "Coordinar por WhatsApp",
};

export function buildOrderWhatsAppMessage(params: OrderMessageParams): string {
  const lines = params.items.map(
    (item) => `• ${item.quantity}x ${item.name} — ${formatCLP(item.price * item.quantity)}`
  );

  let message = `Hola Balu 👋\n\nQuiero confirmar el siguiente pedido:\n\n${lines.join("\n")}\n\n`;

  if (params.discount > 0) {
    message += `Descuento: -${formatCLP(params.discount)}\n`;
  }
  if (params.tip > 0) {
    message += `Propina: ${formatCLP(params.tip)}\n`;
  }
  if (params.delivery > 0) {
    message += `Despacho: ${formatCLP(params.delivery)}\n`;
  }

  message += `\nTotal: ${formatCLP(params.total)}\n\n`;
  message += `Nombre: ${params.customerName}\n`;
  message += `Dirección: ${params.customerAddress}\n`;
  message += `Método de pago: ${PAYMENT_LABELS[params.paymentMethod]}\n\nGracias.`;

  return message;
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getQuickWhatsAppUrl(type: "reserva" | "evento" | "consulta"): string {
  const messages = {
    reserva: "Hola Balu 👋 Me gustaría reservar una mesa.",
    evento: "Hola Balu 👋 Me interesa organizar un evento privado.",
    consulta: "Hola Balu 👋 Tengo una consulta.",
  };
  return getWhatsAppUrl(messages[type]);
}
