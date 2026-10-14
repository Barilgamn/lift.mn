/**
 * Админы эрхүүд — supabase/admin-users.sql-ийн `profiles.permissions`-тэй ижил.
 *
 * Цэс, хуудсыг энд нуудаг ч жинхэнэ хамгаалалт нь өгөгдлийн сан дээрх
 * RLS: эрхгүй хэрэглэгч хуудсыг шууд хаягаар нээсэн ч өгөгдөл ирэхгүй.
 */

export type Perm = 'requests' | 'quotes' | 'naadam' | 'elevators' | 'products' | 'users';

export const PERMS: { id: Perm; label: string; hint: string }[] = [
  { id: 'requests', label: 'Бүртгэлүүд', hint: 'Засварын хүсэлт, дуудлага, захиалга' },
  { id: 'quotes', label: 'Үнийн санал', hint: 'Сэлбэгийн үнийн санал хариулах' },
  { id: 'naadam', label: 'Спортын наадам', hint: 'Багуудын бүртгэл, мэдүүлэг' },
  { id: 'elevators', label: 'Лифтүүд', hint: 'Лифт, газрын зураг, засварын түүх' },
  { id: 'products', label: 'Бүтээгдэхүүн', hint: 'Сэлбэг нэмэх, засах, зураг' },
  { id: 'users', label: 'Хэрэглэгчид', hint: 'Хэрэглэгч нэмэх, хасах, эрх, нууц үг' },
];

export const ALL_PERMS: Perm[] = PERMS.map((p) => p.id);

/** Түгээмэл эрхийн багц — хэрэглэгч нэмэхэд нэг товшилтоор сонгоно */
export const PERM_PRESETS: { label: string; perms: Perm[] }[] = [
  { label: 'Бүрэн эрхтэй админ', perms: ALL_PERMS },
  { label: 'Борлуулалт', perms: ['quotes', 'products'] },
  { label: 'Засвар үйлчилгээ', perms: ['requests', 'elevators'] },
  { label: 'Наадам', perms: ['naadam'] },
];

export const permLabel = (p: string) => PERMS.find((x) => x.id === p)?.label ?? p;

export const normalizePerms = (value: unknown): Perm[] =>
  Array.isArray(value) ? ALL_PERMS.filter((p) => value.includes(p)) : [];
