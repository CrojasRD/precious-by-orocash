import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Trust from "@/components/sections/Trust";
import BookingSection from "@/components/sections/BookingSection";
// Firebase imports removed - using DEFAULT_SITE_SETTINGS as fallback
import { DEFAULT_SITE_SETTINGS } from "@/lib/types";

// Se lee la sesión de cookies vía createClient(), por lo que Next.js
// renderiza esta página de forma dinámica (per-request) automáticamente.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // TODO: Implement Firestore query for site_settings
  // For now, using default settings as fallback
  const settings = DEFAULT_SITE_SETTINGS;

  return (
    <>
      <Navbar
        brandName={settings.brand_name}
        brandSubtitle={settings.brand_subtitle}
        logoImageUrl={settings.logo_image_url}
      />
      <main>
        <Hero bannerUrl={settings.hero_banner_url} />
        <About />
        <Services />
        <Experience />
        <Trust />
        <BookingSection />
      </main>
      <Footer brandName={settings.brand_name} brandSubtitle={settings.brand_subtitle} />
    </>
  );
}
