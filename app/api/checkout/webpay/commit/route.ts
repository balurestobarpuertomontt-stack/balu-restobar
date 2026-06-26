import { NextRequest, NextResponse } from "next/server";
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk";
import { saveOrder } from "@/lib/db";

const commerceCode = process.env.WEBPAY_COMMERCE_CODE || "";
const apiKey = process.env.WEBPAY_API_KEY || "";

let tx: any;
if (commerceCode && apiKey) {
  tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, Environment.Production));
} else {
  tx = new WebpayPlus.Transaction(new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  ));
}

async function handleCommit(request: NextRequest) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";

  let token = url.searchParams.get("token_ws") || "";

  // If POST, check form data
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      token = (formData.get("token_ws") as string) || token;
    } catch {
      // Ignorar si no hay form-data
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!token) {
    console.error("Webpay commit error: Missing token_ws");
    return NextResponse.redirect(`${siteUrl}/#carta`);
  }

  try {
    const response = await tx.commit(token);

    // If transaction is approved:
    // response.status should be 'AUTHORIZED' and response_code should be 0
    const isApproved = response.status === "AUTHORIZED" && response.response_code === 0;

    if (isApproved) {
      // Update order status in db
      await saveOrder({
        id: orderId,
        status: "confirmed",
      });

      return NextResponse.redirect(`${siteUrl}/checkout/success?orderId=${orderId}&token=${token}&method=webpay`);
    } else {
      console.warn("Webpay transaction rejected:", response);
      await saveOrder({
        id: orderId,
        status: "cancelled",
      });
      return NextResponse.redirect(`${siteUrl}/#carta`);
    }
  } catch (error) {
    console.error("Webpay commit processing failed:", error);
    return NextResponse.redirect(`${siteUrl}/#carta`);
  }
}

export async function GET(request: NextRequest) {
  return handleCommit(request);
}

export async function POST(request: NextRequest) {
  return handleCommit(request);
}
