import { ShieldCheck, ScrollText, BadgeCheck, Lock } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Expertise de Orocash",
    description: "25+ años en la industria del oro.",
  },
  {
    icon: ScrollText,
    title: "Tasación profesional",
    description: "Certificados, análisis detallado, sin conflictos de interés.",
  },
  {
    icon: Lock,
    title: "Confidencialidad garantizada",
    description: "Tus datos y decisiones son privados.",
  },
  {
    icon: BadgeCheck,
    title: "Decisión informada",
    description: "Tú decides, con información clara.",
  },
];

export default function Trust() {
  return (
    <section id="confianza" className="bg-cream py-24 md:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center flex">Confianza</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-title">Una marca construida sobre confianza</h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30">
                <it.icon className="h-6 w-6 text-gold-dark" strokeWidth={1.25} />
              </div>
              <h3 className="mt-5 font-serif text-lg text-navy">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
