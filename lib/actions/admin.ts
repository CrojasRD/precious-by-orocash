"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase/admin-config";
import type { AppointmentStatus, TransactionType } from "@/lib/types";

// Todas las mutaciones usan el cliente de servidor con la sesión del
// usuario autenticado: las políticas RLS de Supabase garantizan que
// solo el staff logueado pueda escribir en appointments/transactions.

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  try {
    await db()
      .collection("appointments")
      .doc(appointmentId)
      .update({
        appointmentStatus: status,
        updatedAt: new Date().toISOString(),
      });

    revalidatePath("/admin/appointments");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw new Error("No se pudo actualizar el estado de la cita.");
  }
}

export async function upsertTransaction(input: {
  appointmentId: string;
  transactionCompleted: boolean;
  transactionType: TransactionType | null;
  transactionValue: number | null;
  internalNotes: string | null;
}) {
  if (input.transactionCompleted && !input.transactionType) {
    throw new Error("Selecciona el tipo de transacción.");
  }
  if (input.transactionCompleted && (input.transactionValue == null || input.transactionValue < 0)) {
    throw new Error("Ingresa un valor de transacción válido.");
  }

  try {
    const now = new Date().toISOString();
    await db()
      .collection("transactions")
      .doc(input.appointmentId)
      .set(
        {
          appointmentId: input.appointmentId,
          transactionCompleted: input.transactionCompleted,
          transactionType: input.transactionCompleted ? input.transactionType : null,
          transactionValue: input.transactionCompleted ? input.transactionValue : null,
          internalNotes: input.internalNotes,
          updatedAt: now,
        },
        { merge: true }
      );

    revalidatePath("/admin/appointments");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Error upserting transaction:", error);
    throw new Error("No se pudo guardar la transacción.");
  }
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
  if (!input.brandName.trim()) {
    throw new Error("El nombre del logotipo no puede estar vacío.");
  }

  try {
    await db()
      .collection("site_settings")
      .doc("config")
      .set(
        {
          brandName: input.brandName.trim(),
          brandSubtitle: input.brandSubtitle.trim(),
          heroBannerUrl: input.heroBannerUrl,
          logoImageUrl: input.logoImageUrl,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    revalidatePath("/admin/settings");
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw new Error("No se pudo guardar la configuración del sitio.");
  }
}
