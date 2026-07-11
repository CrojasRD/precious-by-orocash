# Firebase Firestore Setup Guide

## 1. Deploy Firestore Security Rules

Las reglas de seguridad están en `firestore.rules`. Deben desplegarse en Firebase Console.

### Opción A: Desde Firebase CLI (Recomendado)

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login en Firebase
firebase login

# Seleccionar proyecto
firebase use precious-by-orocash

# Desplegar reglas
firebase deploy --only firestore:rules
```

### Opción B: Desde Firebase Console

1. Ve a https://console.firebase.google.com
2. Selecciona proyecto: **precious-by-orocash**
3. En el menú izquierdo: **Firestore Database**
4. Pestaña: **Rules**
5. Copia el contenido de `firestore.rules` del repositorio
6. Pega en el editor de reglas
7. Click: **Publish**

## 2. Verificar Estructura de Colecciones

Firestore crea colecciones automáticamente cuando insertas documentos, pero puedes crear las colecciones manualmente para organizarlas mejor.

### Colecciones necesarias:

- **users** - Perfiles de usuarios (solo admin)
- **appointments** - Citas públicas y privadas
- **transactions** - Transacciones (solo admin)
- **valuation_reports** - Informes de valoración
- **client_documents** - Documentos de cliente
- **site_settings** - Configuración del sitio

## 3. Crear Documento de Configuración Inicial

Crea manualmente este documento para que el sitio web funcione:

**Colección**: `site_settings`  
**Documento ID**: `config`

**Contenido**:
```json
{
  "brand_name": "PRECIOUS",
  "brand_subtitle": "by Orocash",
  "hero_banner_url": null,
  "logo_image_url": null,
  "updatedAt": "2024-01-01T00:00:00Z",
  "updatedBy": "admin"
}
```

## 4. Crear Usuario Admin Inicial

Para acceder al panel de admin, necesitas un usuario admin en Firestore.

### Pasos:

1. **Crear en Firebase Auth**:
   - Firebase Console → Authentication → Users
   - Click: **Add user**
   - Email: `admin@precious.com`
   - Password: (genera una segura)
   - Click: **Add user**
   - Copia el **User UID**

2. **Crear documento en Firestore**:
   - Colección: `users`
   - Documento ID: (pega el UID del paso anterior)
   - Contenido:
   ```json
   {
     "email": "admin@precious.com",
     "name": "Administrador",
     "role": "admin",
     "createdAt": "2024-01-01T00:00:00Z",
     "lastLogin": null
   }
   ```

## 5. Verificar Reglas de Seguridad

Las reglas permitirán:

### Citas públicas (sin login):
- ✅ **Crear**: Cualquiera puede crear citas desde el formulario
- ✅ **Leer**: Solo admin, recepción, asesor asignado, o cliente (por email)
- ❌ **Actualizar**: Solo admin/recepción/asesor
- ❌ **Eliminar**: Solo admin

### Usuarios:
- ❌ **Crear**: Solo admin (vía script)
- ✅ **Leer**: Usuario a sí mismo + admin
- ✅ **Actualizar**: Solo admin
- ❌ **Eliminar**: Solo admin

### Transacciones, Informes, Documentos:
- ✅ **Crear/Leer/Actualizar**: Según rol de usuario
- ❌ **Crear público**: No permitido

## 6. Crear Índices (Opcional pero recomendado)

Para optimizar consultas, crea estos índices en Firestore:

**Colección: appointments**
- `email` (ASC), `appointmentDate` (DESC)
- `appointmentStatus` (ASC), `appointmentDate` (DESC)
- `assignedAdvisorId` (ASC), `appointmentDate` (DESC)

Firestore te notificará automáticamente si una consulta necesita un índice.

## 7. Verificar que Todo Funciona

1. Abre https://precious.ec
2. Navega a la sección "AGENDAR CONSULTORÍA"
3. Completa el formulario:
   - Nombre: Prueba
   - Cédula: 1234567890
   - Teléfono: 1234567890
   - Email: test@example.com
   - Motivo: Quiero valuar mis joyas/oro
   - Hora: 09:00 - 10:00 AM
   - Fecha: Hoy o mañana
4. Click: **Confirmar cita privada**
5. Esperado: Mensaje de éxito "Su cita ha sido registrada correctamente"

## 8. Ver Cita en Firebase

Si el paso 7 funcionó:

1. Firebase Console → Firestore Database
2. Colección: `appointments`
3. Deberías ver un nuevo documento con los datos
4. Los campos deben estar en **camelCase**: `fullName`, `appointmentReason`, etc.

## Troubleshooting

### Error: "Solicitud rechazada" (400)
- Significa que el honeypot detectó spam. Intenta nuevamente sin llenar campos ocultos.

### Error: "Datos inválidos" (422)
- Validación fallida. Revisa:
  - Nombre: mín 3 caracteres
  - Cédula: mín 5 caracteres (números y letras)
  - Teléfono: mín 7 caracteres (solo números, +, espacios, guiones)
  - Email: debe ser válido
  - Motivo: debe ser uno de: valuar, inversion, liquidar, asesoria_patrimonial, otro
  - Fecha: debe ser hoy o posterior

### Error: "No se pudo registrar la cita" (500)
- Error de servidor. Verifica:
  - Variables de entorno Firebase están configuradas
  - Reglas de Firestore permiten crear (`allow create: if !isAuth() || isStaff();`)
  - Conexión a Firebase funciona

### Las citas no aparecen en Firestore
- Las reglas de Firestore pueden estar bloqueando escrituras
- Verifica que `firestore.rules` esté desplegado correctamente
- Usa Firebase CLI: `firebase deploy --only firestore:rules`

## Campos de una Cita (appointments)

```javascript
{
  fullName: string,                    // Nombre del cliente
  identificationNumber: string,        // Cédula/Pasaporte
  phone: string,                       // Teléfono
  email: string,                       // Email
  appointmentReason: string,           // valuar | inversion | liquidar | asesoria_patrimonial | otro
  appointmentDate: string,             // YYYY-MM-DD
  appointmentTime: string,             // HH:mm
  additionalComment: string | null,    // Comentario opcional
  appointmentStatus: "pendiente",      // Siempre "pendiente" al crear
  assignedAdvisorId: null,             // Se asigna después por admin
  itemDescription: null,               // Se añade después
  advisorNotes: null,                  // Notas del asesor
  createdAt: string,                   // ISO timestamp
  updatedAt: string,                   // ISO timestamp
  metadata: {
    createdBy: "anonymous",            // Citas públicas siempre anónimas
    ipAddress: string                  // IP del cliente
  }
}
```

---

**Próximo paso**: Después de desplegar, intenta agendar una cita desde https://precious.ec
