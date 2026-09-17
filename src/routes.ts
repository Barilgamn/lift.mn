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

/** URL замаас хэсгийг олох. Тохирохгүй бол порталыг буцаана. */
export function sectionFromPath(pathname: string): ActiveSection {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const found = (Object.keys(ROUTES) as ActiveSection[]).find(
    (key) => ROUTES[key].path === clean
  );
  return found ?? 'portal';
}
