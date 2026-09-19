import { ActiveSection } from './types';

/** Хэсэг бүрийн URL зам ба хуудасны гарчиг */
export const ROUTES: Record<ActiveSection, { path: string; title: string; label: string }> = {
  portal: {
    path: '/',
    title: 'LIFT.MN — Лифт, эскалаторын нэгдсэн портал',
    label: 'Портал',
  },
  'delta-lift': {
    path: '/delta-lift',
    title: 'DELTA LIFT — Дельта Элеватор ХХК | LIFT.MN',
    label: 'DELTA LIFT',
  },
  parts: {
    path: '/parts',
    title: 'Сэлбэг хэрэгсэл — Онлайн худалдаа | LIFT.MN',
    label: 'Сэлбэг хэрэгсэл',
  },
  service: {
    path: '/service',
    title: 'Засвар үйлчилгээ — 24/7 дуудлага | LIFT.MN',
    label: 'Засвар үйлчилгээ',
  },
};

/** Барааны дэлгэрэнгүй хуудасны зам */
export const productPath = (id: string) => `${ROUTES.parts.path}/${encodeURIComponent(id)}`;

/**
 * URL замаас хэсгийг олох. Тохирохгүй бол порталыг буцаана.
 *
 * Дэд зам (жишээ нь /parts/hs-button) нь эцэг хэсэгтээ тооцогдоно —
 * ингэснээр цэсэн дээр "Сэлбэг хэрэгсэл" идэвхтэй хэвээр харагдана.
 */
export function sectionFromPath(pathname: string): ActiveSection {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const keys = Object.keys(ROUTES) as ActiveSection[];
  const exact = keys.find((key) => ROUTES[key].path === clean);
  if (exact) return exact;
  const nested = keys.find(
    (key) => ROUTES[key].path !== '/' && clean.startsWith(`${ROUTES[key].path}/`)
  );
  return nested ?? 'portal';
}
