const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop";

export default function Hero({ bannerUrl }: { bannerUrl?: string | null }) {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-navy pt-28"
    >
      {/* Textura sutil de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #D9BE8E 0, transparent 40%), radial-gradient(circle at 80% 60%, #D9BE8E 0, transparent 35%)",
        }}
      />

      <div className="container-luxe relative z-10 grid items-center gap-16 py-20 md:grid-cols-2">
        <div className="animate-fade-up">
          <p className="eyebrow text-gold-light">Asesoría especializada en oro - Precious Guayaquil</p>

          <h1 className="mt-6 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Precious <span className="text-gold-light">by Orocash</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-cream/80">
            <strong>Precious:</strong> Compra, venta y valoración de joyas de oro, diamantes y gemas en Guayaquil y Samborondón.
          </p>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/60">
            Precious es tu aliado de confianza para inversionistas, herederos y empresarios que necesitan
            expertise real. Tasadores certificados en gemología y relojería, confidencialidad total,
            decisiones informadas. Precious Guayaquil y Precious Samborondón.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-widest2 text-cream/50">
            <span>Tasadores certificados</span>
            <span className="text-gold-light/40">|</span>
            <span>Valuación transparente</span>
            <span className="text-gold-light/40">|</span>
            <span>Inversión en metales preciosos</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#reservar" className="btn-primary bg-gold-dark hover:bg-gold text-navy">
              Agendar consultoría
            </a>
            <a href="#servicios" className="btn-secondary border-cream/30 text-cream hover:border-gold-light hover:text-gold-light">
              Ver servicios
            </a>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:0.3s] opacity-0">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-sm border border-gold-light/20 shadow-soft">
            <img
              src={bannerUrl || DEFAULT_BANNER}
              alt="Joyería de lujo Precious by Orocash"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
