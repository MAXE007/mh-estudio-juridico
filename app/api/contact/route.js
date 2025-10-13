// app/api/contact/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  area: z.string().optional(),
  mensaje: z.string().min(10),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parse = schema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parse.error.flatten() },
        { status: 400 }
      );
    }

    const { nombre, email, telefono, area, mensaje } = parse.data;

    // Si aún no configuraste Resend, devolvemos un mensaje claro:
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.RESEND_TO || 'mhestudiojuridicomza@gmail.com';
    const from = process.env.RESEND_FROM || 'contacto@tudominio.com';

    if (!apiKey) {
      // Podés descomentar esto si querés permitir un fallback de mailto, pero por API no corresponde.
      return NextResponse.json(
        {
          error:
            'Falta configurar RESEND_API_KEY en .env.local. Mensaje no enviado.',
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const subject = `Nueva consulta web – ${nombre}${area ? ` (${area})` : ''}`;

    const html = `
      <h2>Consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono || '-'}</p>
      <p><strong>Área:</strong> ${area || '-'}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space:pre-line">${mensaje}</p>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: email,
    });

    if (error) {
      return NextResponse.json(
        { error: 'No se pudo enviar el email', details: error },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error inesperado', details: String(e) },
      { status: 500 }
    );
  }
}
