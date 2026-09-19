import { Elevator, ServiceRecord, SparePart, Submission } from '../types';

/**
 * Өгөгдлийн сангийн мөр (snake_case) ба JavaScript-ийн объект (camelCase)
 * хооронд хөрвүүлэх. Нэг газарт төвлөрүүлснээр талбарын нэр зөрөхөөс
 * сэргийлнэ.
 */

type Row = Record<string, any>;

export const rowToElevator = (r: Row): Elevator => ({
  id: r.id, code: r.code, building: r.building, district: r.district, address: r.address,
  lat: r.lat, lng: r.lng, brand: r.brand, model: r.model,
  floors: r.floors, capacityKg: r.capacity_kg, installedAt: r.installed_at,
  contractType: r.contract_type, status: r.status,
  lastServiceAt: r.last_service_at, nextServiceAt: r.next_service_at,
  contactName: r.contact_name, contactPhone: r.contact_phone,
});

export const elevatorToRow = (e: Partial<Elevator>): Row => {
  const r: Row = {};
  if (e.id !== undefined) r.id = e.id;
  if (e.code !== undefined) r.code = e.code;
  if (e.building !== undefined) r.building = e.building;
  if (e.district !== undefined) r.district = e.district;
  if (e.address !== undefined) r.address = e.address;
  if (e.lat !== undefined) r.lat = e.lat;
  if (e.lng !== undefined) r.lng = e.lng;
  if (e.brand !== undefined) r.brand = e.brand;
  if (e.model !== undefined) r.model = e.model;
  if (e.floors !== undefined) r.floors = e.floors;
  if (e.capacityKg !== undefined) r.capacity_kg = e.capacityKg;
  if (e.installedAt !== undefined) r.installed_at = e.installedAt;
  if (e.contractType !== undefined) r.contract_type = e.contractType;
  if (e.status !== undefined) r.status = e.status;
  if (e.lastServiceAt !== undefined) r.last_service_at = e.lastServiceAt;
  if (e.nextServiceAt !== undefined) r.next_service_at = e.nextServiceAt;
  if (e.contactName !== undefined) r.contact_name = e.contactName;
  if (e.contactPhone !== undefined) r.contact_phone = e.contactPhone;
  return r;
};

export const rowToRecord = (r: Row): ServiceRecord => ({
  id: r.id, elevatorId: r.elevator_id, date: r.date, engineer: r.engineer,
  kind: r.kind, issue: r.issue, resolution: r.resolution,
  partsUsed: r.parts_used ?? [], durationMin: r.duration_min, outcome: r.outcome,
});

export const recordToRow = (r: Omit<ServiceRecord, 'id'>): Row => ({
  elevator_id: r.elevatorId, date: r.date, engineer: r.engineer, kind: r.kind,
  issue: r.issue, resolution: r.resolution, parts_used: r.partsUsed,
  duration_min: r.durationMin, outcome: r.outcome,
});

export const rowToSubmission = (r: Row): Submission => ({
  id: r.id, kind: r.kind,
  // Жагсаалтад "2026-09-17 14:32" хэлбэрээр харуулна
  createdAt: String(r.created_at ?? '').slice(0, 16).replace('T', ' '),
  contactName: r.contact_name, phone: r.phone, summary: r.summary,
  status: r.status, details: r.details ?? {},
});

export const rowToProduct = (r: Row): SparePart => {
  const variants = Array.isArray(r.variants) ? (r.variants as SparePart['variants']) : [];
  // Хувилбартай бараа нь аль нэг хувилбартаа нөөцтэй бол бэлэн гэж тооцогдоно
  const stock = variants?.length
    ? variants.reduce((sum, v) => sum + (Number(v.stockCount) || 0), 0)
    : (Number(r.stock_count) || 0);
  // Багана дутуу эсвэл null ирвэл дэлгэц унахгүй байх ёстой —
  // үнэ, нөөцийг тоо болгож баталгаажуулна
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === 'string' ? v : '');

  return {
    id: r.id, name: str(r.name), oemCode: str(r.oem_code), category: r.category,
    categoryLabel: str(r.category_label), brand: str(r.brand), price: num(r.price),
    inStock: stock > 0, stockCount: num(r.stock_count),
    deliveryDays: str(r.delivery_days), image: str(r.image),
    specs: r.specs ?? {}, description: str(r.description),
    variants: (variants ?? []).map((v) => ({
      ...v, price: num(v.price), stockCount: num(v.stockCount),
      code: str(v.code), name: str(v.name), brand: str(v.brand), image: str(v.image),
    })),
  };
};

export const productToRow = (p: SparePart): Row => ({
  id: p.id, name: p.name, oem_code: p.oemCode, category: p.category,
  category_label: p.categoryLabel, brand: p.brand, price: p.price,
  stock_count: p.stockCount, delivery_days: p.deliveryDays, image: p.image,
  specs: p.specs, description: p.description, variants: p.variants ?? [],
  updated_at: new Date().toISOString(),
});
