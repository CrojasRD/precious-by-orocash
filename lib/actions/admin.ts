"use server";

import { revalidatePath } from "next/cache";
// import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus, TransactionType } from "@/lib/types";

// Todas las mutaciones usan el cliente de servidor con la sesión del
// usuario autenticado: las políticas RLS de Supabase garantizan que
// solo el staff logueado pueda escribir en appointments/transactions.

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  // TODO: Implement Firestore appointment status update
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  // const { error } = await supabase
  //   .from("appointments")
  //   .update({ appointment_status: status })
  //   .eq("id", appointmentId);

  // if (error) throw new Error(error.message);

  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
}

export async function upsertTransaction(input: {
  appointmentId: string;
  transactionCompleted: boolean;
  transactionType: TransactionType | null;
  transactionValue: number | null;
  internalNotes: string | null;
}) {
  // TODO: Implement Firestore transaction upsert
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  if (input.transactionCompleted && !input.transactionType) {
    throw new Error("Selecciona el tipo de transacción.");
  }
  if (input.transactionCompleted && (input.transactionValue == null || input.transactionValue < 0)) {
    throw new Error("Ingresa un valor de transacción válido.");
  }

  // const { error } = await supabase.from("transactions").upsert(
  //   {
  //     appointment_id: input.appointmentId,
  //     transaction_completed: input.transactionCompleted,
  //     transaction_type: input.transactionCompleted ? input.transactionType : null,
  //     transaction_value: input.transactionCompleted ? input.transactionValue : null,
  //     internal_notes: input.internalNotes,
  //   },
  //   { onConflict: "appointment_id" }
  // );

  // if (error) throw new Error(error.message);

  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
}

// Guarda el logotipo (texto y/o imagen) y el banner del hero.
// La subida del archivo a Supabase Storage ocurre en el cliente
// (BrandSettingsForm); esta acción solo persiste las URLs resultantes.
export async function updateSiteSettings(input: {
  brandName: string;
  brandSubtitle: string;
  heroBannerUrl: string | null;
  logoImageUrl: string | null;
}) {
  // TODO: Implement Firestore site settings update
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  if (!input.brandName.trim()) {
    throw new Error("El nombre del logotipo no puede estar vacío.");
  }

  // const { error } = await supabase
  //   .from("site_settings")
  //   .update({
  //     brand_name: input.brandName.trim(),
  //  