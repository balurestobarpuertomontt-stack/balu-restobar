import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Generate a simple token (valid for 1 hour)
  const token = randomBytes(32).toString('hex');
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/reset?token=${token}`;

  // In a real app, store token+email in DB with expiry.
  // Here we just log it for demonstration.
  console.log('Password reset token for', email, token);

  // Send email if SMTP config is present
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false otherwise
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@balu-restobar.com',
    to: email,
    subject: 'Restablecimiento de contraseña - Balu Restobar',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}\n\nSi no solicitaste este cambio, ignora este correo.`,
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Si no solicitaste este cambio, ignora este correo.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    // Still return success to avoid leaking config info
    return NextResponse.json({ message: 'Email not sent (SMTP not configured), token logged on server' });
  }
}
