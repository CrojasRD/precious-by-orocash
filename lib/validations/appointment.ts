import { z } from "zod";

// Validación del formulario público de reserva de cita.
// Se ejecuta en cliente (react-hook-form) y de nuevo en servidor
// (API route) antes de insertar en Supabase.
export const appointmentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Ingresa tu nombre completo")
    .max(120, "Nombre demasiado largo"),
  identificationNumber: z
    .string()
    .trim()
    .min(5, "Ingresa un número de cédula válido")
    .max(20, "Número de cédula inválido")
    .regex(/^[0-9A-Za-z-]+$/, "Solo se permiten números y letras"),
  phone: z
    .string()
    .trim()
    .min(7, "Ingresa un número de celular válido")
    .max(20, "Número de celular inválido")
    .regex(/^[0-9+\s-]+$/, "Formato de celular inválido"),
  email: z.string().trim().email("Ingresa un correo electrónico válido"),
  appointmentReason: z.enum(
    ["valuar", "inversion", "liquidar", "asesoria_patrimonial", "otro"],
    { errorMap: () => ({ message: "Selecciona el motivo de tu cita" }) }
  ),
  appointmentDate: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine((val) => {
      const selected = new Date(val + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "La fecha debe ser hoy o posterior"),
  appointmentTime: z.string().min(1, "Selecciona una hora"),
  additionalComment: z.string().max(500, "Máximo 500 caracteres").optional(),
  // Honeypot anti-spam: debe llegar vacío. Los bots suelen rellenarlo.
  website: z.string().max(0).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
