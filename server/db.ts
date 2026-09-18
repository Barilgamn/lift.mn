import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

/**
 * SQLite өгөгдлийн сан.
 *
 * Нэг файлд хадгалагдана — нөөцлөхөд тэр файлыг хуулахад хангалттай.
 * Байршлыг DATABASE_PATH орчны хувьсагчаар өөрчилж болно.
 */

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'lift.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

// Хүчдэл тасрахад өгөгдөл эвдрэхээс сэргийлнэ, зэрэг унших хурдыг нэмнэ
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function migrate(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name          TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'admin',
      created_at    TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

    CREATE TABLE IF NOT EXISTS elevators (
      id             TEXT PRIMARY KEY,
      code           TEXT NOT NULL,
      building       TEXT NOT NULL,
      district       TEXT NOT NULL,
      address        TEXT NOT NULL,
      lat            REAL NOT NULL,
      lng            REAL NOT NULL,
      brand          TEXT NOT NULL,
      model          TEXT NOT NULL,
      floors         INTEGER NOT NULL,
      capacity_kg    INTEGER NOT NULL,
      installed_at   TEXT NOT NULL,
      contract_type  TEXT NOT NULL,
      status         TEXT NOT NULL,
      last_service_at TEXT NOT NULL,
      next_service_at TEXT NOT NULL,
      contact_name   TEXT NOT NULL,
      contact_phone  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_records (
      id           TEXT PRIMARY KEY,
      elevator_id  TEXT NOT NULL REFERENCES elevators(id) ON DELETE CASCADE,
      date         TEXT NOT NULL,
      engineer     TEXT NOT NULL,
      kind         TEXT NOT NULL,
      issue        TEXT NOT NULL,
      resolution   TEXT NOT NULL,
      parts_used   TEXT NOT NULL DEFAULT '[]',
      duration_min INTEGER NOT NULL,
      outcome      TEXT NOT NULL,
      created_at   TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_records_elevator ON service_records(elevator_id);

    CREATE TABLE IF NOT EXISTS submissions (
      id           TEXT PRIMARY KEY,
      kind         TEXT NOT NULL,
      created_at   TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      phone        TEXT NOT NULL,
      summary      TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'new',
      details      TEXT NOT NULL DEFAULT '{}'
    );
    CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

    CREATE TABLE IF NOT EXISTS products (
      id             TEXT PRIMARY KEY,
      name           TEXT NOT NULL,
      oem_code       TEXT NOT NULL DEFAULT '',
      category       TEXT NOT NULL,
      category_label TEXT NOT NULL,
      brand          TEXT NOT NULL DEFAULT '',
      price          INTEGER NOT NULL DEFAULT 0,
      stock_count    INTEGER NOT NULL DEFAULT 0,
      delivery_days  TEXT NOT NULL DEFAULT '',
      image          TEXT NOT NULL DEFAULT '',
      specs          TEXT NOT NULL DEFAULT '{}',
      description    TEXT NOT NULL DEFAULT '',
      updated_at     TEXT NOT NULL
    );
  `);
}

/** Хугацаа нь дууссан session-үүдийг цэвэрлэнэ */
export function purgeExpiredSessions(): number {
  const r = db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(new Date().toISOString());
  return r.changes;
}

export function countUsers(): number {
  const row = db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
  return row.n;
}
