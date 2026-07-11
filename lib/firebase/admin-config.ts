import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

let adminApp: admin.app.App | undefined;

function initializeFirebase(): admin.app.App {
  if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
    adminApp = admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
  return admin.app();
}

export const adminAuth = (): Auth => {
  const app = initializeFirebase();
  return admin.auth(app);
};

export const db = (): Firestore => {
  const app = initializeFirebase();
  return admin.firestore(app);
};

export const storage = (): Storage => {
  const app = initializeFirebase();
  return admin.storage(app);
};
