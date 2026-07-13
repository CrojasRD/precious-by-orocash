import { z } from 'zod';

// Validadores de seguridad
export const secureEmailSchema = z.string().email('Email inválido').toLowerCase().trim();

export const securePasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido')
  .optional();

export const cedNumberSchema = z
  .string()
  .regex(/^\d{5,20}$/, 'Número de cédula inválido')
  .optional();

// Sanitizar entrada
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML peligrosos
    .slice(0, 1000); // Limitar longitud
}

// Validar CSRF token
export function validateCsrfToken(token: string, expected: string): boolean {
  return token === expected && token.length > 0;
}

// Generar CSRF token
export function generateCsrfToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Detectar honeypot
export function validateHoneypot(honeypotValue: string | null): boolean {
  // Si el honeypot tiene valor, es un bot
  return !honeypotValue || honeypotValue.trim() === '';
}

// Validar recaptcha v3
export async function validateRecaptcha(token: string, secretKey?: string): Promise<boolean> {
  if (!secretKey) {
    console.warn('reCAPTCHA no está configurado');
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score > 0.5; // score > 0.5 = probablemente humano
  } catch (error) {
    console.error('Error validating recaptcha:', error);
    return false;
  }
}
