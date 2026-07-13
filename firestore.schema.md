# Esquema de Firestore

Esta es la estructura de datos para Precious by Orocash en Firebase Firestore.

## Colecciones principales

### `users` - Perfiles de usuario
Documentos con ID = UID de Firebase Auth

```
users/{uid}
├── email (string) - Correo único
├── name (string) - Nombre completo
├── role (enum) - admin | editor | asesor | recepcion | viewer
├── createdAt (timestamp) - Fecha de creación
└── lastLogin (timestamp|null) - Último acceso
```

**Permisos**:
- Crear: Solo admin
- Leer: Solo administración (users auth) y el usuario a sí mismo
- Actualizar: Solo admin (excepto lastLogin que es automático)
- Eliminar: Solo admin

---

### `appointments` - Citas de clientes
Documentos autogenerados (document ID = UUID)

```
appointments/{appointmentId}
├── fullName (string) - Nombre del cliente
├── identificationNumber (string) - Cédula/Pasaporte
├── phone (string) - Teléfono
├── email (string) - Email (para vincular al portal)
├── appointmentReason (enum) - valuar | inversion | liquidar | asesoria_patrimonial | otro
├── appointmentDate (date) - Fecha de la cita
├── appointmentTime (time) - Hora de la cita
├── additionalComment (string|null) - Comentario adicional
├── appointmentStatus (enum) - pendiente | confirmada | atendida | no_asistio | cancelada
├── assignedAdvisorId (string|null) - UID del asesor asignado
├── itemDescription (string|null) - Descripción del oro/gema
├── advisorNotes (string|null) - Notas privadas (solo asesor)
├── createdAt (timestamp) - Fecha de registro
├── updatedAt (timestamp) - Última actualización
└── metadata
    ├── createdBy (string) - UID de quien creó (público o admin)
    └── ipAddress (string|null) - IP de origen (prevención de spam)
```

**Permisos**:
- Crear: Público (via API) + Admin
- Leer: Admin, Recepción, Asesor asignado, Cliente (por email)
- Actualizar: Admin, Recepción, Asesor asignado
- Eliminar: Solo admin

---

### `transactions` - Transacciones de compra/venta
Documentos con ID = appointmentId (relación 1:1)

```
transactions/{appointmentId}
├── appointmentId (string) - Referencia a cita
├── transactionCompleted (boolean) - ¿Se realizó?
├── transactionType (enum|null) - compra | venta (si completed = true)
├── transactionValue (number) - Monto en USD (>= 0)
├── internalNotes (string|null) - Notas internas
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

**Permisos**:
- Crear/Leer/Actualizar: Solo admin
- Eliminar: Solo admin

---

### `valuation_reports` - Informes de valoración
Documentos con ID = appointmentId (relación 1:1)

```
valuation_reports/{appointmentId}
├── appointmentId (string) - Referencia a cita
├── reportUrl (string) - Ruta en Storage (client-files/reports/...)
├── summary (string|null) - Resumen para el cliente
├── estimatedValue (number) - Valor estimado en USD
├── createdBy (string) - UID del asesor que lo generó
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

**Permisos**:
- Crear/Actualizar: Asesor asignado + Admin
- Leer: Admin, Asesor asignado, Cliente (por email de cita)
- Eliminar: Solo admin

---

### `client_documents` - Documentos subidos por cliente
Documentos autogenerados (document ID = UUID)

```
client_documents/{docId}
├── appointmentId (string) - FK a appointment
├── fileUrl (string) - Ruta en Storage (client-files/documents/...)
├── fileName (string) - Nombre original del archivo
├── uploadedByEmail (string) - Email del cliente que subió
├── createdAt (timestamp)
└── metadata
    ├── mimeType (string) - Tipo de archivo
    └── fileSize (number) - Tamaño en bytes
```

**Permisos**:
- Crear: Cliente (por email)
- Leer: Admin, Asesor asignado, Cliente (por email)
- Actualizar: Nadie (documentos inmutables)
- Eliminar: Solo admin

---

### `site_settings` - Configuración del sitio
Documento único con ID = 'config'

```
site_settings/config
├── brandName (string) - Nombre de la marca (ej: "Precious by Orocash")
├── brandSubtitle (string) - Subtítulo
├── bannerImageUrl (string|null) - URL del banner (en Storage/branding)
├── logoImageUrl (string|null) - URL del logo
├── updatedAt (timestamp)
└── updatedBy (string) - UID de quien actualizó
```

**Permisos**:
- Crear: Admin
- Leer: Público (necesario para landing)
- Actualizar: Admin + Editor
- Eliminar: No permitido

---

## Índices recomendados

Para optimizar consultas comunes, crear estos índices en Firestore:

1. `appointments`:
   - `email` (ASC), `appointmentDate` (DESC)
   - `appointmentStatus` (ASC), `appointmentDate` (DESC)
   - `assignedAdvisorId` (ASC), `appointmentDate` (DESC)

2. `users`:
   - `role` (ASC)

3. `client_documents`:
   - `appointmentId` (ASC), `createdAt` (DESC)

---

## Convenciones

- **Campos de fecha**: Usar `Timestamp` de Firestore (se serializa a ISO string)
- **Campos booleanos**: Usar `false` por defecto, nunca `null`
- **IDs de usuario**: Siempre el UID de Firebase Auth
- **Enums**: Usar strings en minúsculas con guiones (ej: `no_asistio`)
- **Soft deletes**: No borrar documentos, marcar con `deletedAt` timestamp
- **Auditoría**: Siempre incluir `createdAt`, `updatedAt`, y quién lo hizo

---

## Datos de ejemplo

### Usuario Admin
```json
{
  "email": "admin@precious.com",
  "name": "Administrador",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-15T10:30:00Z"
}
```

### Cita de cliente
```json
{
  "fullName": "Juan Pérez",
  "identificationNumber": "1234567890",
  "phone": "+57 3001234567",
  "email": "juan@example.com",
  "appointmentReason": "valuar",
  "appointmentDate": "2024-02-01",
  "appointmentTime": "14:30",
  "additionalComment": "Tengo un anillo de oro antiguo",
  "appointmentStatus": "pendiente",
  "assignedAdvisorId": null,
  "itemDescription": null,
  "advisorNotes": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "metadata": {
    "createdBy": "anonymous",
    "ipAddress": "192.168.1.1"
  }
}
```

---

## Scripts de inicialización

Cuando despliegues por primera vez, ejecuta estos scripts para crear la estructura inicial.
(Ver archivo `lib/firebase/init-db.ts`)
