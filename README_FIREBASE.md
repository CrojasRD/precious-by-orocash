# Precious by Orocash — Plataforma web con Firebase

🏆 Sitio web y panel administrativo para **Precious by Orocash**, especializada en asesoría de inversión en metales preciosos.

## 🌟 Stack Tecnológico

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Hosting**: Vercel
- **Estilos**: Tailwind CSS
- **Validación**: React Hook Form + Zod
- **Seguridad**: Row-level rules + Rate limiting + reCAPTCHA v3

## 📋 Características

### 🌐 Sitio Público
- Landing page responsiva con formulario de reserva
- Validación en cliente y servidor
- Protección anti-spam (rate limiting + honeypot)
- Google reCAPTCHA v3 integrado

### 🔐 Panel Administrativo
- 5 roles con permisos diferenciados
- Dashboard con métricas en tiempo real
- Gestión de citas y usuarios
- Editor de marca sin código
- Portal del cliente privado

### 👤 Portal del Cliente
- Ver estado de cita
- Descargar informe de valoración
- Subir documentos previos

## 🚀 Inicio Rápido

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/precious-by-orocash.git
cd precious-by-orocash
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
# Completa .env.local con tus credenciales de Firebase
```

### 4. Iniciar servidor
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Documentación

| Documento | Descripción |
|-----------|------------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guía paso a paso para desplegar en Vercel |
| [firestore.schema.md](./firestore.schema.md) | Estructura completa de Firestore |
| [firestore.rules](./firestore.rules) | Reglas de seguridad de Firestore |
| [storage.rules](./storage.rules) | Reglas de seguridad de Storage |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guía de contribución |

## 🔑 Roles y Permisos

| Rol | Función | Permisos |
|-----|---------|----------|
| **admin** | Gerencia total | Todo acceso + gestión de usuarios |
| **editor** | Edición de marca | Solo `/admin/settings` |
| **asesor** | Tasador de oro | Ver/editar solo sus citas asignadas |
| **recepción** | Agenda de citas | Ver todas, cambiar estado, registrar asistencia |
| **viewer** | Cliente | Portal: ver cita, informe, subir docs |

## 🔒 Seguridad

- ✅ Firestore Rules basadas en roles
- ✅ Firebase Auth con sesiones seguras
- ✅ Rate limiting contra spam
- ✅ CSRF protection
- ✅ reCAPTCHA v3 en formulario público
- ✅ Validación de entrada (Zod)
- ✅ Headers de seguridad (CSP, HSTS, etc)
- ✅ Storage privado para documentos sensibles

## 📁 Estructura del Proyecto

```
precious-by-orocash/
├── app/
│   ├── page.tsx              # Landing pública
│   ├── layout.tsx            # Layout raíz
│   ├── globals.css           # Estilos globales
│   ├── api/appointments/     # API pública (citas)
│   ├── admin/                # Panel administrativo
│   │   ├── login/            # Login staff
│   │   └── (protected)/      # Rutas protegidas
│   └── portal/               # Portal del cliente
├── components/
│   ├── admin/                # Componentes del panel
│   ├── sections/             # Secciones de landing
│   └── ...
├── lib/
│   ├── firebase/
│   │   ├── config.ts         # Configuración Firebase Admin
│   │   ├── client.ts         # Firebase Cliente
│   │   ├── auth-context.tsx  # Context de autenticación
│   │   ├── db-service.ts     # Servicios de Firestore
│   │   └── storage-service.ts# Servicios de Storage
│   ├── security/             # Utilidades de seguridad
│   └── ...
├── firestore.rules           # Reglas de Firestore
├── storage.rules             # Reglas de Storage
├── .env.example              # Variables de entorno
├── DEPLOYMENT.md             # Guía de despliegue
└── ...
```

## 🔧 Comandos disponibles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start

# Linter
npm run lint
```

## 🌐 Despliegue

### En Vercel

1. Push a GitHub
2. Conecta en Vercel Dashboard
3. Configura variables de entorno
4. Deploy automático ✨

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para detalles completos.

## 📊 Firestore Schema

Colecciones principales:
- `users` - Perfiles de staff
- `appointments` - Citas de clientes
- `transactions` - Compra/venta de oro
- `valuation_reports` - Informes de valoración
- `client_documents` - Documentos subidos
- `site_settings` - Configuración de marca

Ver [firestore.schema.md](./firestore.schema.md) para detalles.

## 🤝 Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md) para saber cómo contribuir.

## 📝 Licencia

Privado © 2024 Precious by Orocash

## 💬 Soporte

Para problemas, revisa:
1. [Troubleshooting en DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)
2. Issues en GitHub
3. [Firebase Docs](https://firebase.google.com/docs)

---

**Última actualización**: Enero 2024
**Versión**: 2.0 (Firebase)
