import { auth, firestoreDb } from './client';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function loginUser(email: string, password: string) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'editor' | 'asesor' | 'recepcion' | 'viewer' = 'viewer'
) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Crear documento en Firestore
    await setDoc(doc(firestoreDb, 'users', result.user.uid), {
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserRole(uid: string) {
  try {
    const userDoc = await getDoc(doc(firestoreDb, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<{ uid: string; role?: string } | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user as any);
    });
  });
}
