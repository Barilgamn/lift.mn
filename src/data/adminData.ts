import { Elevator, ServiceRecord, Submission } from '../types';

/**
 * Админ хэсгийн эхлэлийн өгөгдөл.
 *
 * ЭНЭ БОЛ ЖИШЭЭ ӨГӨГДӨЛ. Барилгын нэрс нь компанийн танилцуулгад
 * дурдсан бодит төслүүд боловч тоноглолын дугаар, координат, засварын
 * түүх, холбоо барих хүн бүгд зохиомол. Жинхэнэ ашиглалтад орохдоо
 * эдгээрийг бодит бүртгэлээр солино.
 */

/** Улаанбаатарын төв — газрын зураг эхэлж төвлөрөх цэг */
export const UB_CENTER: [number, number] = [47.9187, 106.9176];

export const SEED_ELEVATORS: Elevator[] = [
  {
    id: 'lift-001', code: 'DL-KLM-1042', building: 'Хийморь Гарден хотхон',
    district: 'Хан-Уул дүүрэг', address: '15-р хороо, А корпус, 1-р орц',
    lat: 47.8912, lng: 106.9081, brand: 'KLEEMANN', model: 'Atlas MRL',
    floors: 16, capacityKg: 1000, installedAt: '2021-06-14', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-02', nextServiceAt: '2026-10-02',
    contactName: 'Б. Ганзориг', contactPhone: '9911-4408',
  },
  {
    id: 'lift-002', code: 'DL-KLM-1043', building: 'Хийморь Гарден хотхон',
    district: 'Хан-Уул дүүрэг', address: '15-р хороо, А корпус, 2-р орц',
    lat: 47.8915, lng: 106.9088, brand: 'KLEEMANN', model: 'Atlas MRL',
    floors: 16, capacityKg: 1000, installedAt: '2021-06-14', contractType: 'monthly',
    status: 'fault', lastServiceAt: '2026-09-15', nextServiceAt: '2026-09-19',
    contactName: 'Б. Ганзориг', contactPhone: '9911-4408',
  },
  {
    id: 'lift-003', code: 'DL-KLM-0871', building: 'Twin Park хотхон',
    district: 'Сүхбаатар дүүрэг', address: '1-р хороо, Б блок',
    lat: 47.9241, lng: 106.9302, brand: 'KLEEMANN', model: 'Maison Lift',
    floors: 12, capacityKg: 630, installedAt: '2020-11-03', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-08', nextServiceAt: '2026-10-08',
    contactName: 'Д. Оюунчимэг', contactPhone: '9909-2251',
  },
  {
    id: 'lift-004', code: 'DL-KLM-0872', building: 'Twin Park хотхон',
    district: 'Сүхбаатар дүүрэг', address: '1-р хороо, В блок',
    lat: 47.9248, lng: 106.9311, brand: 'KLEEMANN', model: 'Maison Lift',
    floors: 12, capacityKg: 630, installedAt: '2020-11-03', contractType: 'monthly',
    status: 'maintenance', lastServiceAt: '2026-09-17', nextServiceAt: '2026-09-24',
    contactName: 'Д. Оюунчимэг', contactPhone: '9909-2251',
  },
  {
    id: 'lift-005', code: 'DL-KLM-1190', building: 'Барилгачин худалдааны төв',
    district: 'Баянгол дүүрэг', address: '20-р хороо, Үйлчилгээний блок',
    lat: 47.9106, lng: 106.8542, brand: 'KLEEMANN', model: 'Atlas Freight',
    floors: 6, capacityKg: 2000, installedAt: '2019-04-22', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-11', nextServiceAt: '2026-10-11',
    contactName: 'Ц. Батбаяр', contactPhone: '9919-7730',
  },
  {
    id: 'lift-006', code: 'DL-KLM-1191', building: 'Барилгачин худалдааны төв',
    district: 'Баянгол дүүрэг', address: '20-р хороо, Эскалатор, 1-2 давхар',
    lat: 47.9109, lng: 106.8548, brand: 'KLEEMANN', model: 'Escalator 30°',
    floors: 2, capacityKg: 0, installedAt: '2019-04-22', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-11', nextServiceAt: '2026-10-11',
    contactName: 'Ц. Батбаяр', contactPhone: '9919-7730',
  },
  {
    id: 'lift-007', code: 'DL-KLM-0655', building: 'Гранд Парк',
    district: 'Сүхбаатар дүүрэг', address: '6-р хороо, Үндсэн блок',
    lat: 47.9195, lng: 106.9245, brand: 'KLEEMANN', model: 'Atlas MRL',
    floors: 18, capacityKg: 1000, installedAt: '2018-09-30', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-05', nextServiceAt: '2026-10-05',
    contactName: 'Н. Энхтуяа', contactPhone: '8811-3092',
  },
  {
    id: 'lift-008', code: 'DL-KLM-1355', building: 'Lotus Hotel & Restaurant',
    district: 'Чингэлтэй дүүрэг', address: '4-р хороо, Зочид буудлын блок',
    lat: 47.9298, lng: 106.9074, brand: 'KLEEMANN', model: 'Maison Lift',
    floors: 9, capacityKg: 630, installedAt: '2022-03-18', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-08-29', nextServiceAt: '2026-09-29',
    contactName: 'Г. Тэмүүлэн', contactPhone: '9950-1184',
  },
  {
    id: 'lift-009', code: 'DL-KLM-1402', building: 'Өрнөх хороолол',
    district: 'Баянзүрх дүүрэг', address: '26-р хороо, 4-р байр',
    lat: 47.9221, lng: 106.9702, brand: 'KLEEMANN', model: 'Atlas MRL',
    floors: 14, capacityKg: 800, installedAt: '2023-07-11', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-09', nextServiceAt: '2026-10-09',
    contactName: 'С. Мөнхбат', contactPhone: '9977-6620',
  },
  {
    id: 'lift-010', code: 'DL-KLM-1403', building: 'Шуншиг хотхон',
    district: 'Сонгинохайрхан дүүрэг', address: '32-р хороо, 2-р байр',
    lat: 47.9012, lng: 106.7841, brand: 'KLEEMANN', model: 'Atlas MRL',
    floors: 10, capacityKg: 630, installedAt: '2023-10-02', contractType: 'on-call',
    status: 'offline', lastServiceAt: '2026-07-21', nextServiceAt: '—',
    contactName: 'Р. Дэлгэрмаа', contactPhone: '9902-4417',
  },
  {
    id: 'lift-011', code: 'DL-KLM-0988', building: 'Цаг уур, орчны шинжилгээний газар',
    district: 'Баянзүрх дүүрэг', address: 'Жуулчны гудамж, Төв байр',
    lat: 47.9163, lng: 106.9561, brand: 'KLEEMANN', model: 'Atlas MRL',
    floors: 8, capacityKg: 800, installedAt: '2020-02-25', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-12', nextServiceAt: '2026-10-12',
    contactName: 'Ж. Алтанцэцэг', contactPhone: '9915-8803',
  },
  {
    id: 'lift-012', code: 'DL-KLM-1501', building: 'Хүслийн хотхон',
    district: 'Хан-Уул дүүрэг', address: '11-р хороо, 3-р байр',
    lat: 47.8854, lng: 106.9321, brand: 'KLEEMANN', model: 'Maison Lift',
    floors: 11, capacityKg: 630, installedAt: '2024-05-16', contractType: 'monthly',
    status: 'operational', lastServiceAt: '2026-09-14', nextServiceAt: '2026-10-14',
    contactName: 'Б. Отгонбаяр', contactPhone: '9938-2276',
  },
];

