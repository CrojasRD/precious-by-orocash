# Precious by Orocash — Plataforma web y panel administrativo

Sitio web y sistema de gestión de citas para **Precious by Orocash**, la asesoría especializada en oro de Orocash: valuación profesional, asesoría de inversión en metales preciosos, retroventa de joyas y consultoría patrimonial en oro para inversionistas, herederos y empresarios.

Este repositorio contiene una landing page pública de conversión, un panel administrativo privado con 5 roles de acceso, y un portal de cliente, listos para pasar a desarrollo y despliegue en producción.

---

## 1. Concepto general

La web transmite confianza experta y discreción: fondo marfil/crema, acentos dorados sutiles, azul profundo (navy) como color secundario, tipografía serif (Playfair Display / Exmouth) para titulares y sans-serif (Inter) para texto, mucho espacio en blanco y transiciones suaves. El objetivo no es "vender" de forma agresiva sino **invitar a agendar una consultoría privada**, dejando que la asesoría experta cierre la conversión fuera de línea.

La experiencia se divide en tres productos independientes que comparten la misma base de datos:

- **Sitio público** (`/`): landing de una sola página con scroll suave entre secciones y un formulario de reserva de cita.
- **Panel privado** (`/admin`): aplicación protegida por autenticación con 5 roles (admin, editor, asesor, recepción, viewer — ver sección 12) donde el equipo de Precious gestiona citas, valoraciones, transacciones y usuarios.
- **Portal del cliente** (`/portal`): acceso propio para el cliente (rol `viewer`), donde ve el estado de su cita, descarga su informe de valoración y sube documentos previos a la consultoría.

## 2. Arquitectura recomendada

```
Cliente (navegador)
   │
   ├── Sitio público (Next.js App Router, Server + Client Components)
   │      └── POST /api/appointments  →  Supabase (service role, solo INSERT)
   │
   ├── Panel admin (Next.js, protegido por middleware + Supabase Auth, 5 roles)
   │      └── Server Actions  →  Supabase (sesión del usuario, RLS)
   │
   └── Portal del cliente (Next.js, protegido por middleware + Supabase Auth)
          └── Server Actions  →  Supabase (sesión del usuario, RLS)

Supabase
   ├── Auth (staff + clientes, un solo sistema de usuarios con rol por fila)
   ├── Postgres (users, appointments, transactions, valuation_reports, client_documents)
   ├── Storage (branding: público · client-files: privado, informes y documentos)
   └── Row Level Security (RLS) en cada tabla, específica por rol
```

Un único proyecto Next.js sirve las tres experiencias, separadas por rutas (`/` vs `/admin/**` vs `/portal/**`). Esto simplifica el despliegue (un solo proyecto en Vercel) y permite compartir tipos, validaciones y el cliente de Supabase.

### Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG híbrido, Server Actions, rutas API, ideal para SEO de la landing |
| UI | React 18 + Tailwind CSS | Velocidad de desarrollo, diseño a medida sin dependencias pesadas |
| Formularios | react-hook-form + zod | Validación robusta en cliente y servidor con el mismo esquema |
| Calendario | react-day-picker | Selector de fecha visual, accesible, sin dependencias de jQuery |
| Backend / DB | Supabase (Postgres + Auth + RLS) | Base de datos segura administrada, autenticación lista, políticas a nivel de fila |
| Hosting sugerido | Vercel (app) + Supabase Cloud (datos) | Despliegue continuo, HTTPS y CDN por defecto |

Alternativa igualmente válida: Firebase (Auth + Firestore) si la joyería ya usa el ecosistema de Google. Supabase se recomienda porque Postgres permite modelar relaciones (citas ↔ transacciones), RLS declarativo y consultas SQL para métricas, lo que Firestore dificulta.

## 3. Estructura de carpetas

