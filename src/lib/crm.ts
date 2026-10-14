/**
 * CRM — харилцагч байгууллага (СӨХ, хамтрагч г.м), холбогдох хүн, хэлцэл,
 * үйл ажиллагаа. Өгөгдөл supabase/crm.sql-ийн хүснэгтүүдэд хадгалагдана.
 */

export type CompanyKind = 'soh' | 'partner' | 'company' | 'government' | 'individual';
export type CompanyStage = 'lead' | 'prospect' | 'customer' | 'inactive';
export type DealStage = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealKind = 'service-contract' | 'repair' | 'parts' | 'installation' | 'modernization' | 'other';
export type ActivityKind = 'note' | 'call' | 'meeting' | 'email' | 'task' | 'system';

export interface Company {
  id: string;
  name: string;
  kind: CompanyKind;
  stage: CompanyStage;
  regNo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  district: string;
  notes: string;
  tags: string[];
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  companyId: string | null;
  name: string;
  position: string;
  phone: string;
  email: string;
  notes: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Deal {
  id: string;
  companyId: string;
  contactId: string | null;
  title: string;
  kind: DealKind;
  amount: number;
  stage: DealStage;
  expectedClose: string | null;
  ownerId: string | null;
  notes: string;
  submissionId: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface Activity {
  id: string;
  companyId: string | null;
  dealId: string | null;
  contactId: string | null;
  kind: ActivityKind;
  body: string;
  dueAt: string | null;
  done: boolean;
  assigneeId: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
}

type Tone = 'green' | 'blue' | 'amber' | 'red' | 'slate';

export const COMPANY_KIND: Record<CompanyKind, { label: string; short: string; tone: Tone }> = {
  soh: { label: 'СӨХ', short: 'СӨХ', tone: 'blue' },
  partner: { label: 'Хамтрагч байгууллага', short: 'Хамтрагч', tone: 'green' },
  company: { label: 'Байгууллага, барилга', short: 'Байгууллага', tone: 'slate' },
  government: { label: 'Төрийн байгууллага', short: 'Төрийн', tone: 'amber' },
  individual: { label: 'Хувь хүн', short: 'Хувь хүн', tone: 'slate' },
};

export const COMPANY_STAGE: Record<CompanyStage, { label: string; tone: Tone }> = {
  lead: { label: 'Боломжит', tone: 'amber' },
  prospect: { label: 'Хэлэлцэж буй', tone: 'blue' },
  customer: { label: 'Гэрээт харилцагч', tone: 'green' },
  inactive: { label: 'Идэвхгүй', tone: 'slate' },
};

export const DEAL_STAGES: { id: DealStage; label: string; tone: Tone }[] = [
  { id: 'new', label: 'Шинэ', tone: 'slate' },
  { id: 'qualified', label: 'Хэрэгцээ тодорхойлсон', tone: 'blue' },
  { id: 'proposal', label: 'Санал илгээсэн', tone: 'blue' },
  { id: 'negotiation', label: 'Тохиролцоо', tone: 'amber' },
  { id: 'won', label: 'Амжилттай', tone: 'green' },
  { id: 'lost', label: 'Алдсан', tone: 'red' },
];

export const dealStage = (id: DealStage) => DEAL_STAGES.find((s) => s.id === id) ?? DEAL_STAGES[0];
export const isOpenDeal = (d: Deal) => d.stage !== 'won' && d.stage !== 'lost';

export const DEAL_KIND: Record<DealKind, string> = {
  'service-contract': 'Засвар үйлчилгээний гэрээ',
  repair: 'Засвар',
  parts: 'Сэлбэг, бүтээгдэхүүн',
  installation: 'Суурилуулалт',
  modernization: 'Шинэчлэл',
  other: 'Бусад',
};

export const ACTIVITY_KIND: Record<ActivityKind, { label: string; verb: string }> = {
  note: { label: 'Тэмдэглэл', verb: 'тэмдэглэл нэмсэн' },
  call: { label: 'Дуудлага', verb: 'утсаар ярьсан' },
  meeting: { label: 'Уулзалт', verb: 'уулзсан' },
  email: { label: 'Имэйл', verb: 'имэйл илгээсэн' },
  task: { label: 'Ажил', verb: 'ажил үүсгэсэн' },
  system: { label: 'Систем', verb: '' },
};

/** Улаанбаатарын дүүргүүд — хаяг бөглөхөд */
export const DISTRICTS = [
  'Баянгол', 'Баянзүрх', 'Сонгинохайрхан', 'Сүхбаатар', 'Хан-Уул', 'Чингэлтэй',
  'Налайх', 'Багануур', 'Багахангай', 'Орон нутаг',
];

export const money = (n: number) => `${Math.round(n).toLocaleString('mn-MN')} ₮`;

/** 120000000 → "120 сая ₮" — самбар, баганы нийлбэрт */
export function moneyShort(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(n % 1e9 ? 1 : 0)} тэрбум ₮`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 >= 1e5 ? 1 : 0)} сая ₮`;
  return money(n);
}

/** Утасны дугаарыг харьцуулахад — зөвхөн сүүлийн 8 цифр */
export const phoneKey = (p: string) => p.replace(/\D/g, '').slice(-8);

export const formatDate = (iso: string | null | undefined) =>
  iso ? iso.slice(0, 10) : '';

export const formatDateTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString('mn-MN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

/** "3 өдрийн өмнө" маягийн харьцангуй хугацаа */
export function relativeTime(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return '';
  const diff = Math.round((now - new Date(iso).getTime()) / 60000);
  const future = diff < 0;
  const m = Math.abs(diff);
  // Нэрийн харьяалахын тийн ялгал: минутын, цагийн, өдрийн
  const say = (v: number, unit: string) => `${v} ${unit} ${future ? 'дараа' : 'өмнө'}`;
  if (m < 1) return 'саяхан';
  if (m < 60) return say(m, 'минутын');
  const h = Math.round(m / 60);
  if (h < 24) return say(h, 'цагийн');
  const d = Math.round(h / 24);
  if (d < 31) return say(d, 'өдрийн');
  return formatDate(iso);
}

// ------------------------------------------------------------ мөр ↔ объект

type Row = Record<string, any>;
const s = (v: unknown) => (typeof v === 'string' ? v : '');

export const rowToCompany = (r: Row): Company => ({
  id: r.id, name: s(r.name), kind: r.kind ?? 'company', stage: r.stage ?? 'lead',
  regNo: s(r.reg_no), phone: s(r.phone), email: s(r.email), website: s(r.website),
  address: s(r.address), district: s(r.district), notes: s(r.notes),
  tags: Array.isArray(r.tags) ? r.tags : [], ownerId: r.owner_id ?? null,
  createdAt: s(r.created_at), updatedAt: s(r.updated_at),
});

export const companyToRow = (c: Partial<Company>): Row => {
  const r: Row = {};
  if (c.id !== undefined) r.id = c.id;
  if (c.name !== undefined) r.name = c.name.trim();
  if (c.kind !== undefined) r.kind = c.kind;
  if (c.stage !== undefined) r.stage = c.stage;
  if (c.regNo !== undefined) r.reg_no = c.regNo.trim();
  if (c.phone !== undefined) r.phone = c.phone.trim();
  if (c.email !== undefined) r.email = c.email.trim();
  if (c.website !== undefined) r.website = c.website.trim();
  if (c.address !== undefined) r.address = c.address.trim();
  if (c.district !== undefined) r.district = c.district;
  if (c.notes !== undefined) r.notes = c.notes;
  if (c.tags !== undefined) r.tags = c.tags;
  if (c.ownerId !== undefined) r.owner_id = c.ownerId;
  return r;
};

export const rowToContact = (r: Row): Contact => ({
  id: r.id, companyId: r.company_id ?? null, name: s(r.name), position: s(r.position),
  phone: s(r.phone), email: s(r.email), notes: s(r.notes), isPrimary: !!r.is_primary,
  createdAt: s(r.created_at),
});

export const contactToRow = (c: Partial<Contact>): Row => {
  const r: Row = {};
  if (c.id !== undefined) r.id = c.id;
  if (c.companyId !== undefined) r.company_id = c.companyId;
  if (c.name !== undefined) r.name = c.name.trim();
  if (c.position !== undefined) r.position = c.position.trim();
  if (c.phone !== undefined) r.phone = c.phone.trim();
  if (c.email !== undefined) r.email = c.email.trim();
  if (c.notes !== undefined) r.notes = c.notes;
  if (c.isPrimary !== undefined) r.is_primary = c.isPrimary;
  return r;
};

export const rowToDeal = (r: Row): Deal => ({
  id: r.id, companyId: r.company_id, contactId: r.contact_id ?? null, title: s(r.title),
  kind: r.kind ?? 'other', amount: Number(r.amount) || 0, stage: r.stage ?? 'new',
  expectedClose: r.expected_close ?? null, ownerId: r.owner_id ?? null, notes: s(r.notes),
  submissionId: r.submission_id ?? null, createdAt: s(r.created_at), updatedAt: s(r.updated_at),
  closedAt: r.closed_at ?? null,
});

export const dealToRow = (d: Partial<Deal>): Row => {
  const r: Row = {};
  if (d.id !== undefined) r.id = d.id;
  if (d.companyId !== undefined) r.company_id = d.companyId;
  if (d.contactId !== undefined) r.contact_id = d.contactId;
  if (d.title !== undefined) r.title = d.title.trim();
  if (d.kind !== undefined) r.kind = d.kind;
  if (d.amount !== undefined) r.amount = Math.max(0, Math.round(d.amount || 0));
  if (d.stage !== undefined) r.stage = d.stage;
  if (d.expectedClose !== undefined) r.expected_close = d.expectedClose || null;
  if (d.ownerId !== undefined) r.owner_id = d.ownerId;
  if (d.notes !== undefined) r.notes = d.notes;
  if (d.submissionId !== undefined) r.submission_id = d.submissionId;
  return r;
};

export const rowToActivity = (r: Row): Activity => ({
  id: r.id, companyId: r.company_id ?? null, dealId: r.deal_id ?? null, contactId: r.contact_id ?? null,
  kind: r.kind ?? 'note', body: s(r.body), dueAt: r.due_at ?? null, done: !!r.done,
  assigneeId: r.assignee_id ?? null, createdBy: r.created_by ?? null, createdAt: s(r.created_at),
});

export const activityToRow = (a: Partial<Activity>): Row => {
  const r: Row = {};
  if (a.companyId !== undefined) r.company_id = a.companyId;
  if (a.dealId !== undefined) r.deal_id = a.dealId;
  if (a.contactId !== undefined) r.contact_id = a.contactId;
  if (a.kind !== undefined) r.kind = a.kind;
  if (a.body !== undefined) r.body = a.body;
  if (a.dueAt !== undefined) r.due_at = a.dueAt;
  if (a.done !== undefined) r.done = a.done;
  if (a.assigneeId !== undefined) r.assignee_id = a.assigneeId;
  return r;
};

// ------------------------------------------------------------ CSV

/** Excel-д кирилл зөв харагдах BOM-той CSV татах */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const body = [header, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Энгийн CSV задлагч — хашилт доторх таслал, мөр шилжилтийг дэмжинэ */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  // Excel-ийн Монгол тохиргоо ";" ашиглаж болно
  const firstLine = src.split(/\r?\n/, 1)[0] ?? '';
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows.map((r) => r.map((c) => c.trim()));
}

/** Импортын баганын нэр → талбар (Монгол, Англи аль алиныг таньна) */
const IMPORT_COLUMNS: Record<string, keyof Company | 'contact' | 'contactPhone'> = {
  'нэр': 'name', 'байгууллага': 'name', 'байгууллагын нэр': 'name', 'name': 'name', 'company': 'name',
  'төрөл': 'kind', 'kind': 'kind', 'type': 'kind',
  'утас': 'phone', 'phone': 'phone', 'утасны дугаар': 'phone',
  'имэйл': 'email', 'и-мэйл': 'email', 'email': 'email',
  'хаяг': 'address', 'address': 'address',
  'дүүрэг': 'district', 'district': 'district',
  'рд': 'regNo', 'регистр': 'regNo', 'регистрийн дугаар': 'regNo', 'reg_no': 'regNo',
  'вэб': 'website', 'website': 'website',
  'тэмдэглэл': 'notes', 'notes': 'notes',
  'холбогдох хүн': 'contact', 'contact': 'contact',
  'холбогдох утас': 'contactPhone', 'contact phone': 'contactPhone',
};

const KIND_WORDS: [RegExp, CompanyKind][] = [
  [/сөх|soh|сууц өмчлөгч/i, 'soh'],
  [/хамтрагч|partner/i, 'partner'],
  [/төр|government|яам|агентлаг/i, 'government'],
  [/хувь хүн|individual/i, 'individual'],
];

export interface ImportRow {
  company: Partial<Company> & { name: string };
  contact?: { name: string; phone: string };
}

/** CSV-ийн мөрүүдийг байгууллага болгоно. Нэргүй мөрийг алгасна. */
export function csvToCompanies(rows: string[][]): { items: ImportRow[]; unknownColumns: string[] } {
  if (rows.length < 2) return { items: [], unknownColumns: [] };
  const header = rows[0].map((h) => h.toLowerCase().trim());
  const map = header.map((h) => IMPORT_COLUMNS[h]);
  const unknownColumns = rows[0].filter((_, i) => !map[i] && rows[0][i]);
  const items: ImportRow[] = [];
  for (const r of rows.slice(1)) {
    const c: Partial<Company> = {};
    let contact = '';
    let contactPhone = '';
    map.forEach((field, i) => {
      const v = r[i] ?? '';
      if (!field || !v) return;
      if (field === 'contact') contact = v;
      else if (field === 'contactPhone') contactPhone = v;
      else if (field === 'kind') c.kind = KIND_WORDS.find(([re]) => re.test(v))?.[1] ?? 'company';
      else (c as Record<string, string>)[field] = v;
    });
    if (!c.name) continue;
    if (!c.kind) c.kind = /сөх/i.test(c.name) ? 'soh' : 'company';
    items.push({ company: c as ImportRow['company'], contact: contact ? { name: contact, phone: contactPhone } : undefined });
  }
  return { items, unknownColumns };
}

/** Хүсэлтийн маягтаас байгууллагын нэр олох (СӨХ, байгууллага, барилга) */
export function companyNameFromDetails(details: Record<string, string>): string {
  const keys = Object.keys(details);
  const pick = (re: RegExp) => keys.find((k) => re.test(k) && details[k]?.trim());
  const key = pick(/байгууллага|сөх|компани/i) ?? pick(/барилга|байр|объект/i);
  return key ? details[key].trim() : '';
}