export const SEED_SERVICE_RECORDS: ServiceRecord[] = [
  {
    id: 'sr-001', elevatorId: 'lift-002', date: '2026-09-15', engineer: 'Э. Баттулга',
    kind: 'emergency', issue: 'Хаалга 7-р давхарт хагас нээгдээд гацсан. Зорчигч дотор үлдсэн.',
    resolution: 'Зорчигчийг гараар гаргав. Хаалганы серво моторын шүд элэгдсэн нь илэрсэн. Түр тохируулга хийж хаалга хэвийн ажиллуулсан. Сэлбэг захиалсан.',
    partsUsed: [], durationMin: 95, outcome: 'awaiting-parts',
  },
  {
    id: 'sr-002', elevatorId: 'lift-002', date: '2026-08-14', engineer: 'Э. Баттулга',
    kind: 'routine', issue: 'Сар бүрийн хуваарьт үзлэг.',
    resolution: 'Тросс, тоормос, хаалганы механизм шалгав. Хаалганы дуу чимээ ихэссэн тул хяналтад авав.',
    partsUsed: ['Хөтөчийн тос 1л'], durationMin: 60, outcome: 'monitoring',
  },
  {
    id: 'sr-003', elevatorId: 'lift-001', date: '2026-09-02', engineer: 'Э. Баттулга',
    kind: 'routine', issue: 'Сар бүрийн хуваарьт үзлэг.',
    resolution: 'Бүх систем хэвийн. Товчлуурын гэрэлтүүлэг солив.',
    partsUsed: ['Товчлуурын LED x2'], durationMin: 55, outcome: 'resolved',
  },
  {
    id: 'sr-004', elevatorId: 'lift-004', date: '2026-09-17', engineer: 'Б. Наранбаатар',
    kind: 'repair', issue: 'Давхар хооронд зогсохдоо 3-5 см зөрж, шалны түвшин таарахгүй.',
    resolution: 'Инверторын удаашралын параметр дахин тохируулсан. Энкодерын холболт чангалсан. Туршилтаар 20 удаа зогсоолт хийж, зөрүү 5 мм-ээс доош болсон.',
    partsUsed: [], durationMin: 140, outcome: 'resolved',
  },
  {
    id: 'sr-005', elevatorId: 'lift-005', date: '2026-09-11', engineer: 'Г. Мөнх-Эрдэнэ',
    kind: 'inspection', issue: 'Жилийн техникийн магадлалын үзлэг.',
    resolution: 'Ачааны лифтний тоормосны зай, тросс элэгдэл хэмжсэн. Бүгд норматив дотор. Дүгнэлт олгосон.',
    partsUsed: [], durationMin: 180, outcome: 'resolved',
  },
  {
    id: 'sr-006', elevatorId: 'lift-006', date: '2026-09-11', engineer: 'Г. Мөнх-Эрдэнэ',
    kind: 'routine', issue: 'Эскалаторын сар бүрийн үзлэг.',
    resolution: 'Гишгүүрийн гинж тослов, хажуугийн бариулын хурд тааруулсан.',
    partsUsed: ['Гинжний тос 2л'], durationMin: 75, outcome: 'resolved',
  },
  {
    id: 'sr-007', elevatorId: 'lift-010', date: '2026-07-21', engineer: 'Б. Наранбаатар',
    kind: 'repair', issue: 'Цахилгааны хэлбэлзлээс үндсэн самбар шатсан.',
    resolution: 'Самбарыг салгаж, лифтийг түр зогсоосон. Шинэ самбар захиалах саналыг захиалагчид хүргүүлсэн. Гэрээ сунгагдаагүй тул хүлээгдэж байна.',
    partsUsed: [], durationMin: 210, outcome: 'awaiting-parts',
  },
  {
    id: 'sr-008', elevatorId: 'lift-007', date: '2026-09-05', engineer: 'Э. Баттулга',
    kind: 'routine', issue: 'Сар бүрийн хуваарьт үзлэг.',
    resolution: 'Хэвийн. Бүхээгний гэрэлтүүлэг цэвэрлэв.',
    partsUsed: [], durationMin: 50, outcome: 'resolved',
  },
  {
    id: 'sr-009', elevatorId: 'lift-009', date: '2026-09-09', engineer: 'Г. Мөнх-Эрдэнэ',
    kind: 'routine', issue: 'Сар бүрийн хуваарьт үзлэг.',
    resolution: 'Хэвийн. Дуудлагын товчлуурын холболт шалгав.',
    partsUsed: [], durationMin: 45, outcome: 'resolved',
  },
  {
    id: 'sr-010', elevatorId: 'lift-012', date: '2026-09-14', engineer: 'Б. Наранбаатар',
    kind: 'routine', issue: 'Сар бүрийн хуваарьт үзлэг.',
    resolution: 'Хэвийн. Хаалганы фотоэлемент цэвэрлэв.',
    partsUsed: [], durationMin: 50, outcome: 'resolved',
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'DL-2026-4417', kind: 'emergency', createdAt: '2026-09-17 14:32',
    contactName: 'Б. Ганзориг', phone: '9911-4408',
    summary: 'Хийморь Гарден, А корпус 2-р орц — хүн гацсан',
    status: 'done',
    details: {
      'Байршил': 'Хан-Уул, 15-р хороо, Хийморь Гарден А корпус, 2-р орц',
      'Давхар': '7-р давхар', 'Хүн гацсан эсэх': 'Тийм, 1 хүн',
      'Дуудлага өгсөн': '14:32', 'Инженер очсон': '14:51',
      'Тоноглол': 'DL-KLM-1043',
    },
  },
  {
    id: 'DL-2026-4416', kind: 'service-ticket', createdAt: '2026-09-17 09:15',
    contactName: 'Д. Оюунчимэг', phone: '9909-2251',
    summary: 'Twin Park В блок — давхрын түвшин зөрж байна',
    status: 'done',
    details: {
      'Захиалагчийн статус': 'СӨХ', 'Дүүрэг': 'Сүхбаатар дүүрэг',
      'Байршил': '1-р хороо, Twin Park В блок', 'Брэнд': 'KLEEMANN',
      'Асуудлын төрөл': 'Давхар зөрөх', 'Яаралтай эсэх': 'Дунд',
      'Тоноглол': 'DL-KLM-0872',
    },
  },
  {
    id: 'DL-2026-4415', kind: 'quote', createdAt: '2026-09-16 16:40',
    contactName: 'Ө. Ням-Очир', phone: '9944-1180',
    summary: '14 давхар орон сууц — 2 зорчигчийн лифт',
    status: 'in-progress',
    details: {
      'Төрөл': 'Зорчигчийн', 'Давхрын тоо': '14', 'Даац': '1000 кг',
      'Тоо ширхэг': '2', 'Барилгын байршил': 'Баянзүрх дүүрэг',
      'Хүлээгдэж буй': 'Техникийн үзүүлэлт, үнийн санал',
    },
  },
  {
    id: 'DL-2026-4414', kind: 'order', createdAt: '2026-09-16 11:08',
    contactName: 'Ц. Батбаяр', phone: '9919-7730',
    summary: 'Сэлбэгийн захиалга — 3 нэр төрөл, 2,180,000 ₮',
    status: 'in-progress',
    details: {
      'Байгууллага': 'Барилгачин ХТ', 'Хүргэлтийн хаяг': 'Баянгол, 20-р хороо',
      'Барааны тоо': '3 нэр төрөл', 'Нийт дүн': '2,180,000 ₮',
      'Төлбөрийн хэлбэр': 'Дансаар', 'НӨАТ': 'Шаардлагатай',
    },
  },
  {
    id: 'DL-2026-4413', kind: 'booking', createdAt: '2026-09-15 13:22',
    contactName: 'Н. Энхтуяа', phone: '8811-3092',
    summary: 'Гранд Парк — хуваарьт үзлэг захиалга, 09-25',
    status: 'new',
    details: {
      'Үйлчилгээ': 'Сар тутмын хуваарьт техникийн үйлчилгээ',
      'Огноо': '2026-09-25', 'Цаг': '10:00 - 12:00',
      'Байршил': 'Сүхбаатар, 6-р хороо, Гранд Парк',
    },
  },
  {
    id: 'DL-2026-4412', kind: 'sourcing', createdAt: '2026-09-15 10:05',
    contactName: 'Р. Дэлгэрмаа', phone: '9902-4417',
    summary: 'Шуншиг хотхон — үндсэн удирдлагын самбар хайж байна',
    status: 'new',
    details: {
      'Лифтний брэнд': 'KLEEMANN', 'Үйлдвэрлэсэн он': '2023',
      'Шаардлагатай сэлбэг': 'Үндсэн удирдлагын самбар (main controller board)',
      'Байгууллага': 'Шуншиг СӨХ', 'Нэмэлт': 'Цахилгааны хэлбэлзлээс шатсан',
    },
  },
  {
    id: 'DL-2026-4411', kind: 'service-ticket', createdAt: '2026-09-14 17:44',
    contactName: 'Г. Тэмүүлэн', phone: '9950-1184',
    summary: 'Lotus Hotel — бүхээгт чимээ ихэссэн',
    status: 'new',
    details: {
      'Захиалагчийн статус': 'Бизнес / Оффис', 'Дүүрэг': 'Чингэлтэй дүүрэг',
      'Байршил': '4-р хороо, Lotus Hotel', 'Брэнд': 'KLEEMANN',
      'Асуудлын төрөл': 'Чимээ, доргилт', 'Яаралтай эсэх': 'Энгийн',
    },
  },
  {
    id: 'DL-2026-4410', kind: 'quote', createdAt: '2026-09-12 15:30',
    contactName: 'Т.Ganbold', phone: '9966-3341',
    summary: 'Эмнэлгийн лифт — 1 ширхэг, 6 давхар',
    status: 'done',
    details: {
      'Төрөл': 'Эмнэлгийн', 'Давхрын тоо': '6', 'Даац': '1600 кг',
      'Тоо ширхэг': '1', 'Барилгын байршил': 'Хан-Уул дүүрэг',
      'Үр дүн': 'Үнийн санал илгээсэн, гэрээ хэлэлцэж байна',
    },
  },
];
