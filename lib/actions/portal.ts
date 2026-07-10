"use server";

import { revalidatePath } from "next/cache";

// Acciones del portal del cliente (rol "viewer"). El archivo ya se
// sube a Storage desde el cliente (browser) porque requiere leer el
// File; aquí solo se registra la fila en client_documents, protegida
// por la política RLS "owner_can_insert_client_documents" (el email
// del usuario autenticado debe coincidir con el de la cita).
export async function registerClientDocument(input: {
  appointmentId: string;
  fileUrl: string;
  fileName: string;
}) {
  // TODO: Implement Firestore document registration
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  // const { error } = await supabase.from("client_documents").insert({
  //   appointment_id: input.appointmentId,
  //   file_url: input.fileUrl,
  //   file_name: input.fileName,
  //   uploaded_by_email: session.user.email ?? ""