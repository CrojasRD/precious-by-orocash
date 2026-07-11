import { db as getDb, storage as getStorage } from './admin-config';

type CollectionName = 'users' | 'appointments' | 'transactions' | 'valuation_reports' | 'client_documents' | 'site_settings';

export async function createUser(uid: string, data: any) {
  try {
    await getDb().collection('users').doc(uid).set(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserById(uid: string) {
  try {
    const doc = await getDb().collection('users').doc(uid).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUser(uid: string, data: any) {
  try {
    await getDb().collection('users').doc(uid).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(uid: string) {
  try {
    await getDb().collection('users').doc(uid).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAppointment(data: any) {
  try {
    const docRef = await getDb().collection('appointments').add({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAppointmentById(appointmentId: string) {
  try {
    const doc = await getDb().collection('appointments').doc(appointmentId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting appointment:', error);
    return null;
  }
}

export async function updateAppointment(appointmentId: string, data: any) {
  try {
    await getDb().collection('appointments').doc(appointmentId).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAppointment(appointmentId: string) {
  try {
    await getDb().collection('appointments').doc(appointmentId).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTransaction(appointmentId: string, data: any) {
  try {
    await getDb().collection('transactions').doc(appointmentId).set({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTransaction(appointmentId: string) {
  try {
    const doc = await getDb().collection('transactions').doc(appointmentId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting transaction:', error);
    return null;
  }
}

export async function createValuationReport(appointmentId: string, data: any) {
  try {
    await getDb().collection('valuation_reports').doc(appointmentId).set({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getValuationReport(appointmentId: string) {
  try {
    const doc = await getDb().collection('valuation_reports').doc(appointmentId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting valuation report:', error);
    return null;
  }
}

export async function uploadClientDocument(appointmentId: string, data: any) {
  try {
    const docRef = await getDb().collection('client_documents').add({
      ...data,
      appointmentId,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteClientDocument(docId: string) {
  try {
    await getDb().collection('client_documents').doc(docId).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSiteSettings() {
  try {
    const doc = await getDb().collection('site_settings').doc('config').get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Error getting site settings:', error);
    return null;
  }
}

export async function updateSiteSettings(data: any) {
  try {
    await getDb().collection('site_settings').doc('config').set(data, { merge: true });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadFile(filePath: string, file: Buffer) {
  try {
    const bucket = getStorage().bucket();
    await bucket.file(filePath).save(file);
    return { success: true, url: `gs://${bucket.name}/${filePath}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFile(filePath: string) {
  try {
    const bucket = getStorage().bucket();
    await bucket.file(filePath).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
