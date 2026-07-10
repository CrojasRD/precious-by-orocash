import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

let adminApp = admin.app();

if (!admin.apps.length) {
  adminApp = admin.initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminAuth = admin.auth(adminApp);
export const db = admin.firestore(adminApp);
export const storage = admin.storage(adminApp);
