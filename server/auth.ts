import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { db } from './db.js';

/**
 * Нэвтрэлт.
 *
 * - Нууц үгийг bcrypt-ээр hash хийж хадгална, эх хэлбэрээр нь хадгалахгүй.
 * - Session-ийг сервер дээр хадгална. Хөтөч зөвхөн санамсаргүй ID-г
 *   httpOnly cookie-д хадгалах тул JavaScript-ээр уншиж чадахгүй.
 * - Cookie нь sameSite=lax тул өөр сайтаас илгээсэн хүсэлтэд хавсрахгүй.
 */

const COOKIE = 'lift_session';
const SESSION_DAYS = 7;
/** bcrypt-ийн үнэ. Өндөр байх тусам хугацаа их, дайралт хийхэд хүндрэлтэй. */
const BCRYPT_ROUNDS = 12;

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserRow extends User {
  password_hash: string;
}

export const hashPassword = (plain: string) => bcrypt.hash(plain, BCRYPT_ROUNDS);

export function createUser(email: string, name: string, passwordHash: string, role = 'admin'): User {
  const user: User = { id: crypto.randomUUID(), email: email.toLowerCase().trim(), name, role };
  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, role, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(user.id, user.email, passwordHash, name, role, new Date().toISOString());
  return user;
}

/**
 * Нэвтрэх оролдлогын хязгаарлалт.
 *
 * Нэг IP-аас олон удаа буруу оролдвол түр хаана. Санах ойд хадгалагдах тул
 * сервер дахин асахад цэвэрлэгдэнэ — олон сервертэй болвол Redis рүү шилжүүлнэ.
 */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const rec = attempts.get(key);
  if (rec && rec.until > now && rec.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((rec.until - now) / 1000) };
  }
  if (rec && rec.until <= now) attempts.delete(key);
  return { allowed: true, retryAfterSec: 0 };
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || rec.until <= now) attempts.set(key, { count: 1, until: now + WINDOW_MS });
  else rec.count += 1;
}

export function clearFailures(key: string): void {
  attempts.delete(key);
}

/** Имэйл, нууц үгээр шалгана. Аль нь буруу болохыг ялгаж хэлэхгүй. */
export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const row = db
    .prepare('SELECT id, email, name, role, password_hash FROM users WHERE email = ?')
    .get(email.toLowerCase().trim()) as UserRow | undefined;

  // Хэрэглэгч байхгүй үед ч hash шалгах хугацааг зарцуулж, имэйл бүртгэлтэй
  // эсэхийг хариу ирэх хугацаагаар таахаас сэргийлнэ.
  const hash = row?.password_hash ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
  const ok = await bcrypt.compare(password, hash);
  if (!row || !ok) return null;

  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(new Date().toISOString(), row.id);
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export function createSession(userId: string): { id: string; expiresAt: Date } {
  const id = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.prepare('INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(
    id, userId, new Date().toISOString(), expiresAt.toISOString()
  );
  return { id, expiresAt };
}

export function destroySession(id: string): void {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
}

export function userFromSession(sessionId: string | undefined): User | null {
  if (!sessionId) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`
    )
    .get(sessionId) as (User & { expires_at: string }) | undefined;
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    destroySession(sessionId);
    return null;
  }
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export function setSessionCookie(res: Response, id: string, expiresAt: Date): void {
  res.cookie(COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE, { path: '/' });
}

export const readSessionCookie = (req: Request): string | undefined => req.cookies?.[COOKIE];

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

/** Нэвтрээгүй бол 401 буцаана */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = userFromSession(readSessionCookie(req));
  if (!user) {
    res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
    return;
  }
  req.user = user;
  next();
}
