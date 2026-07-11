import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

let adminApp: any;

function initializeFirebase() {
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

export const adminAuth = () => {
  const app = initializeFirebase();
  return admin.auth(app);
};

export const db = () => {
  const app = initializeFirebase();
  return admin.firestore(app);
};

export const storage = () => {
  const app = initializeFirebase();
  return admin.storage(app);
};
