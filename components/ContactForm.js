'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  nombre: z.string().min(2, 'Ingresá tu nombre'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  area: z.string().optional().transform((v) => v || ''),
  mensaje: z.string().min(10, 'Contanos un poco más (mín. 10 caracteres)'),
});

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nombre: '', email: '', telefono: '', area: '', mensaje: '' },
  });

  async function onSubmit(values) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.error || 'No pudimos enviar tu mensaje.'); return; }
      alert('¡Gracias! Tu consulta fue enviada con éxito.');
      reset();
    } catch {
      alert('Error de red. Intentá nuevamente.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: 20 }}>
      <div className="form-row">
        <input className="input" placeholder="Nombre y apellido" aria-label="Nombre y apellido" {...register('nombre')} />
        {errors.nombre && <p className="error">{errors.nombre.message}</p>}
      </div>

      <div className="form-row">
        <input className="input" placeholder="Email" type="email" aria-label="Email" {...register('email')} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="form-row" style={{ display:'grid', gap:12, gridTemplateColumns: '1fr' }}>
        <input className="input" placeholder="Teléfono" aria-label="Teléfono" {...register('telefono')} />
        <select className="select" aria-label="Área de consulta" defaultValue="" {...register('area')}>
          <option value="" disabled>Área de consulta</option>
          <option>Derecho Laboral</option>
          <option>Derecho Civil</option>
          <option>Derecho Comercial</option>
          <option>Consumidor</option>
          <option>Otro</option>
        </select>
      </div>

      <div className="form-row">
        <textarea className="textarea" placeholder="Contanos brevemente tu situación" aria-label="Mensaje" {...register('mensaje')} />
        {errors.mensaje && <p className="error">{errors.mensaje.message}</p>}
      </div>

      <div className="form-row" style={{ display:'flex', gap:12 }}>
        <button className="btn btn-cta" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Enviar'}
        </button>
      </div>

      {isSubmitSuccessful && (
        <p className="form-row" style={{ color: '#157f3b', fontSize: 14 }}>
          ¡Enviado! Te contactaremos a la brevedad.
        </p>
      )}
    </form>
  );
}
