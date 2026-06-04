/**
 * @proxi/auth
 *
 * Utilidades de autenticación compartidas para la plataforma Proxi.
 * Incluye hashing de contraseñas (bcrypt) y emisión/verificación de JWT.
 *
 * NOTA: Esta es la lógica base preparada. La integración con NestJS
 * (guards, estrategias Passport) se realiza en el módulo `auth` de la API.
 */
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { JwtPayload } from '@proxi/contracts';

/** Número de rondas de sal para bcrypt. */
const SALT_ROUNDS = 10;

/**
 * Genera el hash de una contraseña en texto plano.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Verifica que una contraseña en texto plano coincida con su hash.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/** Opciones para firmar un token JWT. */
export interface SignTokenOptions {
  secret: string;
  /** Tiempo de expiración (ej. '15m', '7d'). Por defecto '1d'. */
  expiresIn?: string;
}

/**
 * Firma un token JWT con el payload de usuario indicado.
 */
export function signToken(payload: JwtPayload, options: SignTokenOptions): string {
  const signOptions: SignOptions = {
    expiresIn: (options.expiresIn ?? '1d') as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, options.secret, signOptions);
}

/**
 * Verifica y decodifica un token JWT. Lanza un error si es inválido o expiró.
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

/**
 * Extrae el token Bearer de un header Authorization.
 * Devuelve `null` si el header no tiene el formato esperado.
 */
export function extractBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export type { JwtPayload };