```
precious-by-orocash/
├── app/
│   ├── page.tsx                     # Landing pública
│   ├── layout.tsx                   # Layout raíz (fuentes, metadata)
│   ├── globals.css                  # Tema visual (Tailwind)
│   ├── api/appointments/route.ts    # Endpoint público para crear citas
│   ├── admin/
│   │   ├── page.tsx                 # Redirige a /admin/dashboard
│   │   ├── login/page.tsx           # Login del panel (recuperar acceso incluido)
│   │   └── (protected)/
│   │       ├── layout.tsx           # Verifica sesión + sidebar (bloquea rol viewer)
│   │       ├── dashboard/page.tsx   # Métricas (solo admin)
│   │       ├── appointments/page.tsx      # Tabla de citas (admin, recepción)
│   │       ├── my-appointments/page.tsx   # Citas asignadas (asesor)
│   │       ├── users/page.tsx       # Gestión de usuarios y permisos (admin)
│   │       └── settings/page.tsx    # Marca del sitio (admin, editor)
│   └── portal/
│       ├── login/page.tsx           # Login del portal del cliente
│       └── page.tsx                 # Cita, informe de valoración, documentos (viewer)
├── components/
│   ├── Navbar.tsx, Footer.tsx
│   ├── BookingForm.tsx              # Formulario de reserva
│   ├── sections/                    # Hero, About, Services, Experience, Trust, BookingSection
│   ├── admin/                       # AdminSidebar, AppointmentsTable(+Modal), AdvisorAppointmentsTable(+Modal),
│   │                                 # UsersTable, MetricsCards, BrandSettingsForm
│   └── portal/PortalDashboard.tsx   # Vista del cliente
├── lib/
│   ├── supabase/client.ts           # Cliente Supabase (browser)
│   ├── supabase/server.ts           # Cliente Supabase (server + service role)
│   ├── actions/admin.ts             # Server Actions: citas, transacciones, site_settings
│   ├── actions/advisor.ts           # Server Actions: ficha del cliente y valoración (asesor)
│   ├── actions/users.ts             # Server Actions: invitar/editar rol/borrar usuarios (admin)
│   ├── actions/portal.ts            # Server Action: registrar documento subido por el cliente
│   ├── auth/require-role.ts         # Guard de servidor por rol + roleHomePath()
│   ├── validations/appointment.ts   # Esquema zod del formulario
│   ├── types.ts                     # Tipos de dominio (estados, motivos, roles)
│   └── database.types.ts            # Tipos generados desde el esquema SQL
├── supabase/schema.sql              # Esquema completo, RLS, triggers, vista de métricas
├── middleware.ts                    # Protección de rutas /admin/** y /portal/**
└── .env.example
```

## 4. Modelo de base de datos

Seis tablas principales en Postgres (Supabase), con relaciones estrictas y RLS habilitado en todas. Definición completa en `supabase/schema.sql`.

### `users` (perfiles de acceso, vinculado a `auth.users`)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK, FK a auth.users) | |
| name | text | |
| email | text (único) | |
| role | enum | admin, editor, asesor, recepcion, viewer (default: viewer) |
| created_at | timestamptz | |

### `appointments`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | generado automáticamente |
| full_name | text | obligatorio |
| identification_number | text | obligatorio, indexado |
| phone | text | obligatorio |
| email | text | obligatorio (usado para vincular al cliente en el portal) |
| appointment_reason | enum | valuar, inversion, liquidar, asesoria_patrimonial, otro |
| appointment_date | date | obligatorio, indexado |
| appointment_time | time | obligatorio |
| additional_comment | text | opcional |
| appointment_status | enum | pendiente, confirmada, atendida, no_asistio, cancelada (default: pendiente) |
| assigned_advisor_id | uuid (FK a users) | asesor/tasador responsable de la cita |
| item_description | text | descripción del oro/gema traído por el cliente |
| advisor_notes | text | notas privadas del asesor, nunca visibles para el cliente |
| created_at / updated_at | timestamptz | automáticos |

### `transactions` (relación 1:1 con `appointments`, solo admin)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| appointment_id | uuid (FK única) | referencia a `appointments.id`, `on delete cascade` |
| transaction_completed | boolean | ¿se realizó transacción? |
| transaction_type | enum | compra, venta (solo si completed = true) |
| transaction_value | numeric(12,2) | monto en USD, `>= 0` |
| internal_notes | text | observaciones del staff |
| created_at / updated_at | timestamptz | automáticos |

