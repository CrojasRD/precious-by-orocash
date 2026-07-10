"use server";

import { revalidatePath } from "next/cache";
// import { createClient } from "@/lib/supabase/server";

// Acciones exclusivas del rol "asesor" (y admin) sobre sus propias
// citas asignadas. Las políticas RLS de appointments/valuation_reports
// ya impiden que un asesor edite una cita que no le pertenece; estas
// acciones solo agregan validación de sesión y revalidación de caché.

export async function updateAppointmentAdvisorFields(input: {
  appointmentId: string;
  itemDescription: string | null;
  advisorNotes: string | null;
}) {
  // TODO: Implement Firestore appointment update
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  // const { error } = await supabase
  //   .from("appointments")
  //   .update({
  //     item_description: input.itemDescription,
  //     advisor_notes: input.advisorNotes,
  //   })
  //   .eq("id", input.appointmentId);

  // if (error) throw new Error(error.message);

  revalidatePath("/admin/my-appointments");
}

export async function upsertValuationReport(input: {
  appointmentId: string;
  reportUrl: string;
  summary: string | null;
  estimatedValue: number | null;
}) {
  // TODO: Implement Firestore valuation report upsert
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  // const { error } = await supabase.from("valuation_reports").upsert(
  //   {
  //     appointment_id: input.appointmentId,
  //     report_url: input.reportUrl,
  //     summary: input.summary,
  //     estimated_value: input.estimatedValue,
  //   },
  //   { onConflict: "appointment_id" }
  // );

  // if (error) throw new Error(error.message);

  revalidatePath("/admin/my-appointments");
}
