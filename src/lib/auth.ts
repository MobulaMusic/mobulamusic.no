import crypto from 'node:crypto';

const SECRET = process.env.ADMIN_SECRET || 'dev-secret-change-me';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';
export const SESSION_COOKIE = 'mobula_admin';
const MAX_AGE = 60 * 60 * 8; // 8h

function sign(value: string): string {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createSession(user: string): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${user}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [user, exp, sig] = parts;
  if (sign(`${user}.${exp}`) !== sig) return null;
  if (Number(exp) < Date.now()) return null;
  return user;
}

export function checkCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export const sessionMaxAge = MAX_AGE;
