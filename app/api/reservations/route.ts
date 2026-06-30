import { NextResponse } from "next/server";
import { saveReservation } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const reservationData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      date: body.date,
      time: body.time,
      guests: parseInt(body.guests, 10),
      notes: body.notes ?? null,
    };

    const saved = await saveReservation(reservationData);

    // Enviar correo de confirmación al cliente
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #c9a227;">¡Hola ${reservationData.name}!</h2>
        <p>Tu solicitud de reserva en <strong>Balu Restobar</strong> ha sido recibida con éxito.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>📅 Fecha:</strong> ${reservationData.date}</p>
          <p><strong>⏰ Hora:</strong> ${reservationData.time}</p>
          <p><strong>👥 Personas:</strong> ${reservationData.guests}</p>
          ${reservationData.notes ? `<p><strong>📝 Notas:</strong> ${reservationData.notes}</p>` : ''}
        </div>
        <p>Nos contactaremos contigo en breve si necesitamos validar información adicional. ¡Te esperamos!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">Balu Restobar - Quillota 180, Puerto Montt</p>
      </div>
    `;

    await sendEmail({
      to: reservationData.email,
      subject: "Confirmación de Reserva - Balu Restobar",
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Reservation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
