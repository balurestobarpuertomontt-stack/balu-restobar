import { NextResponse } from "next/server";

/**
 * Endpoint para sincronizar precios desde Rappi / ToTeat.
 * Requiere credenciales de API en variables de entorno.
 * Por ahora retorna los productos locales como fallback.
 */
export async function POST() {
  // TODO: Integrar APIs oficiales de Rappi Partner y ToTeat cuando estén disponibles
  // const rappiPrices = await fetchRappiMenu(process.env.RAPPI_STORE_ID);
  // const toteatPrices = await fetchToTeatMenu(process.env.TOTEAT_RESTAURANT_ID);

  return NextResponse.json({
    synced: false,
    message: "Sincronización pendiente — configurar credenciales Rappi/ToTeat en .env",
    lastSync: null,
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    platforms: ["rappi", "toteat"],
    configured: false,
  });
}
