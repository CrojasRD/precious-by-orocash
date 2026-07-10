"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#marca", label: "La Marca" },
  { href: "#servicios", label: "Servicios" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#confianza", label: "Confianza" },
];

export default function Navbar({
  brandName = "PRECIOUS",
  brandSubtitle = "by Orocash",
  logoImageUrl = null,
}: {
  brandName?: string;
  brandSubtitle?: string;
  logoImageUrl?: string | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 shadow-soft backdrop-blur" : "bg-cream"
      }`}
    >
      <div className="container-luxe flex items-center justify-between py-5">
        <a href="#top" className="flex items-center gap-2 leading-none">
          {logoImageUrl ? (
            <img src={logoImageUrl} alt={brandName} className="h-9 w-auto md:h-11" />
          ) : (
            <span className="flex flex-col">
              <span className="font-serif text-xl tracking-wide text-navy md:text-2xl">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-widest2 text-gold-dark md:text-xs">
                {brandSubtitle}
              </span>
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-widest2 text-navy/70 transition-colors hover:text-gold-dark"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#reservar" className="hidden md:inline-flex btn-primary !py-3 !px-6 text-xs">
          Agendar consultoría
        </a>

        <button
          aria-label="Abrir menú"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="h-px w-6 bg-navy" />
          <span className="h-px w-6 bg-navy" />
          <span className="h-px w-4 bg-navy" />
        </button>
      </div>

      {open && (
        <div className="border-t border-navy/10 bg-cream md:hidden">
          <div className="container-luxe flex flex-col gap-5 py-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest2 text-navy/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#reservar"
              onClick={() => setOpen(false)}
              className="btn-primary !py-3 text-xs"
            >
              Agendar consultoría
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
