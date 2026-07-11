import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin-config';

export async function POST(request: NextRequest) {
  try {
    const { token, uid, email } = await request.json();

    if (!token || !uid) {
      return NextResponse.json(
        { error: 'Token y UID requeridos' },
        { status: 400 }
      );
    }

    // Verificar el token con Firebase Admin SDK
    try {
      await adminAuth().verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Crear respuesta con cookie de sesión
    const response = NextResponse.json(
      { success: true, uid },
      { status: 200 }
    );

    // Establecer cookie segura con el token
    response.cookies.set({
      name: '__session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    // También guardar el UID para fácil acceso
    response.cookies.set({
      name: '__uid',
      value: uid,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
