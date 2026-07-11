"use server";

import { revalidatePath } from "next/cache";
import { adminAuth, db } from "@/lib/firebase/admin-config";
import type { UserRole } from "@/lib/types";

// Verifica que el usuario que hace la acción es un admin
async function assertAdmin(uid: string) {
  try {
    const userDoc = await db().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new Error("Usuario no encontrado");
    }

    const userData = userDoc.data();
    if (userData?.role !== "admin") {
      throw new Error("Solo un administrador puede realizar esta acción");
    }
  } catch (error) {
    throw new Error("No autorizado");
  }
}

// Crea el usuario en Firebase Auth y Firestore
export async function createUser(
  input: { name: string; email: string; role: UserRole; password?: string },
  adminUid: string
) {
  try {
    await assertAdmin(adminUid);

    if (!input.name.trim()) throw new Error("Ingresa el nombre del usuario.");
    if (!input.email.trim()) throw new Error("Ingresa el correo del usuario.");
    if (!input.role) throw new Error("Selecciona un rol para el usuario.");

    // Crear usuario en Firebase Auth
    const userRecord = await adminAuth().createUser({
      email: input.email.trim(),
      password: input.password || "TempPassword123!",
      displayName: input.name.trim(),
    });

    // Crear documento en Firestore
    await db().collection("users").doc(userRecord.uid).set({
      email: input.email.trim(),
      name: input.name.trim(),
      role: input.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
    });

    // Generar link de restablecimiento de contraseña para primer login
    const link = await adminAuth().generatePasswordResetLink(input.email.trim());

    revalidatePath("/admin/users");
    return { success: true, uid: userRecord.uid, resetLink: link };
  } catch (error: any) {
    throw new Error(error.message || "Error al crear el usuario");
  }
}

// Obtiene un usuario por email
export async function getUserByEmail(email: string): Promise<any> {
  try {
    const snapshot = await db().collection("users").where("email", "==", email.trim()).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Obtiene un usuario por UID
export async function getUserById(uid: string) {
  try {
    const doc = await db().collection("users").doc(uid).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("Error getting user by id:", error);
    return null;
  }
}

// Login del usuario - valida credenciales y obtiene rol
export async function loginUser(email: string, password: string) {
  try {
    if (!email.trim()) throw new Error("Ingresa tu correo electrónico");
    if (!password) throw new Error("Ingresa tu contraseña");

    // Verificar que el usuario existe en Firestore
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("Usuario no registrado");
    }

    // La verificación real de contraseña se hace en el cliente con Firebase Auth
    // Esta función es para validaciones adicionales del servidor
    return {
      success: true,
      uid: user.id,
      role: user.role,
      name: user.name,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al iniciar sesión",
    };
  }
}

// Invita un usuario (crea cuenta y envía link de restablecimiento)
export async function inviteUser(
  input: { name: string; email: string; role: UserRole },
  adminUid: string
) {
  try {
    await assertAdmin(adminUid);

    if (!input.name.trim()) throw new Error("Ingresa el nombre del usuario.");
    if (!input.email.trim()) throw new Error("Ingresa el correo del usuario.");

    // Verificar que el usuario no existe
    const existingUser = await getUserByEmail(input.email);
    if (existingUser) {
      throw new Error("El usuario ya está registrado");
    }

    // Crear usuario con contraseña temporal
    return await createUser(
      {
        ...input,
        password: Math.random().toString(36).slice(-12) + "Temp1!",
      },
      adminUid
    );
  } catch (error: any) {
    throw new Error(error.message || "Error al invitar usuario");
  }
}

export async function updateUserRole(userId: string, role: UserRole, adminUid: string) {
  try {
    await assertAdmin(adminUid);

    const userRef = db().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("Usuario no encontrado");
    }

    await userRef.update({
      role,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Elimina un usuario de Firebase Auth y Firestore
export async function deleteUser(userId: string, adminUid: string) {
  try {
    await assertAdmin(adminUid);

    // Eliminar de Firebase Auth
    await adminAuth().deleteUser(userId);

    // Eliminar de Firestore
    await db().collection("users").doc(userId).delete();

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Envía correo de restablecimiento de contraseña
export async function sendPasswordReset(email: string) {
  try {
    if (!email.trim()) {
      throw new Error("Ingresa un correo electrónico válido");
    }

    // Verificar que el usuario existe
    const user = await getUserByEmail(email);
    if (!user) {
      // No revelar si el usuario existe o no (seguridad)
      return { success: true, error: null };
    }

    // Generar link de restablecimiento
    const link = await adminAuth().generatePasswordResetLink(email.trim());

    // TODO: Enviar correo con el link usando Resend, SendGrid, etc.
    console.log(`Password reset link for ${email}:`, link);

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error sending password reset:", error);
    return { success: false, error: error.message };
  }
}

// Actualiza el último login del usuario
export async function updateLastLogin(uid: string) {
  try {
    await db().collection("users").doc(uid).update({
      lastLogin: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating last login:", error);
  }
}
