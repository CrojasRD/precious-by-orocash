# Google Tag Manager - Implementación de Eventos

## Archivo de eventos creado
- `lib/gtm/events.ts` - Contiene todas las funciones para disparar eventos

## Cómo usar

### Importar en cualquier componente:
```typescript
import { trackAppointmentSubmit, trackAdminLogin } from "@/lib/gtm/events";
```

### Disparar un evento:
```typescript
trackAppointmentSubmit({
  appointmentReason: "valuacion",
  appointmentDate: "2026-07-15"
});
```

---

## Eventos por sección

### 1. CITAS (Public Form - `app/booking/page.tsx`)
```typescript
import { trackAppointmentView, trackAppointmentSubmit } from "@/lib/gtm/events";

// Cuando se abre la página
useEffect(() => {
  trackAppointmentView();
}, []);

// Cuando se envía el formulario
trackAppointmentSubmit({
  appointmentReason: formData.appointmentReason,
  appointmentDate: formData.appointmentDate
});
```

### 2. ADMIN - LOGIN (`app/admin/login/page.tsx`)
```typescript
import { trackAdminLogin } from "@/lib/gtm/events";

// Después de login exitoso
trackAdminLogin(userEmail, userRole);
```

### 3. ADMIN - DASHBOARD (`app/admin/(protected)/dashboard/page.tsx`)
```typescript
import { trackDashboardView } from "@/lib/gtm/events";

// Cuando carga el dashboard
useEffect(() => {
  trackDashboardView();
}, []);
```

### 4. ADMIN - CITAS (`app/admin/(protected)/appointments/page.tsx`)
```typescript
import { trackAppointmentsListView, trackAppointmentConfirm, trackAppointmentCancel } from "@/lib/gtm/events";

// Cuando carga la lista
trackAppointmentsListView(appointments.length);

// Cuando confirma una cita
trackAppointmentConfirm(appointmentId);

// Cuando cancela una cita
trackAppointmentCancel(appointmentId);
```

### 5. ADMIN - USUARIOS (`app/admin/(protected)/users/page.tsx`)
```typescript
import { trackUsersListView } from "@/lib/gtm/events";

// Cuando carga la lista
trackUsersListView(users.length);
```

### 6. ADMIN - CONFIGURACIÓN (`app/admin/(protected)/settings/page.tsx`)
```typescript
import { trackSettingsView, trackLogoUpload, trackBannerUpload, trackSettingsSave } from "@/lib/gtm/events";

// Cuando carga la página
trackSettingsView();

// Cuando sube el logo
trackLogoUpload(file.size, file.type);

// Cuando sube el banner
trackBannerUpload(file.size, file.type);

// Cuando guarda cambios
trackSettingsSave();
```

### 7. TRANSACCIONES (`components/admin/AppointmentDetailModal.tsx`)
```typescript
import { trackTransactionCreate, trackTransactionUpdate } from "@/lib/gtm/events";

// Cuando crea una transacción
trackTransactionCreate("compra", 5000); // tipo, valor

// Cuando actualiza una transacción
trackTransactionUpdate("venta", 3000);
```

### 8. ERRORES (Anywhere error handling)
```typescript
import { trackError } from "@/lib/gtm/events";

// Cuando ocurre un error
trackError("AppointmentError", error.message, window.location.pathname);
```

---

## Configurar en Google Tag Manager Console

### Paso 1: Variables de datos (Data Layer Variables)
1. Ve a GTM Console → Variables
2. Crea una variable tipo "Data Layer Variable" para cada evento:
   - `event`
   - `event_category`
   - `event_label`
   - `appointment_reason`
   - `appointment_date`
   - `user_role`
   - etc.

### Paso 2: Triggers
1. Ve a Triggers → New
2. Crea triggers para cada evento:

**Ejemplo - Trigger para appointment_submit:**
- Name: `Appointment Submit Trigger`
- Type: `Custom Event`
- Event name: `appointment_submit`

### Paso 3: Tags
1. Ve a Tags → New
2. Crea tags de Google Analytics 4:

**Ejemplo:**
- Name: `GA4 - Appointment Submit`
- Type: `Google Analytics: GA4 Event`
- Measurement ID: Tu GA4 ID
- Event name: {{event}}
- Trigger: `Appointment Submit Trigger`

---

## Eventos disponibles

| Evento | Categoría | Descripción |
|--------|-----------|-------------|
| `appointment_view` | appointment | Formulario de cita visible |
| `appointment_submit` | appointment | Cita agendada |
| `appointment_confirm` | appointment | Cita confirmada por admin |
| `appointment_cancel` | appointment | Cita cancelada |
| `admin_login` | authentication | Login admin |
| `admin_logout` | authentication | Logout admin |
| `dashboard_view` | admin | Dashboard visitado |
| `appointments_list_view` | admin | Lista de citas consultada |
| `users_list_view` | admin | Lista de usuarios consultada |
| `settings_view` | admin | Configuración visitada |
| `logo_upload` | settings | Logo subido |
| `banner_upload` | settings | Banner subido |
| `settings_save` | settings | Configuración guardada |
| `transaction_create` | transaction | Transacción creada |
| `transaction_update` | transaction | Transacción actualizada |
| `error` | error | Error ocurrido |
| `contact_form_view` | engagement | Formulario de contacto visible |
| `contact_form_submit` | engagement | Formulario de contacto enviado |
| `page_view` | page | Página visitada |

---

## Próximos pasos

1. ✅ Archivo `lib/gtm/events.ts` creado
2. ⏳ Implementar eventos en componentes (ver ejemplos arriba)
3. ⏳ Configurar variables, triggers y tags en GTM Console
4. ⏳ Conectar con Google Analytics 4
5. ⏳ Probar eventos en GTM Preview Mode

