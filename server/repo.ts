import { db } from './db.js';

/**
 * Өгөгдлийн сангийн мөрийг frontend-ийн хэлбэрт хөрвүүлэх давхарга.
 * SQL дотор snake_case, JavaScript талд camelCase байна.
 */

const nowIso = () => new Date().toISOString();

/* ------------------------------------------------------------------- Лифт */

type ElevatorRow = Record<string, unknown>;

const toElevator = (r: ElevatorRow) => ({
  id: r.id, code: r.code, building: r.building, district: r.district, address: r.address,
  lat: r.lat, lng: r.lng, brand: r.brand, model: r.model,
  floors: r.floors, capacityKg: r.capacity_kg, installedAt: r.installed_at,
  contractType: r.contract_type, status: r.status,
  lastServiceAt: r.last_service_at, nextServiceAt: r.next_service_at,
  contactName: r.contact_name, contactPhone: r.contact_phone,
});

export const listElevators = () =>
  (db.prepare('SELECT * FROM elevators ORDER BY building, code').all() as ElevatorRow[]).map(toElevator);

export function upsertElevator(e: Record<string, any>) {
  db.prepare(
    `INSERT INTO elevators (id, code, building, district, address, lat, lng, brand, model,
       floors, capacity_kg, installed_at, contract_type, status, last_service_at,
       next_service_at, contact_name, contact_phone)
     VALUES (@id, @code, @building, @district, @address, @lat, @lng, @brand, @model,
       @floors, @capacityKg, @installedAt, @contractType, @status, @lastServiceAt,
       @nextServiceAt, @contactName, @contactPhone)
     ON CONFLICT(id) DO UPDATE SET
       code=@code, building=@building, district=@district, address=@address,
       lat=@lat, lng=@lng, brand=@brand, model=@model, floors=@floors,
       capacity_kg=@capacityKg, installed_at=@installedAt, contract_type=@contractType,
       status=@status, last_service_at=@lastServiceAt, next_service_at=@nextServiceAt,
       contact_name=@contactName, contact_phone=@contactPhone`
  ).run(e);
}

export function patchElevator(id: string, patch: Record<string, unknown>) {
  const MAP: Record<string, string> = {
    status: 'status', lastServiceAt: 'last_service_at', nextServiceAt: 'next_service_at',
    contactName: 'contact_name', contactPhone: 'contact_phone', address: 'address',
  };
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const [k, col] of Object.entries(MAP)) {
    if (patch[k] !== undefined) { sets.push(`${col} = ?`); vals.push(patch[k]); }
  }
  if (!sets.length) return false;
  vals.push(id);
  return db.prepare(`UPDATE elevators SET ${sets.join(', ')} WHERE id = ?`).run(...vals).changes > 0;
}

/* -------------------------------------------------------- Засварын бүртгэл */

const toRecord = (r: Record<string, any>) => ({
  id: r.id, elevatorId: r.elevator_id, date: r.date, engineer: r.engineer,
  kind: r.kind, issue: r.issue, resolution: r.resolution,
  partsUsed: JSON.parse(r.parts_used || '[]'), durationMin: r.duration_min, outcome: r.outcome,
});

export const listServiceRecords = () =>
  (db.prepare('SELECT * FROM service_records ORDER BY date DESC, created_at DESC').all() as any[]).map(toRecord);

export function insertServiceRecord(r: Record<string, any>) {
  db.prepare(
    `INSERT INTO service_records (id, elevator_id, date, engineer, kind, issue, resolution,
       parts_used, duration_min, outcome, created_at)
     VALUES (@id, @elevatorId, @date, @engineer, @kind, @issue, @resolution,
       @partsUsed, @durationMin, @outcome, @createdAt)`
  ).run({ ...r, partsUsed: JSON.stringify(r.partsUsed ?? []), createdAt: nowIso() });
  // Тухайн лифтийн "сүүлд үйлчилсэн" огноог шинэчилнэ
  db.prepare('UPDATE elevators SET last_service_at = ? WHERE id = ?').run(r.date, r.elevatorId);
}

/* -------------------------------------------------------------- Бүртгэлүүд */

const toSubmission = (r: Record<string, any>) => ({
  id: r.id, kind: r.kind, createdAt: r.created_at, contactName: r.contact_name,
  phone: r.phone, summary: r.summary, status: r.status,
  details: JSON.parse(r.details || '{}'),
});

export const listSubmissions = () =>
  (db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all() as any[]).map(toSubmission);

export function insertSubmission(s: Record<string, any>) {
  db.prepare(
    `INSERT INTO submissions (id, kind, created_at, contact_name, phone, summary, status, details)
     VALUES (@id, @kind, @createdAt, @contactName, @phone, @summary, @status, @details)`
  ).run({
    ...s,
    status: s.status ?? 'new',
    details: JSON.stringify(s.details ?? {}),
  });
  return toSubmission(db.prepare('SELECT * FROM submissions WHERE id = ?').get(s.id) as any);
}

export const setSubmissionStatus = (id: string, status: string) =>
  db.prepare('UPDATE submissions SET status = ? WHERE id = ?').run(status, id).changes > 0;

/* ----------------------------------------------------------- Бүтээгдэхүүн */

const toProduct = (r: Record<string, any>) => ({
  id: r.id, name: r.name, oemCode: r.oem_code, category: r.category,
  categoryLabel: r.category_label, brand: r.brand, price: r.price,
  inStock: r.stock_count > 0, stockCount: r.stock_count, deliveryDays: r.delivery_days,
  image: r.image, specs: JSON.parse(r.specs || '{}'), description: r.description,
});

export const listProducts = () =>
  (db.prepare('SELECT * FROM products ORDER BY name').all() as any[]).map(toProduct);

export function upsertProduct(p: Record<string, any>) {
  db.prepare(
    `INSERT INTO products (id, name, oem_code, category, category_label, brand, price,
       stock_count, delivery_days, image, specs, description, updated_at)
     VALUES (@id, @name, @oemCode, @category, @categoryLabel, @brand, @price,
       @stockCount, @deliveryDays, @image, @specs, @description, @updatedAt)
     ON CONFLICT(id) DO UPDATE SET
       name=@name, oem_code=@oemCode, category=@category, category_label=@categoryLabel,
       brand=@brand, price=@price, stock_count=@stockCount, delivery_days=@deliveryDays,
       image=@image, specs=@specs, description=@description, updated_at=@updatedAt`
  ).run({
    ...p,
    oemCode: p.oemCode ?? '', brand: p.brand ?? '', deliveryDays: p.deliveryDays ?? '',
    image: p.image ?? '', description: p.description ?? '',
    specs: JSON.stringify(p.specs ?? {}),
    updatedAt: nowIso(),
  });
  return toProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(p.id) as any);
}

export const deleteProduct = (id: string) =>
  db.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0;
