import 'dotenv/config';
import path from 'node:path';
import crypto from 'node:crypto';
import express from 'express';
import cookieParser from 'cookie-parser';
import { countUsers, migrate, purgeExpiredSessions } from './db.js';
import {
  checkRateLimit, clearFailures, clearSessionCookie, createSession, destroySession,
  readSessionCookie, recordFailure, requireAuth, setSessionCookie, userFromSession,
  verifyCredentials,
} from './auth.js';
import {
  deleteProduct, insertServiceRecord, insertSubmission, listElevators, listProducts,
  listServiceRecords, listSubmissions, patchElevator, setSubmissionStatus, upsertProduct,
} from './repo.js';

migrate();
purgeExpiredSessions();
setInterval(purgeExpiredSessions, 60 * 60 * 1000).unref();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

/** Хөтөч таамаглалаар агуулгын төрөл солихоос сэргийлнэ */
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

const ok = <T>(res: express.Response, data: T) => res.json({ data });
const fail = (res: express.Response, code: number, message: string) =>
  res.status(code).json({ error: message });

/* ------------------------------------------------------------- Нэвтрэлт */

app.get('/api/auth/me', (req, res) => {
  const user = userFromSession(readSessionCookie(req));
  // Админ бүртгэл огт байхгүй бол UI тэр тухай мэдээлнэ
  ok(res, { user, needsSetup: countUsers() === 0 });
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim();
  const password = String(req.body?.password ?? '');
  if (!email || !password) return fail(res, 400, 'Имэйл болон нууц үгээ оруулна уу');

  const key = `${req.ip}:${email.toLowerCase()}`;
  const limit = checkRateLimit(key);
  if (!limit.allowed) {
    return fail(res, 429, `Хэт олон оролдлого. ${Math.ceil(limit.retryAfterSec / 60)} минутын дараа дахин оролдоно уу.`);
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    recordFailure(key);
    // Имэйл бүртгэлтэй эсэхийг ялгаж хэлэхгүй
    return fail(res, 401, 'Имэйл эсвэл нууц үг буруу байна');
  }

  clearFailures(key);
  const { id, expiresAt } = createSession(user.id);
  setSessionCookie(res, id, expiresAt);
  ok(res, { user });
});

app.post('/api/auth/logout', (req, res) => {
  const sid = readSessionCookie(req);
  if (sid) destroySession(sid);
  clearSessionCookie(res);
  ok(res, { ok: true });
});

/* ------------------------------------------- Нийтийн — маягт хүлээн авах */

/** Сайтын маягтууд энд илгээнэ. Нэвтрэх шаардлагагүй. */
app.post('/api/public/submissions', (req, res) => {
  const b = req.body ?? {};
  const KINDS = ['service-ticket', 'emergency', 'booking', 'quote', 'sourcing', 'order'];
  if (!KINDS.includes(b.kind)) return fail(res, 400, 'Хүсэлтийн төрөл буруу байна');
  if (!String(b.phone ?? '').trim()) return fail(res, 400, 'Утасны дугаар шаардлагатай');

  const created = insertSubmission({
    id: b.id || `DL-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`,
    kind: b.kind,
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    contactName: String(b.contactName ?? '').slice(0, 120),
    phone: String(b.phone).slice(0, 40),
    summary: String(b.summary ?? '').slice(0, 300),
    status: 'new',
    details: typeof b.details === 'object' && b.details ? b.details : {},
  });
  res.status(201).json({ data: created });
});

/* --------------------------------------------- Админ — нэвтрэлт шаардана */

const admin = express.Router();
admin.use(requireAuth);

admin.get('/bootstrap', (_req, res) =>
  ok(res, {
    elevators: listElevators(),
    serviceRecords: listServiceRecords(),
    submissions: listSubmissions(),
    products: listProducts(),
  })
);

admin.patch('/submissions/:id', (req, res) => {
  const STATUSES = ['new', 'in-progress', 'done'];
  const status = String(req.body?.status ?? '');
  if (!STATUSES.includes(status)) return fail(res, 400, 'Төлөв буруу байна');
  if (!setSubmissionStatus(req.params.id, status)) return fail(res, 404, 'Бүртгэл олдсонгүй');
  ok(res, { id: req.params.id, status });
});

admin.patch('/elevators/:id', (req, res) => {
  if (!patchElevator(req.params.id, req.body ?? {})) return fail(res, 400, 'Өөрчлөх талбар алга');
  ok(res, { id: req.params.id });
});

admin.post('/service-records', (req, res) => {
  const b = req.body ?? {};
  if (!b.elevatorId || !String(b.engineer ?? '').trim() || !String(b.issue ?? '').trim()) {
    return fail(res, 400, 'Тоноглол, инженер, илэрсэн асуудал шаардлагатай');
  }
  insertServiceRecord({
    id: b.id || crypto.randomUUID(),
    elevatorId: b.elevatorId,
    date: b.date || new Date().toISOString().slice(0, 10),
    engineer: String(b.engineer).slice(0, 120),
    kind: b.kind || 'routine',
    issue: String(b.issue).slice(0, 2000),
    resolution: String(b.resolution ?? '').slice(0, 2000),
    partsUsed: Array.isArray(b.partsUsed) ? b.partsUsed.slice(0, 40) : [],
    durationMin: Number(b.durationMin) || 0,
    outcome: b.outcome || 'resolved',
  });
  res.status(201).json({ data: { serviceRecords: listServiceRecords(), elevators: listElevators() } });
});

admin.put('/products/:id', (req, res) => {
  const b = req.body ?? {};
  if (!String(b.name ?? '').trim()) return fail(res, 400, 'Нэр шаардлагатай');
  ok(res, upsertProduct({ ...b, id: req.params.id }));
});

admin.delete('/products/:id', (req, res) => {
  if (!deleteProduct(req.params.id)) return fail(res, 404, 'Бүтээгдэхүүн олдсонгүй');
  ok(res, { id: req.params.id });
});

app.use('/api/admin', admin);

/* ------------------------------------------------ Production — сайт өгөх */

if (isProd) {
  const dist = path.join(process.cwd(), 'dist');
  app.use(express.static(dist));
  // SPA — танихгүй зам бүрт index.html
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use('/api', (_req, res) => fail(res, 404, 'Ийм API зам байхгүй'));

app.listen(PORT, () => {
  const users = countUsers();
  console.log(`API ажиллаж байна: http://localhost:${PORT}`);
  if (users === 0) {
    console.log('\n  Админ бүртгэл үүсээгүй байна. Үүсгэхийн тулд:');
    console.log('    npm run create-admin -- --email=та@lift.mn --name="Нэр" --password=НУУЦҮГ\n');
  }
});
