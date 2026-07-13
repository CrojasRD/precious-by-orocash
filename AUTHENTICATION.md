# Firebase Authentication Implementation

## Overview

This document describes the complete Firebase authentication system implemented for the Precious by Orocash application.

## Architecture

### Components

1. **Firebase Client** (`lib/firebase/client.ts`)
   - Initializes Firebase with public configuration
   - Connects to Auth, Firestore, and Storage
   - Supports local emulators in development

2. **Firebase Admin SDK** (`lib/firebase/admin-config.ts`)
   - Server-side admin initialization
   - Used for server actions and API routes

3. **Auth Context** (`lib/firebase/auth-context.tsx`)
   - React context for managing auth state
   - Tracks current user and role
   - Auto-refreshes user data from Firestore

4. **API Routes** (`app/api/auth/`)
   - `/login` - Creates session with secure cookies
   - `/logout` - Clears session
   - `/verify-role` - Returns user role from Firestore
   - `/update-last-login` - Updates last login timestamp

### User Roles

- **admin** - Full access to admin panel and user management
- **editor** - Can manage content and appointments
- **asesor** - Can manage their own appointments
- **recepcion** - Can manage reception-level tasks
- **viewer** - Client portal access (customers)

## Flow

### Login Flow

1. User enters email/password on login page
2. Client authenticates with Firebase Auth
3. Firebase returns ID token
4. Client sends token to `/api/auth/login`
5. Server verifies token and creates secure cookie session
6. Client fetches user role from `/api/auth/verify-role`
7. User is redirected based on role:
   - **admin** → `/admin/dashboard`
   - **viewer** → `/portal`
   - **other** → Denied access

### Session Management

- Session stored in `__session` cookie (httpOnly, secure)
- UID stored in `__uid` cookie (for client-side reference)
- Cookies expire after 7 days
- Middleware validates cookies on protected routes
- Auth context auto-logs out when session expires

### Protected Routes

#### Admin Routes (`/admin/`)
- Require `role === "admin"`
- Protected by middleware + layout validation
- Layout shows loading state during auth verification

#### Portal Routes (`/portal/`)
- Allow `role === "viewer"` or `role === "admin"`
- Protected by middleware + layout validation
- Layout shows loading state during auth verification

## Creating Test Users

### Using Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Create user with email and password
4. Copy user UID

### Using Server Action (Firestore)

```typescript
import { createUser } from '@/lib/actions/users';

// Create admin user
await createUser(
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'SecurePassword123!'
  },
  adminUid // Current admin's UID
);

// Create viewer user
await createUser(
  {
    name: 'Client User',
    email: 'client@example.com',
    role: 'viewer',
    password: 'SecurePassword123!'
  },
  adminUid
);
```

### Firestore Document Structure

User documents stored in `users` collection:

```json
{
  "id": "firebase-uid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin|viewer|editor|asesor|recepcion",
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z",
  "lastLogin": "2024-01-02T15:30:00Z"
}
```

## Environment Variables

Required variables in `.env.local`:

```
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK (Private)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_STORAGE_BUCKET=...
```

## Security

### Best Practices Implemented

1. **Secure Cookies**
   - `__session` cookie is httpOnly (not accessible via JavaScript)
   - Cookies marked as secure (HTTPS only in production)
   - SameSite=Lax to prevent CSRF attacks

2. **Role-Based Access Control**
   - Roles verified on both client and server
   - Server-side verification in layouts and API routes
   - Middleware validates session before route access

3. **Password Reset**
   - Secure password reset flow using Firebase
   - Links expire after set time
   - Email verification available

4. **Session Management**
   - Auto-logout on token expiration
   - User data synced with Firestore
   - Last login timestamp tracked

### Firestore Security Rules

Recommended rules structure:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read their own document
      allow read: if request.auth.uid == userId;
      // Only admins can update other users
      allow update: if request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Only system can create
      allow create: if false;
      // Only admins can delete
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Testing

### Manual Testing Steps

1. **Login as Admin**
   ```
   Email: admin@preciousbyorocash.com
   Password: [test password]
   Expected: Redirected to /admin/dashboard
   ```

2. **Login as Client**
   ```
   Email: client@example.com
   Password: [test password]
   Expected: Redirected to /portal
   ```

3. **Invalid Credentials**
   ```
   Email: test@example.com
   Password: wrong
   Expected: Error message shown
   ```

4. **Session Persistence**
   - Login successfully
   - Refresh page
   - Expected: Stay logged in (session preserved)

5. **Logout**
   - Click "Cerrar sesión" button
   - Expected: Redirected to login page

## Troubleshooting

### Common Issues

**Issue: "Acceso denegado" error on login**
- Verify user role in Firestore matches expected value
- Check user document exists in `users` collection

**Issue: Session not persisting after refresh**
- Check browser cookies are enabled
- Verify `__session` cookie is being set
- Check cookie domain matches application domain

**Issue: "Usuario no encontrado" error**
- Ensure user is created in both Firebase Auth and Firestore
- Verify email matches exactly (case-sensitive)

**Issue: Password reset email not sent**
- Check email configuration in Firebase Console
- Verify Firebase email templates are set up
- Check email is not marked as spam

## API Reference

### POST /api/auth/login

Creates session for authenticated user.

**Request:**
```json
{
  "token": "firebase-id-token",
  "uid": "user-id",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "uid": "user-id"
}
```

**Cookies Set:**
- `__session` - Firebase ID token (httpOnly)
- `__uid` - User ID (for client reference)

### GET /api/auth/verify-role

Verifies user role and returns user data.

**Query Parameters:**
- `uid` - User ID to verify

**Response:**
```json
{
  "success": true,
  "uid": "user-id",
  "role": "admin",
  "name": "User Name",
  "email": "user@example.com"
}
```

### POST /api/auth/logout

Clears session cookies.

**Response:**
```json
{
  "success": true
}
```

### POST /api/auth/update-last-login

Updates user's last login timestamp.

**Request:**
```json
{
  "uid": "user-id"
}
```

**Response:**
```json
{
  "success": true
}
```

## Migration from Previous Auth

If migrating from previous authentication:

1. Migrate user data to Firestore `users` collection
2. Create users in Firebase Auth with same email
3. Update environment variables for Firebase
4. Test login flow end-to-end
5. Update any custom hooks or middleware

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Social login (Google, etc.)
- [ ] API key authentication for services
- [ ] Session activity tracking
- [ ] Concurrent session limits
- [ ] Rate limiting on login attempts
- [ ] Email verification on signup

