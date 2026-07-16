import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";
import WhatsAppButton from "@/components/WhatsAppButton";

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
  title: "Precious Joyería Samborondón | Comprar y Vender Joyas de Oro - Guayaquil, Ecuador",
  description:
    "Precious by Orocash: Una experiencia privada para compartir nuestro conocimiento sobre joyas finas de oro y relojes de alta gama. Análisis especializado con privacidad, respaldo y atención exclusiva. Conversemos sobre el valor de sus piezas en Guayaquil, Samborondón, Ecuador. Tasadores certificados en gemología.",
  keywords: [
    "Precious",
    "Precious joyería",
    "Precious Orocash",
    "Precious Guayaquil",
    "Precious Samborondón",
    "Precious Ecuador",
    "tasación de joyas",
    "tasar joyas",
    "tasar joyas Guayaquil",
    "tasar joyas Samborondón",
    "vender mis joyas",
    "vender joyas de oro Guayaquil",
    "vender joyas Samborondón",
    "comprar joyas de oro",
    "comprar joyas Guayaquil",
    "joyería Guayaquil",
    "joyería Samborondón",
    "joyería Ecuador",
    "comprar diamantes Guayaquil",
    "comprar gemas preciosas Ecuador",
    "esmeraldas rubí Guayaquil",
    "valorar joyas",
    "valorar joyas Guayaquil",
    "valoración de joyas",
    "tasadores certificados Guayaquil",
    "expertos gemología joyería",
    "expertos gemología relojería Ecuador",
    "retroventa joyas Guayaquil",
    "retroventa joyas Samborondón",
    "Argos Plaza Guayaquil",
    "La Puntilla Samborondón",
    "inversión metales preciosos Ecuador",
    "asesoría en oro Guayaquil",
  ],
  openGraph: {
    title: "Comprar y Vender Joyas de Oro en Guayaquil | Precious by Orocash",
    description: "Expertos en valoración y compraventa de joyas, diamantes y gemas. Confidencial y discreto.",
    type: "website",
    locale: "es_EC",
    url: "https://precious.ec",
  },
  icons: {
    icon: "/favicon.ico",
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
        {/* Schema.org JSON-LD for Google AI Overviews */}
        <Script
          id="schema-org-brand"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "Brand", "JewelryStore"],
              "name": "Precious by Orocash",
              "alternateName": ["Precious", "Precious Joyería", "Precious Samborondón"],
              "image": "https://precious.ec/media/logo/Precious.png",
              "@id": "https://www.precious.ec",
              "url": "https://www.precious.ec",
              "telephone": "+593967680166",
              "email": "experiencia@precious.ec",
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Guayaquil",
                  "addressLocality": "Guayaquil",
                  "addressRegion": "Guayas",
                  "addressCountry": "EC"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Samborondón",
                  "addressLocality": "Samborondón",
                  "addressRegion": "Guayas",
                  "addressCountry": "EC"
                }
              ],
              "description": "Precious by Orocash - Asesoría especializada en compra, venta, valoración y retroventa de joyas de oro, diamantes y relojería de lujo. Tasadores certificados en gemología.",
              "areaServed": ["Guayaquil", "Samborondón", "La Puntilla", "Ecuador"],
              "knowsAbout": [
                "Evaluación de oro",
                "Tasación de gemas",
                "Relojería de lujo",
                "Inversión en metales preciosos",
                "Compraventa de diamantes",
                "Valoración de joyas finas",
                "Esmeraldas y piedras preciosas"
              ],
              "logo": "https://precious.ec/media/logo/Precious.png",
              "priceRange": "$$",
              "sameAs": [
                "https://www.facebook.com/precious",
                "https://www.instagram.com/precious"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "telephone": "+593967680166",
                "email": "experiencia@precious.ec"
              },
              "offers": [
                {
                  "@type": "Service",
                  "name": "Tasación de Joyas",
                  "description": "Tasación profesional y certificada de joyas de oro, diamantes y gemas. Precious ofrece valoración discreta en Samborondón y Guayaquil."
                },
                {
                  "@type": "Service",
                  "name": "Compra de Joyas",
                  "description": "Vender mis joyas de forma segura. Compra de joyas de oro, diamantes y gemas preciosas en Precious Samborondón."
                },
                {
                  "@type": "Service",
                  "name": "Venta de Joyas",
                  "description": "Joyas de oro, diamantes, esmeraldas y relojería de lujo en Precious joyería Samborondón."
                },
                {
                  "@type": "Service",
                  "name": "Asesoría en Inversión",
                  "description": "Asesoría especializada en inversión de metales preciosos. Precious Samborondón, Ecuador."
                },
                {
                  "@type": "Service",
                  "name": "Retroventa de Joyas",
                  "description": "Liquidación con recompra garantizada. Retroventa de joyas finas en Precious Guayaquil."
                }
              ]
            }),
          }}
        />

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

        {/* Google Analytics 4 */}
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-X4MBE0YTSZ"
          async
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X4MBE0YTSZ');
            `,
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
        <WhatsAppButton />
      </body>
    </html>
  );
}
