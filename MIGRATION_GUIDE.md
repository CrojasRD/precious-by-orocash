# Guía de Migración: Supabase → Firebase

Este documento describe los cambios principales en la migración de Supabase a Firebase.

## 📊 Cambios de Arquitectura

### Autenticación
- **Antes**: `@supabase/auth`
- **Ahora**: Firebase Auth
- **Cambio**: Sesiones automáticas via cookies, sin middleware de Supabase

### Base de datos
- **Antes**: PostgreSQL (Supabase)
- **Ahora**: Firestore (NoSQL)
- **Cambio**: Documentos en lugar de tablas, queries más simples

### Almacenamiento
- **Antes**: Supabase Storage
- **Ahora**: Firebase Storage
- **Cambio**: URLs públicas para branding, privadas para documentos

### Seguridad
- **Antes**: Row Level Security (SQL)
- **Ahora**: Firestore Rules (declarativas)
- **Cambio**: Más legibles y mantenibles

## 📦 Dependencias

### Removidas
```json
{
  "@supabase/supabase-js": "^2.45.0",
  "@supabase/ssr": "^0.4.0"
}
```

### Agregadas
```json
{
  "firebase": "^10.8.1",
  "firebase-admin": "^12.0.0"
}
```

## 🔄 Mapeo de Conceptos

| Supabase | Firebase |
|----------|----------|
| `supabase.auth` | `firebase/auth` |
| `supabase.from('tabla')` | `firestore.collection()` |
| `RLS Policies` | `Firestore Rules` |
| `supabase.storage` | `firebase/storage` |
| `Realtime` | Listeners en Firestore |
| `postgres` triggers | Cloud Functions |

## 💾 Migración de Datos

Si tienes datos en Supabase, necesitarás migrarlos:

```bash
# 1. Exportar desde Supabase (SQL)
# 2. Transformar a formato JSON
# 3. Importar en Firestore via:
#    - Firebase Console UI
#    - Firebase Admin SDK
#    - Herramientas de ETL
```

### Mapeador de Tablas a Colecciones

```
users              → users/
appointments       → appointments/
transactions       → transactions/
valuation_reports  → valuation_reports/
client_documents   → client_documents/
site_settings      → site_settings/config
```

## 🔐 Reglas de Seguridad

### Antes (Supabase RLS)
```sql
create policy "Users can view their own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);
```

### Ahora (Firestore Rules)
```javascript
match /users/{userId} {
  allow read: if request.auth.uid == userId;
}
```

## 🛠️ Ejemplos de Código

### Crear documento
```typescript
// Antes (Supabase)
await supabase.from('users').insert([{ email, name, role }]);

// Ahora (Firebase)
await db.collection('users').doc(uid).set({ email, name, role });
```

### Leer documentos
```typescript
// Antes (Supabase)
const { data } = await supabase
  .from('appointments')
  .select('*')
  .eq('email', clientEmail);

// Ahora (Firebase)
const q = query(
  collection(db, 'appointments'),
  where('email', '==', clientEmail)
);
const snapshot = await getDocs(q);
```

### Actualizar
```typescript
// Antes (Supabase)
await supabase
  .from('appointments')
  .update({ status: 'confirmada' })
  .eq('id', appointmentId);

// Ahora (Firebase)
await updateDoc(doc(db, 'appointments', appointmentId), {
  status: 'confirmada',
  updatedAt: new Date(),
});
```

### Autenticación
```typescript
// Antes (Supabase)
const { data } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Ahora (Firebase)
const result = await signInWithEmailAndPassword(auth, email, password);
```

## 📋 Checklist de Migración

- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar Firestore
- [ ] Habilitar Firebase Auth
- [ ] Habilitar Firebase Storage
- [ ] Deployar Firestore Rules
- [ ] Deployar Storage Rules
- [ ] Migrar datos (si existen)
- [ ] Actualizar código del cliente
- [ ] Actualizar Server Actions
- [ ] Configurar variables de entorno
- [ ] Probar login/logout
- [ ] Probar citas
- [ ] Probar panel admin
- [ ] Probar portal cliente
- [ ] Desplegar en Vercel

## ⚠️ Consideraciones Importantes

### Limits de Firestore
- Documentos: 1MB máximo
- Read/Write: 50,000 diarias (plan free)
- Almacenamiento: 5GB (plan free)

### Cambios de Comportamiento
- Las queries son menos potentes que SQL
- Sin JOINs nativos (desnormalizar datos)
- Límites de tamaño por documento
- Costo por read/write en escala

### Migración Gradual
Puedes mantener ambas en paralelo durante la transición:
```typescript
if (process.env.USE_FIREBASE) {
  // usar Firebase
} else {
  // usar Supabase
}
```

## 🆘 Troubleshooting

### Error: "PERMISSION_DENIED"
- Revisa Firestore Rules
- Verifica que el usuario esté autenticado
- Comprueba el UID es correcto

### Error: "not-found"
- El documento no existe
- Verifica el path de la colección
- Comprueba el ID del documento

### Queries muy lentas
- Crea índices en Firestore Console
- Limita el número de documentos
- Considera denormalizar datos

## 📚 Recursos

- [Firebase Docs](https://firebase.google.com/docs)
- [Migración desde SQL](https://firebase.google.com/docs/firestore/firestore-vs-sql)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

