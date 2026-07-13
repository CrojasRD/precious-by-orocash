export default function About() {
  return (
    <section id="marca" className="bg-cream py-24 md:py-32">
      <div className="container-luxe grid items-center gap-16 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-sm shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop"
              alt="Detalle de joyería fina"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="eyebrow">La Marca</p>
          <div className="divider-gold my-5" />
          <h2 className="section-title">
            Asesoría experta en oro y gemas, respaldada por Orocash
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy/70">
            <span className="font-medium text-navy">Precious by Orocash</span>{" "}
            es asesoría especializada para inversionistas, herederos y
            empresarios que necesitan decisiones claras sobre su oro y gemas:
            valuación profesional, estrategia de inversión o liquidación con
            seguridad.
          </p>
          <p className="mt-4 text-base leading-relaxed text-navy/60">
            No somos tienda. Somos tu asesor de confianza cuando los números y
            las emociones de tu patrimonio en metales preciosos importan.
          </p>
          <p className="mt-4 text-sm uppercase tracking-widest2 text-gold-dark">
            Confidencialidad total · Tasadores certificados · Asesoría sin
            presión · Decisiones informadas
          </p>
        </div>
      </div>
    </section>
  );
}
