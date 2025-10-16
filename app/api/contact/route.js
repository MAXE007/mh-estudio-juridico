// app/api/contact/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// 👇 Asegura runtime Node (en Netlify/Next puede irse a Edge)
export const runtime = 'nodejs';



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

    const apiKey = process.env.RESEND_API_KEY;
    const to     = process.env.RESEND_TO  || 'mhestudiojuridicomza@gmail.com';

    // 👇 Para PRUEBAS: usar onboarding@resend.dev (no requiere dominio verificado)
    // Cuando verifiques tu dominio, cambiá por "forms@tudominio.com"
    const from   = process.env.RESEND_FROM || 'onboarding@resend.dev';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Falta configurar RESEND_API_KEY en .env / Netlify.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const subject = `Nueva consulta web – ${nombre}${area ? ` (${area})` : ''}`;

    const html = `
      <h2>Consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(telefono || '-')}</p>
      <p><strong>Área:</strong> ${escapeHtml(area || '-')}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space:pre-line">${escapeHtml(mensaje)}</p>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: email,
    });

    if (error) {
      // 👇 Log server-side (lo ves en la consola local o logs de Netlify)
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'No se pudo enviar el email', details: error },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('API /contact error:', e);
    return NextResponse.json(
      { error: 'Error inesperado', details: String(e) },
      { status: 500 }
    );
  }
}

function escapeHtml(str = '') {
  return str
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}


console.log('RESEND_API_KEY loaded?', process.env.RESEND_API_KEY?.slice(0, 6) + '…');