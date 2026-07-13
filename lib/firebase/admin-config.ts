import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

let adminApp: admin.app.App | undefined;

function initializeFirebase(): admin.app.App {
  // Return existing app if already initialized
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('FIREBASE_PROJECT_ID is not set in environment variables');
  }
  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('FIREBASE_CLIENT_EMAIL is not set in environment variables');
  }
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
  }

  try {
    adminApp = admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }

  return adminApp as admin.app.App;
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
