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
  title: "Precious Joyería | Comprar, Vender y Tasar Joyas de Oro en Guayaquil, Samborondón, Ecuador",
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
        {/* Schema.org JSON-LD for Brand + Local Business */}
        <Script
          id="schema-org-brand"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "Brand", "JewelryStore"],
              name: "Precious",
              alternateName: ["Precious by Orocash", "Precious Joyería"],
              description: "Precious Joyería - Tasación, compra y venta de joyas de oro, diamantes, gemas y esmeraldas. Tasar joyas en Guayaquil, Samborondón, La Puntilla, Ecuador. Expertos en gemología y relojería certificados.",
              url: "https://precious.ec",
              telephone: "+593967680166",
              email: "experiencia@precious.ec",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Guayaquil",
                addressLocality: "Guayaquil",
                addressRegion: "Guayas",
                postalCode: "090513",
                addressCountry: "EC"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-2.1632",
                longitude: "-79.8935"
              },
              image: "https://precious.ec/media/logo/Precious.png",
              logo: "https://precious.ec/media/logo/Precious.png",
              priceRange: "$$",
              areaServed: [
                {
                  "@type": "City",
                  name: "Guayaquil"
                },
                {
                  "@type": "City",
                  name: "Samborondón"
                },
                {
                  "@type": "City",
                  name: "La Puntilla"
                }
              ],
              sameAs: [
                "https://www.facebook.com/precious",
                "https://www.instagram.com/precious"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+593967680166",
                email: "experiencia@precious.ec"
              },
              offers: [
                {
                  "@type": "Service",
                  name: "Tasación de Joyas",
                  description: "Tasación profesional y discreta de joyas de oro, diamantes y gemas. Precious tasadores certificados en Guayaquil y Samborondón."
                },
                {
                  "@type": "Service",
                  name: "Compra de Joyas",
                  description: "Compra de joyas de oro, diamantes y gemas. Vender mis joyas de forma segura en Precious Guayaquil."
                },
                {
                  "@type": "Service",
                  name: "Venta de Joyas",
                  description: "Joyas de oro, diamantes, esmeraldas y gemas preciosas en Precious joyería Guayaquil."
                },
                {
                  "@type": "Service",
                  name: "Asesoría en Inversión",
                  description: "Asesoría especializada en inversión de metales preciosos en Precious Samborondón, Ecuador."
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
