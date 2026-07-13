import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Eliminar cookies de sesión
  response.cookies.set({
    name: '__session',
    value: '',
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  response.cookies.set({
    name: '__uid',
    value: '',
    httpOnly: false,
    maxAge: 0,
    path: '/',
  });

  return response;
}
