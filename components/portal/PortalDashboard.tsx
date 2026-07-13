"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, UploadCloud, LogOut, FileText, Loader2 } from "lucide-react";
// import { createClient } from "@/lib/supabase/client";
import { registerClientDocument } from "@/lib/actions/portal";
import {
  APPOINTMENT_REASON_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentWithValuation,
  type ClientDocument,
} from "@/lib/types";

const CLIENT_FILES_BUCKET = "client-files";

export default function PortalDashboard({
  appointments,
  documents,
}: {
  appointments: AppointmentWithValuation[];
  documents: ClientDocument[];
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    // TODO: Implement Firebase signOut
    // const supabase = createClient();
    // await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h1 className="mt-2 font-serif text-2xl text-navy">Mi cita en Precious</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs uppercase tracking-widest2 text-navy/50 hover:text-gold-dark"
        >
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>

      {appointments.length === 0 && (
        <p className="rounded-sm border border-navy/10 bg-cream p-6 text-sm text-navy/60">
          No encontramos citas asociadas a tu correo. Si acabas de reservar,
          escríbenos y verificaremos tu registro.
        </p>
      )}

      <div className="space-y-6">
        {appointments.map((a) => (
          <AppointmentCard key={a.id} appointment={a} documents={documents.filter((d) => d.appointmentId === a.id)} />
        ))}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  documents,
}: {
  appointment: AppointmentWithValuation;
  documents: ClientDocument[];
}) {
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDownload() {
    if (!appointment.valuation) return;
    setDownloading(true);
    setError(null);
    try {
      // TODO: Implement Firebase Storage download with signed URLs
      // const supabase = createClient();
      // const { data, error: signError } = await supabase.storage
      //   .from(CLIENT_FILES_BUCKET)
      //   .createSignedUrl(appointment.valuation.reportUrl, 60);
      // if (signError) throw new Error(signError.message);
      // window.open(data.signedUrl, "_blank");
      setError("Funcionalidad de descarga aún no implementada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el informe.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // TODO: Implement Firebase Storage upload
      // const supabase = createClient();
      // const path = `${appointment.id}/${Date.now()}-${file.name}`;
      // const { error: uploadError } = await supabase.storage
      //   .from(CLIENT_FILES_BUCKET)
      //   .upload(path, file);
      // if (uploadError) throw new Error(uploadError.message);

      // await registerClientDocument({
      //   appointmentId: appointment.id,
      //   fileUrl: path,
      //   fileName: file.name,
      // });
      setError("Funcionalidad de carga aún no implementada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el documento.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-sm border border-navy/10 bg-cream p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-navy/40">
            {appointment.appointmentdate} · {appointment.appointmenttime}
          </p>
          <p className="mt-1 text-navy">{APPOINTMENT_REASON_LABELS[appointment.appointmentreason]}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${APPOINTMENT_STATUS_COLORS[appointment.appointmentstatus]}`}>
          {APPOINTMENT_STATUS_LABELS[appointment.appointmentstatus]}
        </span>
      </div>

      {/* Informe de valoración */}
      <div className="mb-5 rounded-sm border border-gold/30 bg-ivory p-4">
        <p className="mb-2 text-xs uppercase tracking-widest2 text-gold-dark">
          Informe de valoración
        </p>
        {appointment.valuation ? (
          <div>
            {appointment.valuation.summary && (
              <p className="mb-3 text-sm text-navy/70">{appointment.valuation.summary}</p>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-secondary !py-2.5 text-xs"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Descargar informe
            </button>
          </div>
        ) : (
          <p className="text-sm text-navy/50">
            Tu asesor aún no ha publicado el informe de valoración.
          </p>
        )}
      </div>

      {/* Documentos previos a la cita */}
      <div>
        <p className="mb-2 text-xs uppercase tracking-widest2 text-navy/60">
          Documentos previos a la cita
        </p>

        {documents.length > 0 && (
          <ul className="mb-3 space-y-1.5">
            {documents.map((d) => (
              <li key={d.id} className="flex items-center gap-2 text-sm text-navy/70">
                <FileText className="h-3.5 w-3.5 text-navy/40" /> {d.fileName}
              </li>
            ))}
          </ul>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary !py-2.5 text-xs"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Subir documento
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
