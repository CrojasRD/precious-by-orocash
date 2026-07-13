import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";

// Declare dataLayer for GTM
declare global {
  interface Window {
    dataLayer: any[];
  }
}

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
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WD7LR23X');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WD7LR23X"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
