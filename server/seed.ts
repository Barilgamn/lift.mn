import 'dotenv/config';
import { db, migrate } from './db.js';
import { insertSubmission, upsertElevator, upsertProduct } from './repo.js';
import { SEED_ELEVATORS, SEED_SERVICE_RECORDS, SEED_SUBMISSIONS } from '../src/data/adminData.js';
import { SPARE_PARTS } from '../src/data/mockData.js';

/**
 * Эхлэлийн өгөгдөл ачаалах.
 *
 * Хүснэгт хоосон байвал л ачаална — дахин ажиллуулахад байгаа өгөгдлийг
 * дарж бичихгүй. `npm run seed -- --force` гэвэл бүгдийг цэвэрлээд шинээр
 * ачаална (хөгжүүлэлтэд зориулсан).
 */

migrate();

const force = process.argv.includes('--force');
const count = (t: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n;

if (force) {
  db.exec('DELETE FROM service_records; DELETE FROM elevators; DELETE FROM submissions; DELETE FROM products;');
  console.log('Хуучин өгөгдлийг цэвэрлэлээ (--force)');
}

if (count('elevators') === 0) {
  for (const e of SEED_ELEVATORS) upsertElevator(e as any);
  const ins = db.prepare(
    `INSERT INTO service_records (id, elevator_id, date, engineer, kind, issue, resolution,
       parts_used, duration_min, outcome, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const r of SEED_SERVICE_RECORDS) {
    ins.run(r.id, r.elevatorId, r.date, r.engineer, r.kind, r.issue, r.resolution,
      JSON.stringify(r.partsUsed), r.durationMin, r.outcome, new Date().toISOString());
  }
  console.log(`Лифт ${SEED_ELEVATORS.length}, засварын бүртгэл ${SEED_SERVICE_RECORDS.length} ачааллаа`);
} else {
  console.log(`Лифт аль хэдийн ${count('elevators')} байна — алгаслаа`);
}

if (count('submissions') === 0) {
  for (const s of SEED_SUBMISSIONS) insertSubmission(s as any);
  console.log(`Бүртгэл ${SEED_SUBMISSIONS.length} ачааллаа`);
} else {
  console.log(`Бүртгэл аль хэдийн ${count('submissions')} байна — алгаслаа`);
}

if (count('products') === 0) {
  for (const p of SPARE_PARTS) upsertProduct(p as any);
  console.log(`Бүтээгдэхүүн ${SPARE_PARTS.length} ачааллаа`);
} else {
  console.log(`Бүтээгдэхүүн аль хэдийн ${count('products')} байна — алгаслаа`);
}

console.log('Дууслаа.');
