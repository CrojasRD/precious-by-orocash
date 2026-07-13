import { Gem, TrendingUp, RefreshCw, Handshake, Building2 } from "lucide-react";

const services = [
  {
    icon: Gem,
    title: "Valuación profesional",
    description:
      "¿Cuánto realmente vale tu oro? Tasación certificada, informe detallado, asesoría transparente.",
    audience: "Para: herederos, inversionistas",
  },
  {
    icon: TrendingUp,
    title: "Asesoría de inversión",
    description:
      "Oro como activo de diversificación. Estrategia personalizada, análisis de mercado, horizonte claro.",
    audience: "Para: inversionistas sofisticados",
  },
  {
    icon: RefreshCw,
    title: "Retroventa de joyas",
    description:
      "Liquidación con recompra garantizada. Márgenes claros, proceso rápido, sin sorpresas financieras.",
    audience: "Para: quienes buscan liquidez",
  },
  {
    icon: Handshake,
    title: "Consultoría especializada",
    description:
      "¿Vendo, invierto o conservo? Asesor experto, perspectiva objetiva, decisión informada y confidencial.",
    audience: "Para: todos los clientes",
  },
  {
    icon: Building2,
    title: "Atención privada en Samborondón",
    description:
      "Reunión 1 a 1, sin interrupciones. Confidencialidad garantizada, tiempo real con experto certificado.",
    audience: "Para: todas las consultas",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-ivory py-24 md:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center flex">Servicios Precious</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-title">Asesoría que responde a cada necesidad</h2>
          <p className="mt-4 text-navy/60">
            Tres tipos de decisiones. Una solución para cada una.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-sm border border-navy/10 bg-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft"
            >
              <s.icon className="h-8 w-8 text-gold-dark" strokeWidth={1.25} />
              <h3 className="mt-6 font-serif text-xl text-navy">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/60">
                {s.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest2 text-gold-dark">
                {s.audience}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
