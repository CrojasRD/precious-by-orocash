"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, X, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateSiteSettings } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/types";

const BRANDING_BUCKET = "branding";
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export default function BrandSettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const router = useRouter();

  const [brandName, setBrandName] = useState(initialSettings.brand_name);
  const [brandSubtitle, setBrandSubtitle] = useState(initialSettings.brand_subtitle);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialSettings.hero_banner_url);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo_image_url);
  const [logoRemoved, setLogoRemoved] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Formato no soportado. Usa PNG, JPG, WEBP o SVG.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `El archivo supera ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLogoFile(file);
    setLogoRemoved(false);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleRemoveLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoRemoved(true);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  async function uploadToBranding(file: File, prefix: string) {
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const path = `${prefix}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BRANDING_BUCKET)
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from(BRANDING_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let heroBannerUrl = initialSettings.hero_banner_url;
      let logoImageUrl = initialSettings.logo_image_url;

      if (bannerFile) {
        heroBannerUrl = await uploadToBranding(bannerFile, "hero-banner");
      }

      if (logoFile) {
        logoImageUrl = await uploadToBranding(logoFile, "logo");
      } else if (logoRemoved) {
        logoImageUrl = null;
      }

      await updateSiteSettings({
        brandName,
        brandSubtitle,
        heroBannerUrl,
        logoImageUrl,
      });

      setSuccess(true);
      setBannerFile(null);
      setLogoFile(null);
      setLogoRemoved(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la configuración.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {/* Banner del hero */}
      <section className="rounded-sm border border-navy/10 bg-cream p-6 shadow-soft">
        <p className="mb-1 text-xs uppercase tracking-widest2 text-navy/60">
          Banner principal (hero)
        </p>
        <p className="mb-4 text-xs text-navy/40">
          Recomendado: imagen vertical de alta resolución, formato PNG, JPG o WEBP.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-32 w-24 items-center justify-center overflow-hidden rounded-sm border border-navy/10 bg-ivory">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Vista previa del banner" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] text-navy/30">Sin banner</span>
            )}
          </div>

          <div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleBannerChange}
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="btn-secondary !py-2.5 text-xs"
            >
              <UploadCloud className="h-4 w-4" /> Subir banner
            </button>
          </div>
        </div>
      </section>

      {/* Logotipo */}
      <section className="rounded-sm border border-navy/10 bg-cream p-6 shadow-soft">
        <p className="mb-1 text-xs uppercase tracking-widest2 text-navy/60">
          Logotipo
        </p>
        <p className="mb-4 text-xs text-navy/40">
          Edita el texto del logotipo o reemplázalo por una imagen (por ejemplo, un isotipo).
        </p>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              Nombre
            </label>
            <input
              type="text"
              className="input-luxe"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="PRECIOUS"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              Subtítulo
            </label>
            <input
              type="text"
              className="input-luxe"
              value={brandSubtitle}
              onChange={(e) => setBrandSubtitle(e.target.value)}
              placeholder="by Orocash"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-sm border border-navy/10 bg-ivory">
            {logoPreview ? (
              <img src={logoPreview} alt="Vista previa del logo" className="h-full w-full object-contain" />
            ) : (
              <span className="text-[9px] text-navy/30">Sin imagen</span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleLogoChange}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="btn-secondary !py-2.5 text-xs"
            >
              <UploadCloud className="h-4 w-4" /> Subir imagen de logo
            </button>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="btn-secondary !py-2.5 text-xs !border-rose-300 text-rose-600"
              >
                <X className="h-4 w-4" /> Quitar
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-navy/40">
          Si subes una imagen de logo, esta reemplaza el nombre y subtítulo de texto en el sitio público.
        </p>
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Cambios guardados correctamente.
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary !py-3 text-xs">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
      </button>
    </form>
  );
}
