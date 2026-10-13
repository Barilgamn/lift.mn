/**
 * Маягтуудын лифтний брэндийн жагсаалт.
 *
 * `value` нь админ руу очих утга, `label` нь сонголтод харагдах нэр.
 * Жагсаалтын эхнийх нь анхны сонголт болно.
 */
export interface BrandOption {
  value: string;
  label: string;
}

/** Сэлбэг хайлгах / захиалах маягт (Сэлбэг хэрэгсэл хуудас) */
export const PARTS_ORDER_BRANDS: BrandOption[] = [
  { value: 'OTIS', label: 'OTIS' },
  { value: 'Mitsubishi', label: 'Mitsubishi' },
  { value: 'Hyundai', label: 'Hyundai' },
  { value: 'Sigma', label: 'Sigma (LG)' },
  { value: 'Schindler', label: 'Schindler' },
  { value: 'KONE', label: 'KONE' },
  { value: 'Thyssenkrupp', label: 'Thyssenkrupp' },
  { value: 'Fujitec', label: 'Fujitec' },
  { value: 'Kleemann', label: 'Kleemann' },
  { value: 'Edinburgh', label: 'Edinburgh' },
  { value: 'Sword', label: 'Sword' },
  { value: 'Other', label: 'Бусад / Тодорхойгүй' },
];

/** Каталогийн брэндийн шүүлтүүр (Сэлбэг хэрэгсэл хуудас) */
export const PARTS_FILTER_BRANDS: string[] = [
  'OTIS',
  'Mitsubishi',
  'Thyssenkrupp',
  'Fujitec',
  'Kleemann',
  'Edinburgh',
  'Sword',
  'CEDES',
  'STEP Tech',
  'Fermator',
  'TorinDrive',
  'Dynatech',
];

/** Лифтний засварын хүсэлт илгээх маягт (Засвар үйлчилгээ хуудас) */
export const SERVICE_BRANDS: BrandOption[] = [
  { value: 'Mitsubishi', label: 'Mitsubishi' },
  { value: 'Hyundai', label: 'Hyundai Elevator' },
  { value: 'Sigma', label: 'Sigma / LG' },
  { value: 'BLT', label: 'BLT-Brilliant' },
  { value: 'Kleemann', label: 'Kleemann' },
  { value: 'Edinburgh', label: 'Edinburgh' },
  { value: 'Thyssenkrupp', label: 'Thyssenkrupp' },
  { value: 'Sword', label: 'Sword' },
  { value: 'Schindler', label: 'Schindler' },
  { value: 'Delta', label: 'Delta Line / Бусад' },
];
