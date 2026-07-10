import { redirect } from 'next/navigation';
import { getCurrentUser } from './auth';
import { getUserById } from './server-auth';

type Role = 'admin' | 'editor' | 'asesor' | 'recepcion' | 'viewer';

export async function requireRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  const userData = await getUserById(user.uid);

  if (!userData || !allowedRoles.includes(userData.role)) {
    // Redirigir según el rol
    const roleHomePath: Record<Role, string> = {
      admin: '/admin/dashboard',
      editor: '/admin/settings',
      asesor: '/admin/my-appointments',
      recepcion: '/admin/appointments',
      viewer: '/portal',
    };

    redirect(roleHomePath[userData?.role] || '/');
  }

  return userData;
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
