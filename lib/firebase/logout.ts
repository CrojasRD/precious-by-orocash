"use client";

import { signOut } from 'firebase/auth';
import { auth } from './client';

export async function logoutUser() {
  try {
    // Cerrar sesión en Firebase
    await signOut(auth);

    // Cerrar sesión en el servidor (eliminar cookies)
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    // Limpiar localStorage si es necesario
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
}
