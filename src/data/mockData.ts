import { TariffItem, SparePart, ServiceTicket } from '../types';

export const TARIFF_PLANS: TariffItem[] = [
  {
    id: 'tariff-standard',
    title: 'СӨХ СТАНДАРТ ГЭРЭЭ',
    target: 'Орон сууцны СӨХ, Бага/Дунд давхар',
    price: '180,000₮',
    period: 'лифт бүр / сар',
    features: [
      'Сар бүрийн 2 удаагийн хуваарьт техникийн үзлэг',
      '24/7 Гацсан хүний шуурхай дуудлага (30 мин дотор)',
      'Үнэгүй жижиг тосолгоо, тохируулга, цэвэрлэгээ',
      'Жилийн улсын техникийн хяналтын үзлэгт бэлтгэх',
      'Сэлбэг хэрэгслийн худалдан авалтад 10% хөнгөлөлт'
    ]
  },
  {
    id: 'tariff-pro',
    title: 'БИЗНЕС ЦОГЦОЛБОР (VIP)',
    target: 'Оффис, Зочид буудал, Худалдааны төв',
    price: '320,000₮',
    period: 'лифт бүр / сар',
    popular: true,
    features: [
      'Сар бүрийн 4 удаагийн нарийвчилсан үзлэг оношилгоо',
      '24/7 Онцгой яаралтай диспетчерийн 15 минутын шуурхай очилт',
      'Инженер technical report & сар бүрийн хяналтын тайлан',
      'Ачаалал ихтэй үеийн урьдчилан сэргийлэх тохиргоо',
      'Сэлбэгийн 20% хөнгөлөлт ба түр солих эд анги',
      'Хариуцсан тусгай инженер томилогдоно'
    ]
  },
  {
    id: 'tariff-single',
    title: 'НЭГ УДААГИЙН ОНОШИЛГОО & ДУУДЛАГА',
    target: 'Гэрээгүй СӨХ, Иргэн, Түрээслэгч',
    price: '80,000₮',
    period: '1 удаагийн очилт',
    features: [
      'Лифтний доголдол, дуу чимээ, зогсолтыг нарийвчлан оношлох',
      'Компьютер оношилгооны төхөөрөмжөөр алдааны код унших',
      'Акт дүгнэлт, шаардагдах засвар ба сэлбэгийн тооцоо гаргах',
      'Энгийн гэмтлийг газар дээр нь арилгах (сэлбэг орохгүй)',
      '3 хоногийн дотор эвдрэл давтагдвал үнэгүй үзлэг'
    ]
  },
  {
    id: 'tariff-inspection',
    title: 'УЛСЫН ХЯНАЛТЫН ТЕХНИКИЙН ҮЗЛЭГ',
    target: 'Жил тутмын баталгаажуулалт',
    price: '150,000₮',
    period: '1 лифтний бүрэн акт',
    features: [
      '64 үзүүлэлтийн иж бүрэн техникийн шалгалт',
      'Тоормосны систем, аюулгүйн шүд, хязгаарлагчийн шалгалт',
      'Тросс кабелийн суналт, элэгдлийн лазер хэмжилт',
      'Хяналтын улсын байцаагчийн дүгнэлт гаргуулахад бэлтгэх',
      'Баталгаажсан техникийн пасспорт шинэчлэх'
    ]
  }
];

