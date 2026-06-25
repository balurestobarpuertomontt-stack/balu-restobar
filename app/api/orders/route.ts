import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("orders").insert({
        customer_name: body.customerName,
        customer_address: body.customerAddress,
        items: body.items,
        subtotal: body.subtotal,
        discount: body.discount ?? 0,
        tip: body.tip ?? 0,
        delivery_fee: body.delivery ?? 0,
        total: body.total,
        payment_method: body.paymentMethod,
        coupon_code: body.couponCode ?? null,
        loyalty_points_earned: Math.floor(body.total / 1000) * 10,
      });

      if (error) {
        console.error("Supabase order error:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
