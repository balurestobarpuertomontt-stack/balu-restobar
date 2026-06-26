import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { saveOrder } from "@/lib/db";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";

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
      payment_method: "mercadopago",
      status: "pending",
      loyalty_points_earned: Math.floor(total / 1000) * 10,
    };

    const savedOrder = await saveOrder(orderData);

    // 2. If Mercado Pago token is not configured, fall back to mock redirect
    if (!accessToken) {
      console.warn("Mercado Pago is not configured in .env.local (missing MERCADOPAGO_ACCESS_TOKEN). Falling back to simulated successful redirection.");
      return NextResponse.json({
        success: true,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?orderId=${savedOrder.id}&mock=true`,
      });
    }

    // 3. Configure Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: accessToken });
    const preference = new Preference(client);

    // 4. Create preference
    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.name,
          description: item.description || "",
          unit_price: Number(item.price),
          quantity: Number(item.quantity),
          currency_id: "CLP",
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?orderId=${savedOrder.id}&method=mercadopago`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/#carta`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/#carta`,
        },
        auto_return: "approved",
        external_reference: savedOrder.id,
      },
    });

    // Return production or sandbox link
    return NextResponse.json({
      success: true,
      url: result.init_point || result.sandbox_init_point,
    });
  } catch (error: any) {
    console.error("Mercado Pago preference create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
