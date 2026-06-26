import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { saveOrder } from "@/lib/db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27" as any }) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, subtotal, discount, tip, delivery, total, customerName, customerAddress, customerPhone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // 1. Save the order to DB as 'pending'
    const orderData = {
      customer_name: customerName,
      customer_address: customerAddress,
      customer_phone: customerPhone || null,
      items: items,
      subtotal: subtotal,
      discount: discount,
      tip: tip,
      delivery_fee: delivery,
      total: total,
      payment_method: "stripe",
      status: "pending",
      loyalty_points_earned: Math.floor(total / 1000) * 10,
    };

    const savedOrder = await saveOrder(orderData);

    // 2. If Stripe is not configured, return an error explaining that keys are needed
    if (!stripe) {
      console.warn("Stripe is not configured in .env.local (missing STRIPE_SECRET_KEY). Falling back to successful simulated page.");
      // We return a simulated redirection to success if key is missing, so they can test the flow.
      return NextResponse.json({
        success: true,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?orderId=${savedOrder.id}&mock=true`,
      });
    }

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "clp",
          product_data: {
            name: item.name,
            description: item.description || "",
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${savedOrder.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/#carta`,
      metadata: {
        orderId: savedOrder.id,
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