### `valuation_reports` (relación 1:1 con `appointments`)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| appointment_id | uuid (FK única) | referencia a `appointments.id`, `on delete cascade` |
| report_url | text | ruta del PDF en el bucket privado `client-files` |
| summary | text | resumen para el cliente |
| estimated_value | numeric(12,2) | valor estimado en USD |
| created_by | uuid (FK a users) | asesor que generó el informe |
| created_at / updated_at | timestamptz | automáticos |

### `client_documents` (N:1 con `appointments`)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| appointment_id | uuid (FK) | referencia a `appointments.id`, `on delete cascade` |
| file_url | text | ruta del archivo en `client-files` |
| file_name | text | nombre original del archivo |
| uploaded_by_email | text | correo del cliente que lo subió |
| created_at | timestamptz | |

Se incluye además la vista `appointment_metrics`, que agrega en una sola consulta el total de citas, su desglose por estado, el total de transacciones y los montos de compra/venta/total — usada directamente por el dashboard (solo visible para `admin`).

## 5. Flujo del cliente (sitio público)

1. Llega a la landing desde redes, buscador o referido y recorre las secciones (marca, servicios, experiencia, confianza).
2. Hace clic en "Agendar consultoría" (visible en el navbar, el hero y al final de la página) y llega al formulario.
3. Completa nombre, cédula, celular, correo, motivo (select), fecha (calendario visual, sin fechas pasadas) y hora (franjas predefinidas), con comentario opcional.
4. El formulario valida en el cliente (react-hook-form + zod) antes de permitir el envío.
5. Al enviar, `POST /api/appointments` vuelve a validar en el servidor, aplica un límite de solicitudes por IP y un campo honeypot anti-spam, y luego inserta el registro con la service role key de Supabase (el visitante nunca tiene acceso directo a la base de datos).
6. Se muestra la confirmación: *"Su cita ha sido registrada correctamente. Un asesor de Precious by Orocash lo recibirá en la fecha seleccionada."*

## 6. Flujo del panel privado (por rol)

Todos los roles entran por `/admin/login` con correo y contraseña (Supabase Auth). El middleware bloquea cualquier ruta `/admin/**` sin sesión válida, y el layout del panel repite la verificación en el servidor (`lib/auth/require-role.ts`), redirigiendo a cada rol a su propia página de inicio si intenta entrar a una ruta que no le corresponde.

**Admin** — acceso total:
1. `/admin/dashboard`: métricas globales (citas, transacciones, montos de compra/venta).
2. `/admin/appointments`: tabla completa de citas con filtros, cambio de estado y registro de transacciones.
3. `/admin/users`: crea usuarios (envía invitación por correo), cambia roles, reenvía acceso o elimina cuentas.
4. `/admin/settings`: edita banner, logotipo y texto de marca.

**Recepción** — agenda y confirmación:
1. `/admin/appointments`: mismo listado que admin, pero sin ver montos de transacción (bloqueado por RLS, la columna se muestra vacía). Puede cambiar el estado de la cita (confirmar, marcar atendida/no asistió) y registrar la asistencia.

**Asesor / Tasador** — solo sus citas asignadas:
1. `/admin/my-appointments`: lista únicamente las citas donde `assigned_advisor_id` es su propio usuario (impuesto por RLS, no por un filtro de UI).
2. En el detalle de cada cita describe el oro/gema traído (`item_description`), agrega notas privadas (`advisor_notes`, nunca visibles para el cliente) y genera el informe de valoración (valor estimado, resumen y PDF, subido al bucket privado `client-files`).

**Editor** — solo contenido:
1. `/admin/settings`: banner, logotipo y texto de marca. Sin acceso a citas, transacciones, valoraciones ni usuarios.

## 7. Portal del cliente (rol viewer)

