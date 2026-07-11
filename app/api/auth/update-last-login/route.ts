import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin-config';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'UID requerido' },
        { status: 400 }
      );
    }

    // Actualizar último login
    await db().collection('users').doc(uid).update({
      lastLogin: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update last login error:', error);
    // No fallar si hay error, es informativo
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  }
}
