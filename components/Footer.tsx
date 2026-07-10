export default function Footer({
  brandName = "PRECIOUS",
  brandSubtitle = "by Orocash",
}: {
  brandName?: string;
  brandSubtitle?: string;
}) {
  return (
    <footer className="border-t border-navy/10 bg-navy py-14 text-cream/70">
      <div className="container-luxe flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <p className="font-serif text-2xl text-cream">{brandName}</p>
          <p className="text-xs uppercase tracking-widest2 text-gold-light">
            {brandSubtitle}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
            Valuación, inversión y asesoría en oro y gemas, respaldada por la
            trayectoria de Orocash.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="mb-3 uppercase tracking-widest2 text-xs text-gold-light">
              Contacto
            </p>
            <p className="text-cream/70">Atención bajo cita previa</p>
            <p className="text-cream/70">Quito, Ecuador</p>
          </div>
          <div>
            <p className="mb-3 uppercase tracking-widest2 text-xs text-gold-light">
              Privacidad
            </p>
            <p className="max-w-[220px] text-cream/60">
              Sus datos son tratados con estricta confidencialidad y jamás se
              comparten con terceros.
            </p>
          </div>
        </div>
      </div>

      <div className="container-luxe mt-10 border-t border-cream/10 pt-6 text-xs text-cream/40">
        © {new Date().getFullYear()} Precious by Orocash. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