1. El cliente recibe una invitación (creada por un admin desde `/admin/users` con rol `viewer`) y entra en `/portal/login`.
2. En `/portal` ve la(s) cita(s) asociadas a su correo (RLS compara `appointments.email` con el correo de su cuenta), el estado actual, el informe de valoración (si ya fue publicado, con botón de descarga vía URL firmada del bucket privado) y puede subir documentos previos a la cita (fotos de las piezas, facturas anteriores).
3. "Recuperar acceso" en el login envía un correo de restablecimiento de contraseña (`supabase.auth.resetPasswordForEmail`).

## 8. Diseño UX/UI

- Paleta: crema `#FAF7F1`, marfil `#F4EFE4`, dorado `#B08D57` (con variante clara/oscura), azul profundo `#0E1B2C` como color de contraste y texto.
- Tipografía: Playfair Display (serif, titulares) + Inter (sans, cuerpo), con tracking amplio en textos en mayúsculas para transmitir sobriedad.
- Componentes con bordes finos en vez de sombras marcadas, botones rectos sin bordes redondeados agresivos, animaciones de aparición suaves (`fade-up`, `fade-in`).
- Imágenes de referencia en el prototipo (Unsplash) deben reemplazarse por fotografía de producto real, en alta resolución, con fondo neutro y luz cálida — es el elemento con mayor impacto en la percepción de "alto valor".
- Diseño responsive mobile-first: navegación colapsable, formulario en una columna en móvil y dos en escritorio, tablas del panel con scroll horizontal en pantallas pequeñas.

## 9. Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# completar NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY

# 3. Crear el esquema en Supabase
# Pegar el contenido de supabase/schema.sql en el SQL Editor del proyecto Supabase y ejecutar

# 4. Crear el primer administrador
# Supabase Dashboard → Authentication → Users → Add user (correo + contraseña)
# El trigger handle_new_auth_user() crea automáticamente su fila en "users" con rol "viewer" (el menos privilegiado).
# Para hacerlo "admin": update public.users set role = 'admin' where email = 'correo@dominio.com';
# A partir de ahí, el resto del equipo se invita desde /admin/users con el rol correspondiente
# (no hace falta volver a tocar el SQL Editor).

