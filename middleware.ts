import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de sesión
  const token = request.cookies.get('__session')?.value;
  const uid = request.cookies.get('__uid')?.value;

  // Rutas públicas (login)
  const isAdminLogin = pathname === '/admin/login';
  const isPortalLogin = pathname === '/portal/login';

  // Rutas protegidas de admin
  if (pathname.startsWith('/admin') && !isAdminLogin) {
    // Si no hay sesión en rutas protegidas, redirigir al login
    if (!token || !uid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Rutas protegidas del portal
  if (pathname.startsWith('/portal') && !isPortalLogin) {
    // Si no hay sesión en rutas protegidas, redirigir al login
    if (!token || !uid) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
