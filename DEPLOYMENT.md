# Guía de Despliegue - Precious by Orocash

Esta guía te llevará paso a paso a través del despliegue en Vercel con Firebase.

## Requisitos previos

- Node.js 18+ instalado
- Git instalado
- Cuenta en Firebase Console (https://console.firebase.google.com)
- Cuenta en Vercel (https://vercel.com)
- Cuenta en GitHub (https://github.com)

---

## Paso 1: Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear un proyecto"
3. Ingresa el nombre: `precious-by-orocash`
4. Desactiva "Enable Google Analytics" (opcional)
5. Haz clic en "Crear proyecto"

Espera a que se complete la creación (1-2 minutos).

---

## Paso 2: Obtener credenciales de Firebase

### Credenciales del cliente (públicas)

1. En Firebase Console, ve a la sección "Proyecto" → "Configuración del proyecto"
2. Desplázate hasta "Aplicaciones"
3. Haz clic en el ícono de `</>` para crear una aplicación web
4. Ingresa el nombre: `precious-web`
5. Marca "También configurar Firebase Hosting" (opcional)
6. Haz clic en "Registrar aplicación"
7. Copia la configuración que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

Guarda estos valores.

### Credenciales del servidor (privadas)

1. En Firebase Console, ve a "Proyecto" → "Configuración del proyecto" → "Cuentas de servicio"
2. Haz clic en "Generar nueva clave privada" (JSON)
3. Se descargará un archivo JSON con tu credencial
4. Abre el archivo y copia el contenido

---

## Paso 3: Configurar Firestore

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" (lo cambiaremos después)
4. Selecciona la ubicación: `nam5` (Norteamérica)
5. Haz clic en "Crear"

Espera a que se complete (~1 minuto).

---

## Paso 4: Configurar autenticación

1. En Firebase Console, ve a "Authentication"
2. Haz clic en la pestaña "Sign-in method"
3. Habilita "Email/Password":
   - Haz clic en "Email/Password"
   - Marca "Activar"
   - Marca también "Habilitar invitación por correo"
   - Haz clic en "Guardar"

---

## Paso 5: Configurar Storage

1. En Firebase Console, ve a "Storage"
2. Haz clic en "Comenzar"
3. Selecciona región: `us-central1`
4. Aceptas las reglas de seguridad por defecto
5. Haz clic en "Listo"

Espera a que se complete (~2 minutos).

---

## Paso 6: Desplegar reglas de Firestore

1. En Firebase Console, ve a "Firestore Database" → "Reglas"
2. Reemplaza el contenido con el de `firestore.rules` (que se crea en el paso siguiente)
3. Haz clic en "Publicar"

---

## Paso 7: Configurar variables de entorno localmente

1. Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Abre `.env.local` y completa con tus credenciales de Firebase:

```bash
# Cliente (públicas)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

# Servidor (privadas - del JSON descargado)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Otros
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Nota importante**: La `FIREBASE_PRIVATE_KEY` debe mantener el formato `\n` para saltos de línea. Si la pegas directamente del JSON, asegúrate de escapar correctamente.

---

## Paso 8: Prueba local

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre http://localhost:3000 en tu navegador
4. Prueba:
   - Llenar el formulario de reserva en la landing
   - Navegar a `/admin/login` e intentar crear el primer usuario

---

## Paso 9: Crear el primer administrador

### Opción A: Desde la UI (recomendado)

1. Ve a `http://localhost:3000/admin/login`
2. Haz clic en "¿No tienes cuenta?"
3. Completa: Email y contraseña
4. El usuario se crea automáticamente como `viewer`
5. Para hacerlo `admin`, ve a Firestore:
   - Colección `users`
   - Busca el documento de tu email
   - Edita el campo `role` a `admin`

### Opción B: Desde Firebase Console

1. Ve a "Authentication" → "Users"
2. Haz clic en "Agregar usuario"
3. Ingresa email y contraseña
4. Haz clic en "Agregar usuario"
5. En Firestore, crea un documento en `users` con:
   ```json
   {
     "email": "admin@precious.com",
     "name": "Administrador",
     "role": "admin",
     "createdAt": "2024-01-01T00:00:00Z"
   }
   ```

---

## Paso 10: Desplegar en Vercel

### Paso 10a: Configurar repositorio GitHub

1. Crea un repositorio en GitHub (sin README)
2. En tu terminal:

```bash
cd precious-by-orocash
git init
git add .
git commit -m "Initial commit: Precious by Orocash with Firebase"
git remote add origin https://github.com/tu-usuario/precious-by-orocash.git
git branch -M main
git push -u origin main
```

### Paso 10b: Conectar a Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Haz clic en "Continue"

### Paso 10c: Configurar variables de entorno en Vercel

1. En la pantalla "Environment Variables":
2. Ingresa todas las variables del `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789:web:abc...
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-abc@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_SITE_URL = https://tu-dominio.vercel.app
```

3. Haz clic en "Deploy"

Vercel construirá e implementará tu aplicación (~3-5 minutos).

---

## Paso 11: Actualizar URLs en Firebase

1. Ve a Firebase Console → Proyecto → Configuración del proyecto
2. En "Dominio autorizado" agrega:
   - `localhost:3000` (desarrollo local)
   - Tu URL de Vercel (ej: `precious-by-orocash.vercel.app`)
   - Tu dominio personalizado (cuando lo tengas)

3. Ve a Firebase → Storage → Reglas
4. Actualiza `STORAGE_BUCKET` si es necesario

---

## Paso 12: Configurar dominio personalizado (opcional)

1. Compra un dominio (Namecheap, Google Domains, etc.)
2. En Vercel, ve a tu proyecto → Configuración → Dominios
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS
5. Actualiza en Firebase las URLs autorizadas

---

## Troubleshooting

### Error: "FIREBASE_PRIVATE_KEY is undefined"

**Causa**: La clave privada no se escapó correctamente.

**Solución**: En `.env.local`, asegúrate de que sea exactamente así:

```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

No agregues espacios extras. Si lo hiciste desde el JSON, ve línea por línea y cambia cada salto real por `\n`.

### Error: "auth/invalid-api-key"

**Causa**: API Key incorrecto o deshabilitado en Firebase.

**Solución**:
1. Ve a Firebase Console → Configuración del proyecto → Claves de API
2. Verifica que la clave esté habilitada
3. Verifica en `vercel.json` que el nombre de la variable sea exacto

### Las citas no se guardan

**Causa**: Reglas de Firestore muy restrictivas.

**Solución**:
1. Temporalmente, en Firestore, abre en "modo de prueba" (permitir todas las lecturas/escrituras)
2. Prueba de nuevo
3. Luego, aplica las reglas de `firestore.rules` gradualmente

### Error de CORS en Storage

**Causa**: Las reglas de Storage son muy restrictivas.

**Solución**: En Firebase Console → Storage → Reglas, asegúrate de que:
- Lectura: cualquiera (para imágenes públicas como banner)
- Escritura: solo usuarios autenticados

---

## Monitoreo en Producción

1. **Firebase Console**:
   - Revisa "Usage" regularmente
   - Configura alertas en "Alertas de facturación"

2. **Vercel**:
   - Ve a tu proyecto → "Analytics"
   - Monitorea "Response Time" y "Functions"

3. **Logging**:
   - Usa `console.log` en desarrollo
   - En producción, considera integrar Sentry o similar

---

## Actualizaciones futuras

Para hacer push de nuevos cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Vercel desplegará automáticamente (~2-3 minutos).

---

## Recursos adicionales

- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

¿Preguntas? Revisa los logs de Vercel o Firebase Console.
