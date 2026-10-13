/**
 * Өргөх байгууламжийн салбарын 17-р спортын их наадам (2026).
 * /sportnaadam хуудас болон админы "Наадам" хэсэг энд хамаарна.
 */

/** Бүртгэлийг `submissions` дотор ялгах тэмдэг (kind = 'booking') */
export const NAADAM_TYPE = 'Спортын наадам 2026';

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
  videoUrl: 'https://www.facebook.com/reel/1141804368520782',
  templateUrl: '/files/sportnaadam-cs2-bagiin-medvvleg.docx',
} as const;

export interface Sport {
  id: string;
  label: string;
  emoji: string;
  /** Багийн мэдүүлэг (Word) шаардлагатай эсэх */
  needsTeamForm?: boolean;
}

/** Танилцуулгад харагдах дараалал */
export const SPORTS: Sport[] = [
  { id: 'basketball', label: 'Сагсан бөмбөг', emoji: '🏀' },
  { id: 'volleyball', label: 'Гар бөмбөг', emoji: '🏐' },
  { id: 'table-tennis', label: 'Ширээний теннис', emoji: '🏓' },
  { id: 'chess', label: 'Шатар', emoji: '♟️' },
  { id: 'darts', label: 'Дартс', emoji: '🎯' },
  { id: 'tug-of-war', label: 'Олс таталт', emoji: '🪢' },
  { id: 'cs2', label: 'E-sport · CS2', emoji: '🎮', needsTeamForm: true },
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
