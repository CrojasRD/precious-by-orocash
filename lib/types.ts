export type AppointmentReason =
  | "valuar"
  | "inversion"
  | "liquidar"
  | "asesoria_patrimonial"
  | "otro";

export const APPOINTMENT_REASON_LABELS: Record<AppointmentReason, string> = {
  valuar: "Quiero valuar mis joyas/oro",
  inversion: "Busco inversión en metales preciosos",
  liquidar: "Tengo oro/gemas para liquidar",
  asesoria_patrimonial: "Necesito asesoría patrimonial en oro",
  otro: "Otra (especificar)",
};

export type AppointmentStatus =
  | "pendiente"
  | "confirmada"
  | "atendida"
  | "no_asistio"
  | "cancelada";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  atendida: "Atendida",
  no_asistio: "No asistió",
  cancelada: "Cancelada",
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  pendiente: "bg-amber-100 text-amber-800 border-amber-200",
  confirmada: "bg-blue-100 text-blue-800 border-blue-200",
  atendida: "bg-emerald-100 text-emerald-800 border-emerald-200",
  no_asistio: "bg-neutral-200 text-neutral-700 border-neutral-300",
  cancelada: "bg-rose-100 text-rose-800 border-rose-200",
};

export type TransactionType = "compra" | "venta";

export interface Appointment {
  id: string;
  full_name: string;
  identification_number: string;
  phone: string;
  email: string;
  appointment_reason: AppointmentReason;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:mm
  additional_comment: string | null;
  appointment_status: AppointmentStatus;
  assigned_advisor_id: string | null;
  item_description: string | null;
  advisor_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  appointment_id: string;
  transaction_completed: boolean;
  transaction_type: TransactionType | null;
  transaction_value: number | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithTransaction extends Appointment {
  transaction: Transaction | null;
}

export interface AppointmentWithValuation extends Appointment {
  valuation: ValuationReport | null;
}

export interface ValuationReport {
  id: string;
  appointment_id: string;
  report_url: string;
  summary: string | null;
  estimated_value: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientDocument {
  id: string;
  appointment_id: string;
  file_url: string;
  file_name: string;
  uploaded_by_email: string;
  created_at: string;
}

export interface SiteSettings {
  brand_name: string;
  brand_subtitle: string;
  hero_banner_url: string | null;
  logo_image_url: string | null;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_name: "PRECIOUS",
  brand_subtitle: "by Orocash",
  hero_banner_url: null,
  logo_image_url: null,
};

export type UserRole = "admin" | "editor" | "asesor" | "recepcion" | "viewer";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor de contenido",
  asesor: "Asesor / Tasador",
  recepcion: "Recepción",
  viewer: "Cliente (portal)",
};

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin:
    "Acceso total: citas, transacciones, valuaciones, documentos, usuarios y configuración.",
  editor:
    "Solo contenido e imágenes del sitio. Sin acceso a datos de clientes, citas ni transacciones.",
  asesor:
    "Solo sus citas asignadas: ficha del cliente, descripción del oro/gema, informe de valoración y notas privadas. Sin datos financieros.",
  recepcion:
    "Calendario de citas, confirmación, registro de clientes nuevos y control de asistencia. Sin contenido ni valuaciones.",
  viewer:
    "Portal del cliente: su propia cita, descarga de informe de valoración y carga de documentos previos.",
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}
