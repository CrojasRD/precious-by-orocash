import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'UID requerido' },
        { status: 400 }
      );
    }

    // Obtener documento del usuario de Firestore
    const userDoc = await db().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json(
      {
        success: true,
        uid,
        role: userData?.role,
        name: userData?.name,
        email: userData?.email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify role error:', error);
    return NextResponse.json(
      { error: 'Error al verificar el rol' },
      { status: 500 }
    );
  }
}
