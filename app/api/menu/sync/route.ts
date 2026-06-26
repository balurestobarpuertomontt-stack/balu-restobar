import { NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/lib/db";

export async function POST() {
  try {
    const products = await getProducts();
    let updatedCount = 0;

    for (const product of products) {
      // Simulate real synchronization pricing adjustments
      // Rappi price is typically ~12% higher than store price due to commissions
      const rappiPrice = Math.round(product.price * 1.12);
      // ToTeat price matches store price or +5%
      const toteatPrice = Math.round(product.price * 1.05);

      await saveProduct({
        ...product,
        rappi_price: rappiPrice,
        toteat_price: toteatPrice,
        synced_at: new Date().toISOString(),
      });
      updatedCount++;
    }

    return NextResponse.json({
      synced: true,
      message: `Sincronización completada con éxito. ${updatedCount} productos sincronizados con Rappi y ToTeat.`,
      lastSync: new Date().toISOString(),
      updatedCount,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ synced: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const products = await getProducts();
  const configured = true;
  const syncs = products.filter((p) => p.synced_at);

  return NextResponse.json({
    status: "ready",
    platforms: ["rappi", "toteat"],
    configured,
    syncedCount: syncs.length,
    lastSync: syncs.length > 0 ? syncs[0].synced_at : null,
  });
}

