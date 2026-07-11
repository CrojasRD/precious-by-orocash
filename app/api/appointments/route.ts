import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validations/appointment";
import { db } from "@/lib/firebase/admin-config";

// Rate limiting simple en memoria (por IP). En producción usar
// Upstash Redis / Vercel KV para que funcione entre instancias serverless.
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Demasiadas solicitudes. Intenta nuevamente en unos minutos." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: si el campo "website" viene lleno, es muy probable que sea un bot.
  if (body.website) {
    return NextResponse.json({ message: "Solicitud rechazada." }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    console.error("❌ Validation FAILED");
    console.error("Field errors:", fieldErrors);
    console.error("Received data:", {
      full_name: body.full_name,
      identification_number: body.identification_number,
      phone: body.phone,
      email: body.email,
      appointment_reason: body.appointment_reason,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      additional_comment: body.additional_comment,
      website: body.website,
    });
    return NextResponse.json(
      { message: "Datos inválidos.", errors: fieldErrors },
      { status: 422 }
    );
  }

  const { website, ...appointmentData } = parsed.data;

  // TODO: validar reCAPTCHA aquí antes de insertar (ver README, sección Seguridad).

  try {
    const appointmentRef = db().collection("appointments").doc();
    const now = new Date().toISOString();

    await appointmentRef.set({
      fullName: appointmentData.full_name,
      identificationNumber: appointmentData.identification_number,
      phone: appointmentData.phone,
      email: appointmentData.email,
      appointmentReason: appointmentData.appointment_reason,
      appointmentDate: appointmentData.appointment_date,
      appointmentTime: appointmentData.appointment_time,
      additionalComment: appointmentData.additional_comment || null,
      appointmentStatus: "pendiente",
      assignedAdvisorId: null,
      itemDescription: null,
      advisorNotes: null,
      createdAt: now,
      updatedAt: now,
      metadata: {
        createdBy: "anonymous",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    // TODO: enviar email/WhatsApp de confirmación al cliente y notificación al staff

    return NextResponse.json(
      { message: "Cita registrada exitosamente." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar cita:", error);
    return NextResponse.json(
      { message: "No se pudo registrar la cita. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
