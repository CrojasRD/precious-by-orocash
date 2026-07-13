/**
 * Google Tag Manager Event Tracker
 * Dispara eventos personalizados a Google Tag Manager
 */

export interface GTMEvent {
  event: string;
  [key: string]: any;
}

/**
 * Dispara un evento a Google Tag Manager
 */
export function trackEvent(eventData: GTMEvent) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push(eventData);
    console.log("[GTM Event]", eventData.event, eventData);
  }
}

// ============= APPOINTMENT EVENTS =============

export function trackAppointmentView() {
  trackEvent({
    event: "appointment_view",
    event_category: "appointment",
    event_label: "Formulario de cita visible",
  });
}

export function trackAppointmentSubmit(data: {
  appointmentReason: string;
  appointmentDate: string;
}) {
  trackEvent({
    event: "appointment_submit",
    event_category: "appointment",
    event_label: `Cita agendada - ${data.appointmentReason}`,
    appointment_reason: data.appointmentReason,
    appointment_date: data.appointmentDate,
    value: 1,
  });
}

export function trackAppointmentConfirm(appointmentId: string) {
  trackEvent({
    event: "appointment_confirm",
    event_category: "appointment",
    event_label: "Cita confirmada por admin",
    appointment_id: appointmentId,
  });
}

export function trackAppointmentCancel(appointmentId: string) {
  trackEvent({
    event: "appointment_cancel",
    event_category: "appointment",
    event_label: "Cita cancelada",
    appointment_id: appointmentId,
  });
}

// ============= AUTHENTICATION EVENTS =============

export function trackAdminLogin(email: string, role: string) {
  trackEvent({
    event: "admin_login",
    event_category: "authentication",
    event_label: `Login - ${role}`,
    user_email: email,
    user_role: role,
  });
}

export function trackAdminLogout() {
  trackEvent({
    event: "admin_logout",
    event_category: "authentication",
    event_label: "Cierre de sesión",
  });
}

// ============= ADMIN PANEL EVENTS =============

export function trackDashboardView() {
  trackEvent({
    event: "dashboard_view",
    event_category: "admin",
    event_label: "Dashboard visitado",
  });
}

export function trackAppointmentsListView(count: number) {
  trackEvent({
    event: "appointments_list_view",
    event_category: "admin",
    event_label: "Lista de citas consultada",
    appointment_count: count,
  });
}

export function trackUsersListView(count: number) {
  trackEvent({
    event: "users_list_view",
    event_category: "admin",
    event_label: "Lista de usuarios consultada",
    user_count: count,
  });
}

export function trackSettingsView() {
  trackEvent({
    event: "settings_view",
    event_category: "admin",
    event_label: "Configuración de marca visitada",
  });
}

export function trackLogoUpload(fileSize: number, fileType: string) {
  trackEvent({
    event: "logo_upload",
    event_category: "settings",
    event_label: "Logo subido",
    file_size: fileSize,
    file_type: fileType,
    value: 1,
  });
}

export function trackBannerUpload(fileSize: number, fileType: string) {
  trackEvent({
    event: "banner_upload",
    event_category: "settings",
    event_label: "Banner subido",
    file_size: fileSize,
    file_type: fileType,
    value: 1,
  });
}

export function trackSettingsSave() {
  trackEvent({
    event: "settings_save",
    event_category: "settings",
    event_label: "Configuración guardada",
    value: 1,
  });
}

// ============= TRANSACTION EVENTS =============

export function trackTransactionCreate(type: "compra" | "venta", value: number) {
  trackEvent({
    event: "transaction_create",
    event_category: "transaction",
    event_label: `Transacción creada - ${type}`,
    transaction_type: type,
    transaction_value: value,
    value: value,
  });
}

export function trackTransactionUpdate(type: "compra" | "venta", value: number) {
  trackEvent({
    event: "transaction_update",
    event_category: "transaction",
    event_label: `Transacción actualizada - ${type}`,
    transaction_type: type,
    transaction_value: value,
  });
}

// ============= ERROR EVENTS =============

export function trackError(errorName: string, errorMessage: string, page: string) {
  trackEvent({
    event: "error",
    event_category: "error",
    event_label: errorName,
    error_message: errorMessage,
    page: page,
  });
}

// ============= CONTACT/INQUIRY EVENTS =============

export function trackContactFormView() {
  trackEvent({
    event: "contact_form_view",
    event_category: "engagement",
    event_label: "Formulario de contacto visible",
  });
}

export function trackContactFormSubmit() {
  trackEvent({
    event: "contact_form_submit",
    event_category: "engagement",
    event_label: "Formulario de contacto enviado",
    value: 1,
  });
}

// ============= PAGE VIEW (Manual tracking if needed) =============

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
  });
}
