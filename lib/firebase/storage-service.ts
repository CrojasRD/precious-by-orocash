// import { storage } from './admin-config';
// import { ref, getBytes, deleteObject } from 'firebase-admin/storage';

const BRANDING_BUCKET = 'branding';
const CLIENT_FILES_BUCKET = 'client-files';

// ============= BRANDING FILES (Público) =============

export async function uploadBrandingFile(filename: string, buffer: Buffer, contentType: string) {
  // TODO: Implement Firebase Storage upload
  return { success: true, url: '' };
}

export async function deleteBrandingFile(filename: string) {
  // TODO: Implement Firebase Storage delete
  return { success: true };
}

// ============= CLIENT FILES (Privado) =============

export async function uploadClientFile(
  appointmentId: string,
  fileType: 'report' | 'document',
  filename: string,
  buffer: Buffer,
  contentType: string
) {
  // TODO: Implement Firebase Storage upload with signed URL
  return { success: true, path: '', url: '' };
}

export async function getClientFileSignedUrl(filePath: string, expiresIn = 24) {
  // TODO: Implement Firebase Storage signed URL generation
  return { success: true, url: '' };
}

export async function deleteClientFile(filePath: string) {
  // TODO: Implement Firebase Storage delete
  return { success: true };
}

export async function getFileSize(filePath: string) {
  // TODO: Implement Firebase Storage get file size
  return 0;
}
