import { db } from "@/lib/firebase/admin-config";
import BrandSettingsForm from "@/components/admin/BrandSettingsForm";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let settings: SiteSettings = DEFAULT_SITE_SETTINGS;

  try {
    const doc = await db().collection("site_settings").doc("config").get();
    if (doc.exists) {
      const data = doc.data();
      settings = {
        brandName: data?.brandName || DEFAULT_SITE_SETTINGS.brandName,
        brandSubtitle: data?.brandSubtitle || DEFAULT_SITE_SETTINGS.brandSubtitle,
        heroBannerUrl: data?.heroBannerUrl || null,
        logoImageUrl: data?.logoImageUrl || null,
      };
    }
  } catch (error) {
    console.error("Error loading site settings:", error);
    // Use default settings if error
  }

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Configuración</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">
          Marca del sitio
        </h1>
        <p className="mt-2 max-w-xl text-sm text-navy/60">
          Sube el banner principal de la landing y ajusta el logotipo
          (nombre, subtítulo o imagen) que se muestra en el sitio público.
        </p>
      </div>

      <BrandSettingsForm initialSettings={settings} />
    </div>
  );
}
