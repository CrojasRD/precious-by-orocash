import { storage } from './admin-config';
import { ref, getBytes, deleteObject } from 'firebase-admin/storage';

const BRANDING_BUCKET = 'branding';
const CLIENT_FILES_BUCKET = 'client-files';

// ============= BRANDING FILES (Público) =============

export async function uploadBrandingFile(filename: string, buffer: Buffer, contentType: string) {
  try {
    const file = storage.bucket().file(`${BRANDING_BUCKET}/${filename}`);
    await file.save(buffer, { contentType });
    return { success: true, url: `gs://${storage.bucket().name}/${BRANDING_BUCKET}/${filename}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBrandingFile(filename: string) {
  try {
    const file = storage.bucket().file(`${BRANDING_BUCKET}/${filename}`);
    await file.delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= CLIENT FILES (Privado) =============

export async function uploadClientFile(
  appointmentId: string,
  fileType: 'report' | 'document',
  filename: string,
  buffer: Buffer,
  contentType: string
) {
  try {
    const filePath = `${CLIENT_FILES_BUCKET}/${fileType}s/${appointmentId}/${filename}`;
    const file = storage.bucket().file(filePath);

    await file.save(buffer, { contentType });

    // Generar URL firmada válida por 7 días
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { success: true, path: filePath, url: signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClientFileSignedUrl(filePath: string, expiresIn = 24) {
  try {
    const file = storage.bucket().file(filePath);
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresIn * 60 * 60 * 1000, // Horas a milisegundos
    });
    return { success: true, url: signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteClientFile(filePath: string) {
  try {
    const file = storage.bucket().file(filePath);
    await file.delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFileSize(filePath: string) {
  try {
    const file = storage.bucket().file(filePath);
    const [metadata] = await file.getMetadata();
    return metadata.size ? parseInt(metadata.size) : 0;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
}
