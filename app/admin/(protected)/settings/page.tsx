// Firebase imports removed - using default settings as fallback
import { requireRole } from "@/lib/auth/require-role";
import BrandSettingsForm from "@/components/admin/BrandSettingsForm";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireRole(["admin", "editor"]);
  // TODO: Implement Firestore query for site_settings
  // For now, using default settings as fallback
  const settings: SiteSettings = DEFAULT_SITE_SETTINGS;

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
