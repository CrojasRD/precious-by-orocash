import { db, storage } from './admin-config';

type CollectionName = 'users' | 'appointments' | 'transactions' | 'valuation_reports' | 'client_documents' | 'site_settings';

// ============= USERS =============

export async function createUser(uid: string, data: any) {
  try {
    await db.collection('users').doc(uid).set(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserById(uid: string) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists() ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUser(uid: string, data: any) {
  try {
    await db.collection('users').doc(uid).update({
      ...data,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= APPOINTMENTS =============

export async function createAppointment(data: any) {
  try {
    const docRef = await db.collection('appointments').add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAppointmentById(appointmentId: string) {
  try {
    const doc = await db.collection('appointments').doc(appointmentId).get();
    return doc.exists() ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting appointment:', error);
    return null;
  }
}

export async function getAppointmentsByEmail(email: string) {
  try {
    const snapshot = await db
      .collection('appointments')
      .where('email', '==', email)
      .orderBy('appointmentDate', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
}

export async function getAppointmentsByAdvisor(advisorId: string) {
  try {
    const snapshot = await db
      .collection('appointments')
      .where('assignedAdvisorId', '==', advisorId)
      .orderBy('appointmentDate', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting advisor appointments:', error);
    return [];
  }
}

export async function getAllAppointments(pageSize = 50) {
  try {
    const snapshot = await db
      .collection('appointments')
      .orderBy('appointmentDate', 'desc')
      .limit(pageSize)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all appointments:', error);
    return [];
  }
}

export async function updateAppointment(appointmentId: string, data: any) {
  try {
    await db.collection('appointments').doc(appointmentId).update({
      ...data,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= TRANSACTIONS =============

export async function createOrUpdateTransaction(appointmentId: string, data: any) {
  try {
    await db.collection('transactions').doc(appointmentId).set(
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTransaction(appointmentId: string) {
  try {
    const doc = await db.collection('transactions').doc(appointmentId).get();
    return doc.exists() ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting transaction:', error);
    return null;
  }
}

// ============= VALUATION REPORTS =============

export async function createOrUpdateValuationReport(appointmentId: string, data: any) {
  try {
    await db.collection('valuation_reports').doc(appointmentId).set(
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getValuationReport(appointmentId: string) {
  try {
    const doc = await db.collection('valuation_reports').doc(appointmentId).get();
    return doc.exists() ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting valuation report:', error);
    return null;
  }
}

// ============= CLIENT DOCUMENTS =============

export async function createClientDocument(data: any) {
  try {
    const docRef = await db.collection('client_documents').add({
      ...data,
      createdAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClientDocuments(appointmentId: string) {
  try {
    const snapshot = await db
      .collection('client_documents')
      .where('appointmentId', '==', appointmentId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting client documents:', error);
    return [];
  }
}

export async function deleteClientDocument(docId: string) {
  try {
    await db.collection('client_documents').doc(docId).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= SITE SETTINGS =============

export async function getSiteSettings() {
  try {
    const doc = await db.collection('site_settings').doc('config').get();
    return doc.exists() ? doc.data() : null;
  } catch (error) {
    console.error('Error getting site settings:', error);
    return null;
  }
}

export async function updateSiteSettings(uid: string, data: any) {
  try {
    await db.collection('site_settings').doc('config').set(
      {
        ...data,
        updatedAt: new Date(),
        updatedBy: uid,
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
