'use client';
import heroBg from './assets/logo.png';
import aboutImg from './assets/oficina.jpeg';
import { useEffect, useState } from 'react';
import ContactForm from '../components/ContactForm'; // ruta relativa
import Image from "next/image";
import logo from "./assets/logo.png";

const WAPP_NUM = process.env.NEXT_PUBLIC_WAPP_NUM || '5492604205682';
const WAPP_TEXT = process.env.NEXT_PUBLIC_WAPP_TEXT || 'Hola%20quiero%20hacer%20una%20consulta';
const WAPP_URL = `https://wa.me/${WAPP_NUM}?text=${WAPP_TEXT}`;

const NAV = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#metodo', label: 'Cómo trabajamos' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Home() {
  const [active, setActive] = useState('#inicio');
  const [menuOpen, setMenuOpen] = useState(false);

  // sección activa
  useEffect(() => {
    const ids = ['#inicio', '#nosotros', '#metodo','#servicios', '#contacto'];
    const sections = ids.map((id) => document.querySelector(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if (vis?.target?.id) setActive('#' + vis.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, .25, .5, .75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // ESC para cerrar menú
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // bloquear scroll detrás del menú
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  const go = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Animar cards al entrar (mobile)
  useEffect(() => {
    // respetar usuarios que piden menos animación
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Tomamos sólo las cards de secciones (excluimos el mapa)
    const cards = Array.from(document.querySelectorAll('.section .card:not(.map-card)'));
    if (!cards.length) return;

    // Clase base + pequeño "stagger" usando una CSS var
    cards.forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger de 0–180ms; reinicia cada fila para grids
      const delay = (i % 4) * 60; // ajustá 4 según columnas típicas
      el.style.setProperty('--delay', `${delay}ms`);
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target); // una sola vez
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    cards.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);


  return (
    <main>
      {/* HEADER */}
      <header className="header">
        <div className="header-row">
          <a
            href="#inicio"
            className="brand"
            onClick={(e) => { e.preventDefault(); go('#inicio'); }}
            aria-label="Ir al inicio"
          >
            <div className="brand-badge">
              <Image
                src={logo}
                alt=""
                className="brand-logo"
                aria-hidden="true"
                priority
              />
              <span className="brand-text">MH & ASOCIADOS</span>
            </div>
          </a>

          {/* nav desktop (SIN botón WhatsApp) */}
          <nav className="nav">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); go(item.href); }}
                className={active === item.href ? 'active' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* burger (mobile) */}
          <button
            className={`burger ${menuOpen ? 'menu-open' : ''}`}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="burger-ico">
              <span className="b1"></span>
              <span className="b2"></span>
              <span className="b3"></span>
            </span>
          </button>
        </div>
      </header>

      {/* MENÚ MÓVIL FULLSCREEN (mantengo WhatsApp aquí) */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-top">
          <span style={{fontWeight:600,fontSize:14}}>Menú</span>
          <button className="burger" aria-label="Cerrar" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <nav className="mobile-links">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => { e.preventDefault(); go(item.href); }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* HERO */}
      <section id="inicio" className="hero">
        {/* Capa 0: imagen de fondo */}
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${heroBg.src})` }}
        />

        {/* Capa 2: contenido */}
        <div className="container hero-inner">
          <h1 className="hero-title">
            MH &amp; ASOCIADOS
            <br />
          </h1>
          <h2 className="hero-title2">Estudio Jurídico</h2>
          <div>
            <a href={WAPP_URL} target="_blank" rel="noopener" className="btn btn-cta btn-hero">
              Solicitar consulta
            </a>
          </div>
        </div>
      </section>


      {/* NOSOTROS */}
      <section id="nosotros" className="section about">
        <h2 className="h2-about">Nosotros</h2>
        <div className="about-grid" style={{ '--about': `url(${aboutImg.src})` }}>

          <div className="about-text">
            <p className="mt-2">
              En MH & ASOCIADOS brindamos asesoramiento legal integral con un enfoque humano, claro y cercano. Escuchamos cada caso en detalle, diseñamos una estrategia a medida y acompañamos a nuestros clientes durante todo el proceso con comunicación transparente y plazos realistas. Nuestro equipo combina experiencia en Derecho Laboral, Civil, y Comercial, sumando actualización permanente en normativa y jurisprudencia para ofrecer soluciones prácticas y sostenibles. Creemos en la prevención de conflictos, la negociación eficaz y, cuando corresponde, una litigación firme y técnica, siempre priorizando los intereses de quienes confían en nosotros.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-2-md grid-4-lg">
          {[
            { t: 'Responsabilidad', d: 'Compromiso total con cada caso y cliente.' },
            { t: 'Accesibilidad', d: 'Servicios jurídicos al alcance de todos.' },
            { t: 'Compromiso social', d: 'Defensa de tus derechos con ética.' },
            { t: 'Formación continua', d: 'Actualización constante del equipo.' },
          ].map((x, i) => (
            <div key={i} className="card">
              <h3>{x.t}</h3>
              <p className="mt-2">{x.d}</p>
            </div>
          ))}
        </div>
      </section>


      {/* MÉTODO */}
      <section id="metodo" className="section">
        <div className="work">
          <h2 className="h2-sub">Cómo trabajamos</h2>
          <div className="mt-6 grid grid-3-md">
            {[
              { t: 'Análisis personalizado', d: 'Estudio profundo del caso y estrategia efectiva.' },
              { t: 'Seguimiento claro', d: 'Información periódica para tu tranquilidad.' },
              { t: 'Representación sólida', d: 'Negociación y litigio con foco en resultados.' },
            ].map((x, i) => (
              <div key={i} className="card">
                <h3>{x.t}</h3>
                <p className="mt-2">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS */}
      <section id="servicios" className="section">
        <div className="area">
          <h2 className="h2-sub">Áreas de práctica</h2>
          <p className="mt-2" style={{color:'#606060'}}>
            Atendemos tu consulta de forma integral y en lenguaje claro. Si tu caso no encaja exactamente aquí, escribinos y te orientamos.
          </p>
          <div className="mt-6 grid grid-2-md">
            {[
              { t: 'Derecho Laboral', d: 'Despidos, diferencias salariales, trabajo no registrado, acoso laboral.' },
              { t: 'Derecho Civil', d: 'Divorcios, sucesiones, contratos, daños y perjuicios, alquileres.' },
              { t: 'Derecho Comercial', d: 'Tarjetas, créditos, cheques, pagarés, contratos comerciales.' },
            ].map((x, i) => (
              <article key={i} className="card" style={{padding:24}}>
                <h3>{x.t}</h3>
                <p className="mt-2">{x.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section">
        <div className="people">
          <h2 className="h2-sub">Testimonios</h2>
          <div className="mt-6 grid grid-2-md">
            {[
              { q: '“Solución rápida y favorable, excelente trato humano.”', a: 'Eduardo R. M.' },
              { q: '“Apoyo profesional y empático en todo momento.”', a: 'María L. G.' },
              { q: '“Resolvieron un caso complejo con claridad.”', a: 'Laura O.' },
              { q: '“Recuperamos lo que nos correspondía por derecho.”', a: 'Laboratorios B.' },
            ].map((x, i) => (
              <blockquote key={i} className="card" style={{padding:24}}>
                <p>{x.q}</p>
                <footer className="mt-2">{x.a}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="section-lg">
        <div className="contact">
          <h2 className="h2-sub">Contacto</h2>
          <p className="mt-2" style={{color:'#606060'}}>Dejanos tu consulta y te respondemos a la brevedad.</p>

          <div className="mt-8 contact-grid">
            <div>
              <ContactForm />
            </div>
            <aside>
              <div className="card map-card">
                <h3 style={{margin:0, fontWeight:600}}>Información de contacto</h3>
                <ul className="mt-3" style={{listStyle:'none', padding:0, margin:0, color:'#575757', fontSize:14}}>
                  <li><strong>Tel:</strong> 2604-205682</li>
                  <li><strong>Email:</strong> mhestudiojuridicomza@gmail.com</li>
                  <li><strong>Dirección:</strong> Lugones 211, San Rafael, Mendoza, Argentina.</li>
                  <li><strong>Horario:</strong> Lun a Vie 8–16 h</li>
                </ul>

                <a href={WAPP_URL} target="_blank" rel="noopener" className="btn btn-cta mt-3">
                  Escribir por WhatsApp
                </a>

                {/* Mapa más grande */}
                <div className="map-embed">
                  <iframe
                    title="Ubicación MH ESTUDIO JURÍDICO Y ASOCIADOS"
                    src="https://www.google.com/maps?q=Lugones%20211,%20San%20Rafael,%20Mendoza,%20Argentina&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <a
                  href="https://www.google.com/maps?q=Lugones%20211,%20San%20Rafael,%20Mendoza,%20Argentina"
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline mt-3"
                >
                  Ver en Google Maps
                </a>

                <p className="mt-3" style={{fontSize:12, color:'#868686'}}>
                  Al enviar una consulta aceptás nuestra política de privacidad.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* PREVIEW – PREGUNTAS FRECUENTES */}
      <section id="faq" className="section faq-preview">
        <div className="container">
          <h2 className="h2-sub">Preguntas frecuentes</h2>

          {/* Toggle sin JS para expandir/contraer */}
          <input id="faqExpand" type="checkbox" className="faq-toggle" />

          {/* Wrapper con “clamp” + fade que se quita al expandir */}
          <div className="faq-wrap">
            <div className="faq-grid">
              {/* Grupo 1 */}
              <details className="faq-item card">
                <summary>¿La primera consulta tiene costo?</summary>
                <p className="mt-2">Ofrecemos una primera asesoría gratuita. Si el caso requiere análisis documental o reunión, te informamos el costo antes de avanzar.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Cómo pactan los honorarios?</summary>
                <p className="mt-2">Según normativa local, complejidad y etapas. Siempre por escrito y con total transparencia.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Puedo pagar en cuotas?</summary>
                <p className="mt-2">En muchos casos sí. Definimos un plan acorde a las etapas del proceso.</p>
              </details>
              {/* Grupo 2 */}
              <details className="faq-item card">
                <summary>¿Atienden casos de todo el país?</summary>
                <p className="mt-2">Atendemos consultas remotas y priorizamos causas de la región. Si tu caso es de otra jurisdicción, te orientamos o derivamos.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Trabajan de forma online?</summary>
                <p className="mt-2">Sí: videollamadas, firma digital y envío seguro de documentación.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Cuánto tarda mi trámite/jucio?</summary>
                <p className="mt-2">Depende del tipo de asunto y del juzgado. Te damos una estimación realista al evaluar el caso.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Puedo seguir el avance del caso?</summary>
                <p className="mt-2">Sí. Mantenemos un canal de actualización periódica por el medio que prefieras.</p>
              </details>

              {/* Grupo 3 */}
              <details className="faq-item card">
                <summary>¿Qué documentación necesito?</summary>
                <p className="mt-2">DNI y todo soporte de tu situación (contratos, recibos, mails, notificaciones). Si no lo tenés completo, te indicamos cómo conseguirlo.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Qué pasa si me despiden?</summary>
                <p className="mt-2">No firmes nada sin revisar. Escribinos y evaluamos indemnizaciones y pasos inmediatos.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Hacen divorcios y sucesiones?</summary>
                <p className="mt-2">Sí. Te explicamos opciones, plazos y costos de forma clara antes de iniciar.</p>
              </details>

              {/* Más ejemplos para ver volumen */}
              <details className="faq-item card">
                <summary>¿Pueden revisar un contrato antes de firmar?</summary>
                <p className="mt-2">Claro. Señalamos riesgos y proponemos ajustes para protegerte.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Qué es una carta documento y cuándo conviene?</summary>
                <p className="mt-2">Es una intimación formal. La usamos para dejar constancia y ordenar una negociación.</p>
              </details>
              <details className="faq-item card">
                <summary>¿Cómo agendo una reunión?</summary>
                <p className="mt-2">Escribinos por WhatsApp o completá el formulario y coordinamos horario.</p>
              </details>
            </div>
          </div>

          {/* Botón expandir (se oculta al abrir) */}
          <label htmlFor="faqExpand" className="faq-more btn btn-outline mt-3">
            Ver todas las preguntas
          </label>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-row">
          <p>© {new Date().getFullYear()} MH ESTUDIO JURÍDICO Y ASOCIADOS. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Botón flotante WA con logo oficial */}
      <a href={WAPP_URL} target="_blank" rel="noopener" className="float-wa" aria-label="Contactar por WhatsApp">
        {/* SVG logo WhatsApp (blanco) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="26" height="26" aria-hidden="true" focusable="false" fill="currentColor">
          <path d="M128.002 24C72.692 24 28 68.69 28 124c0 22.02 7.3 42.4 19.7 58.87L36 232l50.25-11.2C102.6 227.25 115.02 230 128 230c55.31 0 100.002-44.69 100.002-100S183.312 24 128.002 24zm0 180c-12.02 0-23.43-2.7-33.6-7.52l-2.4-1.16-29.7 6.6 6.34-29.04-1.92-2.48C58.06 158.4 52 141.79 52 124c0-41.91 34.09-76 76.002-76 41.91 0 76 34.09 76 76s-34.09 76-76 76zm44.54-52.71c-2.44-1.24-14.38-7.09-16.61-7.9-2.23-.82-3.85-1.24-5.47 1.24-1.62 2.48-6.27 7.9-7.68 9.52-1.42 1.62-2.83 1.86-5.27.62-2.44-1.24-10.31-3.8-19.63-12.11-7.25-6.46-12.14-14.43-13.57-16.9-1.42-2.48-.15-3.82 1.08-5.06 1.12-1.11 2.48-2.86 3.71-4.29 1.23-1.43 1.65-2.48 2.47-4.1.83-1.62.41-3.1-.2-4.34-.62-1.24-5.47-13.19-7.49-18.09-1.97-4.74-3.97-4.09-5.47-4.16-1.41-.07-3.03-.09-4.65-.09s-4.29.62-6.52 3.1c-2.23 2.48-8.52 8.32-8.52 20.3 0 11.98 8.72 23.56 9.94 25.18 1.23 1.62 17.19 26.23 41.64 36.77 5.82 2.51 10.37 4.01 13.91 5.13 5.84 1.86 11.16 1.6 15.37.97 4.69-.7 14.38-5.87 16.41-11.54 2.02-5.67 2.02-10.52 1.4-11.54-.62-1.02-2.25-1.63-4.69-2.87z"/>
        </svg>
      </a>
    </main>
  );
}
