/**
 * Өргөх байгууламжийн салбарын 17-р спортын их наадам (2026).
 * /sportnaadam хуудас болон админы "Наадам" хэсэг энд хамаарна.
 */

/** Бүртгэлийг `submissions` дотор ялгах тэмдэг (kind = 'booking') */
export const NAADAM_TYPE = 'Спортын наадам 2026';

/** Багийн мэдүүлэг хадгалах Supabase Storage сан (supabase/schema.sql) */
export const NAADAM_BUCKET = 'naadam';

export const NAADAM = {
  edition: '17-р',
  title: 'Спортын их наадам',
  sector: 'Өргөх байгууламжийн салбарын мэргэжлийн байгууллагуудын',
  jubilee: 'Монгол Улсад барилгын салбар үүсэж хөгжсөний 100 жилийн ой',
  dateLabel: '2026.11.07–08',
  dateLong: '2026 оны 11 дүгээр сарын 7, 8-ны өдрүүдэд',
  /** Тоолуурт — Улаанбаатарын цагаар нээлтийн өдөр */
  startsAt: '2026-11-07T09:00:00+08:00',
  venue: 'GAN Sports Center, ATTILA',
  slogan: 'Талбай дээр өрсөлдөж, салбартаа хамтдаа хөгжье!',
  intro:
    'Салбарын хамт олны нөхөрлөл, хамтын ажиллагааг бэхжүүлж, багийн эв нэгдэл, хурд хүч, ' +
    'авхаалж самбаагаа сорих энэхүү наадамд байгууллагуудыг идэвхтэй оролцохыг урьж байна.',
  /** Албан ёсны постер — зохион байгуулагчдын лого, төрлүүд, огноо */
  poster: '/images/sportnaadam/poster.jpg',
  posterSmall: '/images/sportnaadam/poster-1000.jpg',
  /** Багийн мэдүүлгийн загвар — бүх төрөлд нэг загвар */
  templateUrl: '/files/sportnaadam-bagiin-medvvleg.docx',
  /** Наадмын лавлах — сайтын ерөнхий утаснаас тусдаа */
  phones: ['9663-2222', '9500-2222'],
  email: 'info@lift.mn',
} as const;

export interface Sport {
  id: string;
  label: string;
  emoji: string;
  /** Постероос хайчилсан шугаман icon (public/images/sportnaadam/<id>.png) */
  icon: string;
  /** Өргөн icon (олс таталт) — сүлжээнд хоёр нүд эзэлнэ */
  wide?: boolean;
}

/** Танилцуулгад харагдах дараалал */
export const SPORTS: Sport[] = [
  { id: 'basketball', label: 'Сагсан бөмбөг', emoji: '🏀', icon: '/images/sportnaadam/basketball.png' },
  { id: 'volleyball', label: 'Гар бөмбөг', emoji: '🏐', icon: '/images/sportnaadam/volleyball.png' },
  { id: 'table-tennis', label: 'Ширээний теннис', emoji: '🏓', icon: '/images/sportnaadam/table-tennis.png' },
  { id: 'chess', label: 'Шатар', emoji: '♟️', icon: '/images/sportnaadam/chess.png' },
  { id: 'darts', label: 'Дартс', emoji: '🎯', icon: '/images/sportnaadam/darts.png' },
  { id: 'tug-of-war', label: 'Олс таталт', emoji: '🪢', icon: '/images/sportnaadam/tug-of-war.png', wide: true },
  { id: 'cs2', label: 'E-sport · CS2', emoji: '🎮', icon: '/images/sportnaadam/cs2.png' },
];

/** Бүртгэлийн маягтын дараалал */
export const FORM_SPORT_ORDER = ['basketball', 'volleyball', 'tug-of-war', 'table-tennis', 'darts', 'chess', 'cs2'];

export const sportById = (id: string) => SPORTS.find((s) => s.id === id);

export const ORGANIZERS: { role: string; names: string[] }[] = [
  { role: 'Ерөнхий зохион байгуулагч', names: ['DELTA LIFT', 'LIFT MN'] },
  {
    role: 'Хамтран зохион байгуулагч',
    names: [
      'Хот байгуулалт, барилга, орон сууцжуулалтын яам',
      'Power Frequency LLC — Краны сургалт, магадлагаа, засвар, барилгын цогц үйлчилгээ',
    ],
  },
  {
    role: 'Дэмжигч байгууллага',
    names: ['Barilga.mn', 'Өргөн Тээвэрлэх Машин Төхөөрөмж Үндэсний Холбоо'],
  },
];

/** Бүртгэлийн details түлхүүрүүд — админ хэсэг эдгээрээр уншина */
export const NK = {
  type: 'Төрөл',
  org: 'Байгууллага',
  name: 'Нэр',
  position: 'Албан тушаал',
  phone: 'Утас',
  email: 'Имэйл',
  sports: 'Оролцох төрлүүд',
  /** Төрлүүдийн id, таслалаар — тоолоход */
  sportIds: '_sportIds',
} as const;

/** Бүртгэл нь наадмын бүртгэл мөн эсэх */
export const isNaadamEntry = (s: { kind: string; details?: Record<string, string> }) =>
  s.kind === 'booking' && s.details?.[NK.type] === NAADAM_TYPE;
