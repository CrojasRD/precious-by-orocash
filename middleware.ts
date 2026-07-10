import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas protegidas de admin
  if (pathname.startsWith('/admin')) {
    // Verificar si el usuario tiene sesión
    const token = request.cookies.get('__session')?.value;

    if (!token && !pathname.startsWith('/admin/login')) {
      // Si no hay sesión y no está en /admin/login, redirigir
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Rutas protegidas del portal
  if (pathname.startsWith('/portal')) {
    const token = request.cookies.get('__session')?.value;

    if (!token && !pathname.startsWith('/portal/login')) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
