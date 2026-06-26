import { NextRequest, NextResponse } from "next/server";
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk";
import { saveOrder } from "@/lib/db";

const commerceCode = process.env.WEBPAY_COMMERCE_CODE || "";
const apiKey = process.env.WEBPAY_API_KEY || "";

// If keys are provided, configure Transbank in production. Else, it uses sandbox integration credentials.
let tx: any;
if (commerceCode && apiKey) {
  tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, Environment.Production));
} else {
  // Sandbox integration environment
  tx = new WebpayPlus.Transaction(new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  ));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, subtotal, discount, tip, delivery, total, customerName, customerAddress, customerPhone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // 1. Create order in DB as pending
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
      payment_method: "webpay",
      status: "pending",
      loyalty_points_earned: Math.floor(total / 1000) * 10,
    };

    const savedOrder = await saveOrder(orderData);

    const buyOrder = `Balu-${savedOrder.id.substring(0, 8)}`;
    const sessionId = `Session-${savedOrder.id.substring(0, 8)}`;
    const amount = total;
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/checkout/webpay/commit?orderId=${savedOrder.id}`;

    // 2. Create Transbank Webpay Plus Transaction
    const createResponse = await tx.create(buyOrder, sessionId, amount, returnUrl);

    // createResponse has { token, url }
    return NextResponse.json({
      success: true,
      url: createResponse.url,
      token: createResponse.token,
    });
  } catch (error: any) {
    console.error("Webpay transaction create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