export const SPARE_PARTS: SparePart[] = [
  {
    id: 'part-1',
    name: 'Monarch NICE 3000+ Ухаалаг Хяналтын Самбар',
    oemCode: 'MON-NICE-3000P',
    category: 'inverter',
    categoryLabel: 'Инвертер & Хяналт',
    brand: 'Monarch',
    price: 3250000,
    inStock: true,
    stockCount: 8,
    deliveryDays: 'Улаанбаатарт өнөөдөр хүргэнэ',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Хүчин чадал': '11kW - 18.5kW',
      'Хүчдэл': '3-Phase 380V',
      'Макс хурд': '2.5 м/с хүртэл',
      'Зориулалт': 'Synchronous & Asynchronous motor',
      'Баталгаат хугацаа': '12 сар'
    },
    description: 'Лифтний дэлхийн хамгийн алдартай, олон төрлийн лифтэнд төгс тохирох инвертер болон логик хяналтыг нэгтгэсэн ухаалаг төхөөрөмж.'
  },
  {
    id: 'part-2',
    name: 'OTIS AT120 Хаалганы Мотор & Хөтлөгч',
    oemCode: 'OTIS-DOOR-AT120',
    category: 'door',
    categoryLabel: 'Хаалганы механизм',
    brand: 'OTIS',
    price: 1850000,
    inStock: true,
    stockCount: 14,
    deliveryDays: 'Бэлэн байгаа',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Хүчдэл': '220V AC / DC Brushless',
      'Хөтлөх төрөл': 'Шүдэт туузан дамжуулагч',
      'Тохирох загвар': 'OTIS Gen2, SKY, GeN2 Comfort',
      'Баталгаа': '18 сар'
    },
    description: 'Лифтний хаалгыг зөөлөн, чимээгүй нээж хаах зориулалттай оригнал OTIS серво мотор ба контроллер блок.'
  },
  {
    id: 'part-3',
    name: 'Mitsubishi Ган Тросс Кабель (10мм 8x19S+FC)',
    oemCode: 'CABLE-MIT-10MM',
    category: 'cable',
    categoryLabel: 'Тросс & Кабель',
    brand: 'Mitsubishi',
    price: 48000,
    inStock: true,
    stockCount: 1500,
    deliveryDays: 'Метрээр зүсэж өгнө',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Диаметр': '10 мм (Мөн 8мм, 12мм захиалгаар)',
      'Бүтэц': '8x19S + Fiber Core (FC)',
      'Даацын хязгаар': '54.5 kN (5.5 тонн)',
      'Сертификат': 'ISO 4344, CE Certified'
    },
    description: 'Японы өндөр суналтад тэсвэртэй, тусгай тосолгоотой лифтний татах ган олс кабель.'
  },
  {
    id: 'part-4',
    name: 'CEDES Хэт улаан туяаны Аюулгүйн Фотоэлемент',
    oemCode: 'CEDES-MINI-MAX',
    category: 'sensor',
    categoryLabel: 'Мэдрэгч & Фотоэлемент',
    brand: 'CEDES (Швейцарь)',
    price: 490000,
    inStock: true,
    stockCount: 22,
    deliveryDays: 'Бэлэн байгаа',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Цацрагийн тоо': '36 - 128 цацраг',
      'Өндөр': '2000 мм хүртэл хамгаалалт',
      'Хариу үйлдэл': '< 65 миллисекунд',
      'Хамгаалалт': 'IP65 ус тоосны хамгаалалт'
    },
    description: 'Лифтний хаалганд хүн, тэргэнцэр хавчигдахаас сэргийлэгч 128 цацраг бүхий Швейцарь фотохөшиг мэдрэгч.'
  },
  {
    id: 'part-5',
    name: 'COP/LOP Мэдрэгчтэй Товчлуур & LCD Дэлгэц (4.3 инч)',
    oemCode: 'DISP-LCD-STEP43',
    category: 'button',
    categoryLabel: 'Товчлуур & Дэлгэц',
    brand: 'STEP Tech',
    price: 680000,
    inStock: true,
    stockCount: 30,
    deliveryDays: 'Бэлэн байгаа',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Дэлгэц': '4.3" Full Color TFT LCD',
      'Харуулах': 'Давхар, сум, огноо, цаг, онцгой мэдээлэл',
      'Товчлуур': 'Зэвэрдэггүй ган, Braille үсэгтэй, LED цагираг',
      'Холболт': 'CAN-bus / RS485'
    },
    description: 'Лифтний кабин доторх болон давхрын дуудлагын товчлуур, харааны бэрхшээлтэй иргэдэд зориулсан брайль үсэгтэй.'
  },
  {
    id: 'part-6',
    name: 'Fermator 2-Panel Төвийн Нээлттэй Хаалганы Зам & Ролик',
    oemCode: 'FERM-ROLLER-402',
    category: 'door',
    categoryLabel: 'Хаалганы механизм',
    brand: 'Fermator (Испани)',
    price: 340000,
    inStock: true,
    stockCount: 45,
    deliveryDays: 'Бэлэн байгаа',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Материал': 'Хүчитгэсэн полиуретан ролик, хөнгөн цагаан зам',
      'Даац': 'Хаалганы самбар бүр 120 кг хүртэл',
      'Элэгдэл тэсвэр': '1 сая цикл нээлт/хаалт'
    },
    description: 'Испаний Fermator брэндийн лифтний давхар бүрийн хаалганы хөтлөх ролик, чимээгүй гүйлтийн дагалдах хэрэгсэл.'
  },
  {
    id: 'part-7',
    name: 'TorinDrive PM Gearless Синхрон Хөдөлгүүр Мотор',
    oemCode: 'TORIN-GT-450K',
    category: 'motor',
    categoryLabel: 'Хөдөлгүүр & Мотор',
    brand: 'TorinDrive',
    price: 9800000,
    inStock: false,
    stockCount: 0,
    deliveryDays: 'Захиалгаар 7-14 хоногт',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Даац': '630 - 1000 кг (8 - 13 хүн)',
      'Хурд': '1.0 - 2.0 м/с',
      'Эрчим хүч': 'A-class energy saver',
      'Дуу чимээ': '< 52 dB'
    },
    description: 'Машины өрөөгүй (MRL) лифтэнд суурилуулах байнгын соронзон серво синхрон хөтлөгч.'
  },
  {
    id: 'part-8',
    name: 'Dynatech Дэвшилтэт Тоормосны Блок & Аюулгүйн Буфер',
    oemCode: 'DYNA-PR-SAFETY',
    category: 'brake',
    categoryLabel: 'Тоормос & Аюулгүй байдал',
    brand: 'Dynatech',
    price: 1450000,
    inStock: true,
    stockCount: 6,
    deliveryDays: 'Бэлэн байгаа',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    specs: {
      'Төрөл': 'Progressive Safety Gear',
      'Тохирох рельс': 'T75, T89, T125 чиглүүлэгч',
      'Хурдны хязгаар': '0.63 - 2.5 м/с',
      'Стандарт': 'EN 81-20/50'
    },
    description: 'Тросс тасарсан эсвэл хурд хэтэрсэн үед кабин доош унахаас хамгаалж рельсэнд автоматаар зуурах аюулгүйн хамгаалалт.'
  }
];

