"use server";

import { revalidatePath } from "next/cache";
import { adminAuth, db } from "@/lib/firebase/admin-config";
import type { UserRole } from "@/lib/types";

export async function inviteUser(
  input: { name: string; email: string; role: UserRole },
  adminUid: string
) {
  if (!input.name.trim()) {
    throw new Error("El nombre del usuario no puede estar vacío.");
  }
  if (!input.email.trim()) {
    throw new Error("El correo del usuario no puede estar vacío.");
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await adminAuth().createUser({
      email: input.email,
      displayName: input.name,
      password: Math.random().toString(36).slice(-12), // Temporary password
    });

    // Create user document in Firestore
    await db()
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        name: input.name.trim(),
        email: input.email.trim(),
        role: input.role,
        createdAt: new Date().toISOString(),
        createdBy: adminUid,
      });

    revalidatePath("/admin/users");
  } catch (error: any) {
    console.error("Error inviting user:", error);
    if (error.code === "auth/email-already-exists") {
      throw new Error("Este correo ya está registrado.");
    }
    throw new Error(error.message || "No se pudo invitar al usuario.");
  }
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  adminUid: string
) {
  if (!userId) {
    throw new Error("ID de usuario requerido.");
  }

  try {
    await db()
      .collection("users")
      .doc(userId)
      .update({
        role: newRole,
        updatedAt: new Date().toISOString(),
        updatedBy: adminUid,
      });

    revalidatePath("/admin/users");
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw new Error("No se pudo actualizar el rol del usuario.");
  }
}

export async function deleteUser(userId: string, adminUid: string) {
  if (!userId) {
    throw new Error("ID de usuario requerido.");
  }

  try {
    // Delete from Firestore
    await db().collection("users").doc(userId).delete();

    // Disable in Firebase Auth
    await adminAuth().updateUser(userId, { disabled: true });

    revalidatePath("/admin/users");
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error("No se pudo eliminar el usuario.");
  }
}

export async function sendPasswordReset(email: string) {
  if (!email.trim()) {
    throw new Error("Correo requerido.");
  }

  try {
    throw new Error("Función de reseteo de contraseña no implementada aún.");
  } catch (error: any) {
    console.error("Error sending password reset:", error);
    throw new Error(error.message || "No se pudo enviar el correo de recuperación.");
  }
}
