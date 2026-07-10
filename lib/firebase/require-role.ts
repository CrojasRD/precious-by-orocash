import { redirect } from 'next/navigation';
import { getCurrentUser } from './auth';
import { getUserById } from './server-auth';

type Role = 'admin' | 'editor' | 'asesor' | 'recepcion' | 'viewer';

export async function requireRole(allowedRoles: Role[]) {
  // TODO: Implement Firebase session verification
  // getCurrentUser() is a client-side function and should not be used in server context
  // This should be replaced with proper server-side session verification (e.g., NextAuth, Firebase Admin SDK)

  const user = await getCurrentUser();

  if (!user || !user.uid) {
    redirect('/admin/login');
  }

  // TODO: Uncomment once proper server-side session is implemented
  // const userData = await getUserById(user.uid);
  // if (!userData || !allowedRoles.includes(userData.role)) {
  //   // Redirigir según el rol
  //   const roleHomePath: Record<Role, string> = {
  //     admin: '/admin/dashboard',
  //     editor: '/admin/settings',
  //     asesor: '/admin/my-appointments',
  //     recepcion: '/admin/appointments',
  //     viewer: '/portal',
  //   };
  //   redirect(roleHomePath[userData?.role] || '/');
  // }

  // Temporary fallback - should return actual user data from server
  return { id: user.uid, role: 'viewer' } as any;
}

export function roleHomePath(role: Role): string {
  const paths: Record<Role, string> = {
    admin: '/admin/dashboard',
    editor: '/admin/settings',
    asesor: '/admin/my-appointments',
    recepcion: '/admin/appointments',
    viewer: '/portal',
  };
  return paths[role];
}
