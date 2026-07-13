const pillars = [
  { title: "Tasadores certificados", description: "Expertise real en oro y gemas." },
  { title: "Valuación transparente", description: "Sé exactamente cuánto vale tu oro, sin sorpresas." },
  { title: "Asesoría objetiva", description: "No vendemos. Te aconsejamos lo mejor para ti." },
  { title: "Confidencialidad total", description: "Tus decisiones patrimoniales son privadas." },
];

export default function Experience() {
  return (
    <section id="experiencia" className="relative bg-navy py-24 text-cream md:py-32">
      <div className="container-luxe grid gap-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow text-gold-light">Asesoría en oro y gemas</p>
          <div className="divider-gold my-5" />
          <h2 className="font-serif text-3xl font-medium text-cream md:text-4xl lg:text-5xl">
            Valuación experta, decisiones claras, confidencialidad garantizada
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-cream/70">
            En Precious by Orocash recibes asesoría experta de tasadores
            certificados. Valuamos tu oro, te mostramos opciones (invertir,
            vender, guardar), y tomas decisiones informadas en ambiente
            privado. Confidencialidad total. Sin presión comercial.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-sm border border-cream/10 bg-cream/[0.03] p-6 transition-colors hover:border-gold-light/40"
            >
              <span className="text-sm uppercase tracking-widest2 text-gold-light">
                {p.title}
              </span>
              <p className="mt-2 text-xs leading-relaxed text-cream/50">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
