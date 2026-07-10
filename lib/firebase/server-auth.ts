import { adminAuth, db } from './admin-config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase-admin/firestore';

export async function getUserByEmail(email: string) {
  try {
    const usersSnapshot = await db.collection('users').where('email', '==', email).get();
    if (usersSnapshot.empty) {
      return null;
    }
    const userDoc = usersSnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'editor' | 'asesor' | 'recepcion' | 'viewer' = 'viewer'
) {
  try {
    // Crear usuario en Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Crear documento en Firestore
    await setDoc(doc(db, 'users', userRecord.uid), {
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(uid: string, role: string) {
  try {
    await updateDoc(doc(db, 'users', uid), { role });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(uid: string) {
  try {
    await adminAuth.deleteUser(uid);
    await db.collection('users').doc(uid).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendPasswordReset(email: string) {
  try {
    const link = await adminAuth.generatePasswordResetLink(email);
    return { success: true, link };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
