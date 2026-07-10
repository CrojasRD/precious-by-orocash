import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Trust from "@/components/sections/Trust";
import BookingSection from "@/components/sections/BookingSection";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/types";

// Se lee la sesión de cookies vía createClient(), por lo que Next.js
// renderiza esta página de forma dinámica (per-request) automáticamente.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").single();

  const settings = data
    ? {
        brand_name: data.brand_name,
        brand_subtitle: data.brand_subtitle,
        hero_banner_url: data.hero_banner_url,
        logo_image_url: data.logo_image_url,
      }
    : DEFAULT_SITE_SETTINGS;

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
