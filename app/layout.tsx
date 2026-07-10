import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// La tipografía de marca ("Exmouth") se autoaloja vía @font-face en
// globals.css, ya que no está disponible en Google Fonts. Ver
// public/fonts/README.md para instrucciones de instalación.
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Precious by Orocash | Asesoría especializada en oro",
  description:
    "Valuación, inversión y asesoría en oro y gemas para inversionistas, herederos y empresarios. Tasadores certificados, confidencialidad total. Agenda tu consultoría.",
  keywords: [
    "asesoría en oro",
    "valuación de oro",
    "inversión en metales preciosos",
    "retroventa de joyas",
    "Orocash",
  ],
  openGraph: {
    title: "Precious by Orocash",
    description: "Valuación, inversión y asesoría en oro y gemas.",
    type: "website",
    locale: "es_EC",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={body.variable}>
      <body>{children}</body>
    </html>
  );
}
