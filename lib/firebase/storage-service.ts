// import { storage } from './admin-config';
// import { ref, getBytes, deleteObject } from 'firebase-admin/storage';

const BRANDING_BUCKET = 'branding';
const CLIENT_FILES_BUCKET = 'client-files';

export async function uploadBrandingFile(filename: string, buffer: Buffer, contentType: string) {
  return { success: true, url: '' };
}

export async function deleteBrandingFile(filename: string) {
  return { success: true };
}

export async function uploadClientFile(
  appointmentId: string,
  fileType: 'report' | 'document',
  filename: string,
  buffer: Buffer,
  contentType: string
) {
  return { success: true, path: '', url: '' };
}

export async function getClientFileSignedUrl(filePath: string, expiresIn = 24) {
  return { success: true, url: '' };
}

export async function deleteClientFile(filePath: string) {
  return { success: true };
}

export async function getFileSize(filePath: string) {
  return 0;
}
