import { getOrders, saveOrder } from "@/lib/db";
import { formatCLP } from "@/lib/utils";
import { CheckCircle, ShoppingBag, ArrowRight } from "@/components/ui/Icons";
import Link from "next/link";
import { buildOrderWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem, PaymentMethod } from "@/types";
import Stripe from "stripe";
import { MercadoPagoConfig, Payment } from "mercadopago";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27" as any }) : null;

const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
const mpConfig = mpAccessToken ? new MercadoPagoConfig({ accessToken: mpAccessToken }) : null;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const mock = params.mock === "true";

  // Extra query params for payment confirmation
  const sessionId = typeof params.session_id === "string" ? params.session_id : "";
  const mpStatus = typeof params.status === "string" ? params.status : "";
  const mpCollectionStatus = typeof params.collection_status === "string" ? params.collection_status : "";

  const orders = await getOrders();
  const order = orders.find((o: any) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-balu-dark flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-balu-red mb-2">Pedido No Encontrado</h1>
        <p className="text-neutral-400 mb-6">No pudimos cargar los detalles de este pedido.</p>
        <Link href="/" className="px-6 py-2.5 bg-balu-gold text-balu-dark font-semibold rounded-lg">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  // Lógica de confirmación de pago si el pedido está "pending"
  if (order.status === "pending") {
    if (order.payment_method === "stripe") {
      if (sessionId) {
        if (stripe) {
          try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status === "paid") {
              order.status = "confirmed";
              await saveOrder(order);
            }
          } catch (err) {
            console.error("Error al validar sesión de Stripe:", err);
          }
        } else {
          // Modo simulación (Stripe no configurado pero viene session_id)
          console.warn("Stripe no está configurado. Confirmando pedido en modo simulación.");
          order.status = "confirmed";
          await saveOrder(order);
        }
      } else if (mock) {
        order.status = "confirmed";
        await saveOrder(order);
      }
    } else if (order.payment_method === "mercadopago") {
      const isMpApproved = mpStatus === "approved" || mpCollectionStatus === "approved";
      if (isMpApproved) {
        if (mpConfig) {
          try {
            const paymentId = typeof params.payment_id === "string" ? params.payment_id : "";
            if (paymentId) {
              const paymentClient = new Payment(mpConfig);
              const paymentDetail = await paymentClient.get({ id: paymentId });
              if (paymentDetail.status === "approved") {
                order.status = "confirmed";
                await saveOrder(order);
              }
            } else {
              // Si no viene payment_id pero el status es approved, confiamos en el parámetro de retorno
              order.status = "confirmed";
              await saveOrder(order);
            }
          } catch (err) {
            console.error("Error al validar pago de Mercado Pago con API:", err);
            // Fallback a confiar en los parámetros de la URL
            order.status = "confirmed";
            await saveOrder(order);
          }
        } else {
          // Modo simulación
          console.warn("Mercado Pago no está configurado. Confirmando pedido en modo simulación.");
          order.status = "confirmed";
          await saveOrder(order);
        }
      } else if (mock) {
        order.status = "confirmed";
        await saveOrder(order);
      }
    }
  }

  // Formatting WhatsApp order message details
  const itemsMapped: CartItem[] = order.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    price: item.price,
    quantity: item.quantity,
    category: item.category,
  }));

  const whatsappMessage = buildOrderWhatsAppMessage({
    items: itemsMapped,
    subtotal: order.subtotal,
    discount: order.discount || 0,
    tip: order.tip || 0,
    delivery: order.delivery_fee || 0,
    total: order.total,
    customerName: order.customer_name,
    customerAddress: order.customer_address,
    paymentMethod: order.payment_method as PaymentMethod,
  });

  const waUrl = getWhatsAppUrl(whatsappMessage);

  // Dynamic status messages
  let statusMessage = "Tu transacción ha sido procesada de manera segura.";
  if (order.status === "confirmed") {
    statusMessage = "El pago ha sido verificado y tu pedido está confirmado.";
  } else if (order.status === "pending") {
    statusMessage = "Tu pedido ha sido registrado y está pendiente de pago o confirmación manual.";
  } else if (order.status === "cancelled") {
    statusMessage = "Esta transacción ha sido cancelada o rechazada.";
  }

  if (mock) {
    statusMessage = "Simulación completada con éxito. El pedido ha sido verificado y confirmado.";
  }

  return (
    <div className="min-h-screen bg-balu-dark text-neutral-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-balu-gold/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-balu-red/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-xl p-8 bg-balu-charcoal/80 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl relative text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-balu-gold/10 border border-balu-gold/30 mb-6 text-balu-gold">
          <CheckCircle className="h-8 w-8" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">¡Pedido Confirmado!</h1>
        <p className="text-neutral-400 text-sm mb-6">
          {statusMessage}
        </p>

        {/* Info card */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between text-xs text-neutral-500">
            <span>PEDIDO ID</span>
            <span className="font-mono text-neutral-300">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Cliente</span>
            <span className="font-medium text-neutral-200">{order.customer_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Dirección</span>
            <span className="font-medium text-neutral-200">{order.customer_address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Método de pago</span>
            <span className="font-medium text-balu-gold uppercase">{order.payment_method}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
            <span className="text-neutral-400">
              {order.status === "confirmed" ? "Total Pagado" : "Total a Pagar"}
            </span>
            <span className="text-lg font-bold text-balu-gold">{formatCLP(order.total)}</span>
          </div>
          <div className="flex justify-between text-xs text-green-500 font-semibold pt-1">
            <span>Puntos acumulados</span>
            <span>+{order.loyalty_points_earned || 0} Puntos</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display text-lg mb-3">Detalle de Productos</h3>
          <div className="max-h-36 overflow-y-auto space-y-2 pr-2 text-sm text-left">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium text-neutral-200">{formatCLP(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white font-semibold rounded-lg hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" /> Enviar Detalles a WhatsApp
          </a>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-1 py-3 text-neutral-400 hover:text-balu-gold text-sm font-medium transition"
          >
            Volver al Menú Principal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
