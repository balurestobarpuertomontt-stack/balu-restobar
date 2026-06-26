import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderData = {
      customer_name: body.customerName,
      customer_address: body.customerAddress,
      customer_phone: body.customerPhone || null,
      items: body.items,
      subtotal: body.subtotal,
      discount: body.discount ?? 0,
      tip: body.tip ?? 0,
      delivery_fee: body.delivery ?? 0,
      total: body.total,
      payment_method: body.paymentMethod,
      coupon_code: body.couponCode ?? null,
      loyalty_points_earned: Math.floor(body.total / 1000) * 10,
    };

    const saved = await saveOrder(orderData);

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

