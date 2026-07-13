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
  fullName: string;
  identificationNumber: string;
  phone: string;
  email: string;
  appointmentReason: AppointmentReason;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  additionalComment: string | null;
  appointmentStatus: AppointmentStatus;
  assignedAdvisorId: string | null;
  itemDescription: string | null;
  advisorNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  appointmentId: string;
  transactionCompleted: boolean;
  transactionType: TransactionType | null;
  transactionValue: number | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentWithTransaction extends Appointment {
  transaction: Transaction | null;
}

export interface AppointmentWithValuation extends Appointment {
  valuation: ValuationReport | null;
}

export interface ValuationReport {
  id: string;
  appointmentId: string;
  reportUrl: string;
  summary: string | null;
  estimatedValue: number | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDocument {
  id: string;
  appointmentId: string;
  fileUrl: string;
  fileName: string;
  uploadedByEmail: string;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  brandSubtitle: string;
  heroBannerUrl: string | null;
  logoImageUrl: string | null;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: "PRECIOUS",
  brandSubtitle: "by Orocash",
  heroBannerUrl: null,
  logoImageUrl: null,
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