# 5. Levantar en desarrollo
npm run dev
```

## 10. Recomendaciones de seguridad

- **Row Level Security activo en todas las tablas**: el público solo puede insertar citas (nunca leer, actualizar ni borrar); cada tabla exige explícitamente el/los rol(es) permitidos (`role in (...)`), nunca "cualquier usuario autenticado".
- **Service role key solo en el servidor**: se usa en `app/api/appointments/route.ts` (citas públicas) y en `lib/actions/users.ts` (invitar/editar/borrar usuarios vía Supabase Auth Admin API); nunca se expone al navegador ni se usa en componentes cliente.
- **Doble verificación de sesión y rol** en el panel: el `middleware.ts` redirige antes de renderizar, el layout de `/admin/(protected)` bloquea al rol `viewer`, y cada página vuelve a llamar a `requireRole()` en el servidor con la lista exacta de roles permitidos.
- **Rate limiting y honeypot** en el endpoint público para mitigar spam y bots; se recomienda añadir Google reCAPTCHA v3 antes de producción (ya hay un punto de integración marcado con `TODO` en el código y variables preparadas en `.env.example`).
- **Validación duplicada**: el mismo esquema zod valida en cliente (UX inmediata) y servidor (seguridad real — nunca confiar solo en el cliente).
- **Gestión de sesiones**: cookies HTTP-only administradas por `@supabase/ssr`, con expiración y renovación automática del token.
- **Principio de mínimo privilegio**: cada rol solo ve/edita exactamente lo que su función requiere (ver sección 12); solo `admin` puede borrar citas, ver transacciones y gestionar usuarios.
- **Documentos y valoraciones en bucket privado**: `client-files` no es público; el acceso se resuelve por política RLS de Storage (asesor asignado, admin, recepción o el propio cliente por coincidencia de email) y las descargas del portal usan URLs firmadas de corta duración.
- **HTTPS obligatorio** en producción (por defecto en Vercel) y cabeceras de seguridad recomendadas (`Strict-Transport-Security`, `X-Frame-Options`) a nivel de `next.config.js` o Vercel.

## 11. Protección de datos personales del cliente

- Los campos sensibles (cédula, teléfono, correo) solo son legibles por personal autenticado; nunca se exponen en el HTML del sitio público ni en respuestas de la API pública.
- Se recomienda definir una política de retención (por ejemplo, anonimizar o eliminar citas con más de 24 meses sin actividad) y documentarla en un aviso de privacidad enlazado desde el formulario.
- El pie de página y el formulario deben incluir un texto breve de privacidad (ya incluido: *"Sus datos son confidenciales y se usan únicamente para gestionar su cita"*), idealmente enlazando a una política de privacidad completa antes de salir a producción.
- Evitar registrar información de piezas o transacciones en campos de texto libre visibles públicamente; todo lo relativo a transacciones vive exclusivamente en `transactions`, protegido por RLS.
- Considerar cifrado a nivel de columna (pgsodium/Vault de Supabase) para cédula si la política interna de la joyería lo exige.

## 12. Recomendaciones para mejorar la conversión

- Mantener el botón "Agendar consultoría" visible en el navbar, el hero y el cierre de página (ya implementado) para capturar la intención en cualquier punto del scroll.
- Formulario corto: solo los campos indispensables están marcados como obligatorios; el comentario adicional es opcional para no fricción.
- Confirmación clara e inmediata tras el envío, sin redirecciones que generen duda sobre si la cita quedó registrada.
- Mensajes de confianza distribuidos en toda la página (respaldo de Orocash, procesos transparentes, atención profesional) en lugar de concentrados solo al final.
- Fotografía de producto de alta calidad: es el factor que más influye en la percepción de "alto valor" en clientes premium; vale la pena una sesión fotográfica profesional antes del lanzamiento.
- Copys en tono privado y personal ("Un asesor lo recibirá...") en vez de lenguaje transaccional o genérico de e-commerce.
- Considerar, en una segunda fase, testimonios discretos o cifras de respaldo (años de trayectoria de Orocash, piezas valoradas) sin comprometer la privacidad de clientes reales.
- Analítica de conversión: instrumentar el evento de envío del formulario (GA4 o Plausible) para medir la tasa de visitas → citas agendadas.

## 13. Sistema de 5 roles y gestión de usuarios

`users.role` acepta cinco valores. Cada uno tiene un alcance acotado, impuesto en tres capas independientes: políticas RLS en `supabase/schema.sql` (la barrera real, a nivel de base de datos), `requireRole()` en cada página del servidor (`lib/auth/require-role.ts`), y el menú lateral (`AdminSidebar.tsx`), que solo muestra los enlaces que ese rol puede usar.

| Rol | Quién | Puede | No puede |
|---|---|---|---|
| **admin** | Oma + Gerente | Todo: citas, transacciones, valoraciones, documentos, usuarios, configuración, métricas. | — |
| **editor** | David Choez (Marketing) | Editar banner, logotipo y texto de marca en `/admin/settings`. | Ver clientes, citas, transacciones ni valoraciones. |
| **asesor / tasador** | El experto en oro | Ver y gestionar solo sus citas asignadas (`/admin/my-appointments`): ficha del cliente, descripción del oro/gema, notas privadas, generar el informe de valoración. | Ver datos financieros (`transactions`), editar contenido del sitio, ver citas de otros asesores. |
| **recepción** | Quien agenda | Calendario de todas las citas (`/admin/appointments`), confirmar citas, registrar clientes nuevos, registro de asistencia. | Ver montos de transacciones, editar contenido, generar valoraciones. |
| **viewer** | El cliente | Portal (`/portal`): ver su propia cita, descargar su informe de valoración, subir documentos previos a la cita. | Cualquier ruta de `/admin/**` (se le redirige automáticamente a `/portal`). |

**Gestión desde el panel (`/admin/users`, solo admin):**
1. El botón "Nuevo usuario" abre un formulario (nombre, correo, rol) que llama a la Server Action `inviteUser()` (`lib/actions/users.ts`), la cual usa el cliente **service-role** de Supabase para invitar al usuario por correo (`supabase.auth.admin.inviteUserByEmail`) — el propio usuario define su contraseña al aceptar la invitación.
2. El trigger `handle_new_auth_user()` lee el rol desde `raw_user_meta_data` y crea automáticamente la fila correspondiente en `public.users`.
3. Desde la misma tabla se puede cambiar el rol de un usuario (`updateUserRole`), reenviar el correo de recuperación de acceso (`sendPasswordReset`, también disponible como enlace "Recuperar acceso" en `/admin/login` y `/portal/login`) o eliminar el acceso por completo (`deleteUser`, borra el usuario de Supabase Auth y, en cascada, su fila en `public.users`).
4. Todas estas acciones verifican primero, con la sesión normal (sujeta a RLS), que quien las ejecuta es realmente `admin`, antes de usar el cliente service-role.

**Migrar un proyecto con el rol anterior `jewelry_staff`:** ese rol ya no existe. Antes de ejecutar el nuevo `schema.sql` en un proyecto con datos reales, reasigna manualmente cada usuario `jewelry_staff` a `asesor` o `recepcion` según corresponda (`update public.users set role = 'asesor' where email = '...';`).

## 14. Marca editable desde el panel (banner, logotipo y tipografía)

Se agregó una tabla `site_settings` (fila única) más un bucket público de Supabase Storage (`branding`), para que la joyería pueda administrar su propia marca sin tocar código:

- **`/admin/settings`**: nueva sección del panel donde el staff autenticado puede subir el banner principal del hero, subir una imagen de logo (o quitarla para volver al logotipo de texto) y editar el nombre/subtítulo del logotipo.
- El formulario (`components/admin/BrandSettingsForm.tsx`) sube el archivo directamente al bucket `branding` desde el navegador (usando la sesión del usuario, protegida por las políticas de Storage en `supabase/schema.sql`) y luego guarda la URL resultante mediante la Server Action `updateSiteSettings`.
- La landing pública (`app/page.tsx`) lee `site_settings` en cada carga y pasa el banner/logotipo a `Hero`, `Navbar` y `Footer`; si no hay banner o logo cargados, se muestran los valores por defecto de la marca.
- RLS: cualquiera puede leer `site_settings` (la landing lo necesita), pero solo el staff autenticado puede actualizarlo; el bucket `branding` es de lectura pública y escritura solo para staff autenticado.

**Tipografía "Exmouth":** se integró como fuente de titulares (variable `--font-display`, usada por `font-serif` en Tailwind) mediante `@font-face` autoalojado en `app/globals.css`, ya que no está disponible en Google Fonts. Los archivos de la fuente no se incluyen en el repositorio por licencia; sigue las instrucciones en `public/fonts/README.md` para descargarla (es una fuente gratuita de PrimaFont, disponible en dafont.com y sitios equivalentes) y colocarla en `public/fonts/`. Mientras no se agreguen los archivos, el sitio usa automáticamente el respaldo `Playfair Display` / `Georgia` sin romperse.

## 15. Próximos pasos hacia producción

1. Reemplazar imágenes de referencia por fotografía real.
2. Integrar reCAPTCHA v3 en el formulario público.
3. Configurar notificaciones automáticas (email/WhatsApp) al cliente y al staff cuando se registra o cambia el estado de una cita, y cuando se publica un informe de valoración.
4. Definir y publicar la política de privacidad y términos de uso, incluyendo el tratamiento de documentos subidos por el cliente en el portal.
5. Migrar el rate limiter en memoria a un almacén compartido (Upstash Redis o Vercel KV) si se despliega en un entorno serverless con múltiples instancias.
6. Ejecutar pruebas de accesibilidad (contraste, navegación por teclado) y de rendimiento (Lighthouse) antes del lanzamiento.
7. Configurar backups automáticos y alertas de uso en el proyecto de Supabase.
8. Definir un flujo formal de alta de cliente en el portal (hoy el acceso `viewer` se crea manualmente desde `/admin/users`; en producción conviene automatizarlo al confirmar la primera cita).