export const INITIAL_TICKETS: ServiceTicket[] = [
  {
    id: 'DL-2026-9041',
    createdAt: '2026-09-16 11:20',
    clientType: 'СӨХ',
    contactName: 'Б. Бат-Эрдэнэ (СӨХ-ийн дарга)',
    phone: '9911-8822',
    district: 'Хан-Уул дүүрэг',
    address: '15-р хороо, Рапид Харш 21-р байр 2-р орц',
    brand: 'Hyundai Elevator',
    issueType: 'Хаалга бүрэн хаагдахгүй гацаж байна',
    urgency: 'high',
    details: '9 давхарт хаалга 3 удаа ойж нээгдээд ажиллахаа больсон. Хүн гацаагүй ч оршин суугчид явах боломжгүй.',
    status: 'Инженер гарсан',
    assignedEngineer: 'Т. Болд (Ахлах механик инженер)',
    estimatedArrival: '15 минутын дотор очно'
  },
  {
    id: 'DL-2026-9039',
    createdAt: '2026-09-16 09:10',
    clientType: 'Бизнес төв',
    contactName: 'Д. Цэцэгмаа (Менежер)',
    phone: '9905-1234',
    district: 'Сүхбаатар дүүрэг',
    address: '8-р хороо, Сити Плаза 4 давхар',
    brand: 'Mitsubishi',
    issueType: 'Урсгал тосолгоо, дуу чимээ шалгах',
    urgency: 'medium',
    details: 'Дээш явах үед бага зэрэг үрэлтийн чимээ гарч байна. 7 хоногийн урсгал шалгалт хийлгэх хүсэлттэй.',
    status: 'Оношилж байна',
    assignedEngineer: 'М. Баярсайхан (Цахилгааны инженер)',
    estimatedArrival: 'Үзлэг хийгдэж байна'
  }
];
