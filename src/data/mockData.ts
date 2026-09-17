import { ElevatorBrand, ProjectItem, PartnerItem, TariffItem, SparePart, ServiceTicket } from '../types';

export const ELEVATOR_BRANDS: ElevatorBrand[] = [
  {
    id: 'otis',
    name: 'OTIS Elevator (АНУ)',
    origin: 'АНУ / Солонгос',
    logoText: 'OTIS',
    category: 'Зорчигч & Өндөр хурдны лифт',
    description: 'Дэлхийн лифт үйлдвэрлэлийн анхдагч, Gen2 хавтгай полиуретан бүстэй, эрчим хүчний 75% хүртэл хэмнэлттэй дэвшилтэт лифт.',
    highlight: 'Gen2® ReGen эрчим хүчний хэмнэлт',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    specs: {
      maxCapacity: '450 - 2500 кг (6 - 33 хүн)',
      speed: '1.0 - 6.0 м/с',
      floors: '60 давхар хүртэл',
      tech: 'Machine Room-Less (MRL) / Flat Belt'
    }
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi Electric (Япон)',
    origin: 'Япон',
    logoText: 'MITSUBISHI',
    category: 'Тансаг зэрэглэлийн панорама & зорчигчийн лифт',
    description: 'Японы нарийн инженерчлэл, хамгийн чимээгүй зөөлөн хөдөлгөөн (PM gearless motor), аюулгүй ажиллагааны №1 үзүүлэлт.',
    highlight: 'Шуугиангүй PM хөдөлгүүр & Смарт зохицуулалт',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    specs: {
      maxCapacity: '630 - 2000 кг (8 - 26 хүн)',
      speed: '1.0 - 4.0 м/с',
      floors: '50 давхар хүртэл',
      tech: 'Permanent Magnet Synchronous Motor'
    }
  },
  {
    id: 'hyundai',
    name: 'Hyundai Elevator (Солонгос)',
    origin: 'БНСУ',
    logoText: 'HYUNDAI',
    category: 'Орчин үеийн орон сууц, бизнес цогцолбор',
    description: 'Монголын цаг уурын онцлогт бүрэн нийцсэн, ухаалаг IoT хяналтын системтэй, өндөр бүтээмжит Солонгос технологи.',
    highlight: 'IoT Smart Control & Хүйтэнд тэсвэртэй эд анги',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    specs: {
      maxCapacity: '450 - 1600 кг',
      speed: '1.0 - 2.5 м/с',
      floors: '40 давхар хүртэл',
      tech: 'Eco-drive инвертер хяналт'
    }
  },
  {
    id: 'delta-line',
    name: 'DELTA Line Pro (Герман технологи)',
    origin: 'Герман / Ази',
    logoText: 'DELTA PRO',
    category: 'Ачаа, эмнэлэг, автомашины хүнд даацын лифт',
    description: 'Үйлдвэр, эмнэлгийн ор, автомашины зориулалттай тусгай бэхэлгээт төмөр рам, хүчитгэсэн шал, найдвартай ажиллагаа.',
    highlight: 'Үйлдвэрийн тэсвэржилт & Хүнд даац',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    specs: {
      maxCapacity: '1000 - 5000 кг',
      speed: '0.5 - 1.75 м/с',
      floors: '30 давхар хүртэл',
      tech: 'Heavy Duty Hydraulic & Traction'
    }
  },
  {
    id: 'escalators',
    name: 'DELTA Flow Escalators & Moving Walks',
    origin: 'Олон улсын хамтарсан',
    logoText: 'DELTA FLOW',
    category: 'Эскалатор ба Урсдаг зам',
    description: 'Худалдааны төв, нисэх буудал, төмөр замын вокзалын их ачаалалд зориулсан эрчим хүчний хэмнэлттэй ухаалаг эскалатор.',
    highlight: 'Автомат зогсолт & Гэрлэн мэдрэгч',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    specs: {
      maxCapacity: '9,000 хүн/цаг',
      speed: '0.5 - 0.65 м/с',
      floors: 'Налуу 30° / 35°',
      tech: 'Smart VVVF Inverter Eco-Mode'
    }
  }
];

export const COMPLETED_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Шангри-Ла Цогцолбор 2-р ээлж',
    client: 'Шангри-Ла Улаанбаатар ХХК',
    location: 'Сүхбаатар дүүрэг, 1-р хороо',
    year: '2024',
    category: 'commercial',
    categoryLabel: 'Бизнес & Зочид буудал',
    elevatorsInstalled: '8 ширхэг өндөр хурдны зорчигчийн лифт, 2 ширхэг панорама шилэн лифт',
    brand: 'OTIS SkyRise 3.5 м/с',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Тусгай VIP картын хяналтын систем, зорчигч урьдчилан хуваарилах CompassPlus алгоритмаар тоноглосон төсөл.'
  },
  {
    id: 'proj-2',
    title: 'Bella Vista Luxury Residence',
    client: 'Бодь Пропертиз ХХК',
    location: 'Хан-Уул дүүрэг, Зайсан',
    year: '2023',
    category: 'residential',
    categoryLabel: 'Тансаг орон сууц',
    elevatorsInstalled: '12 ширхэг чимээгүй MRL зорчигчийн лифт',
    brand: 'Mitsubishi Electric NEXIEZ',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Дээд зэргийн тохижилт, гантиг болон алтлаг сатин ган хийц, чичиргээ дарагчтай зөөлөн хөдөлгөөн.'
  },
  {
    id: 'proj-3',
    title: 'Central Tower & Business Center Их засвар',
    client: 'Сентрал Тауэр Эссет Менежмент',
    location: 'Сүхбаатар талбай',
    year: '2023',
    category: 'commercial',
    categoryLabel: 'Оффис цамхаг',
    elevatorsInstalled: '6 ширхэг лифтний автоматжуулалт ба инвертер шинэчлэл',
    brand: 'Monarch NICE3000+ шинэчлэл',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    description: 'Эрчим хүчний 40% хэмнэлт гаргасан удирдлагын хяналтын самбар болон кабель шинэчлэлийн цогц төсөл.'
  },
  {
    id: 'proj-4',
    title: 'Номин Их Дэлгүүрийн Эскалаторын Парк',
    client: 'Номин Холдинг ХХК',
    location: 'Чингэлтэй дүүрэг, Энхтайваны өргөн чөлөө',
    year: '2024',
    category: 'commercial',
    categoryLabel: 'Худалдааны төв',
    elevatorsInstalled: '10 ширхэг хүнд ачааллын олон нийтийн эскалатор',
    brand: 'DELTA Flow Heavy-Duty 30°',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    description: 'Өдөрт 45,000+ хүн үйлчлүүлэх өндөр ачааллыг даах аюулгүй байдлын 24 түвшний хамгаалалт бүхий эскалатор.'
  },
  {
    id: 'proj-5',
    title: 'Хан-Уул Нэгдсэн Эмнэлгийн Төсөл',
    client: 'Улсын хөрөнгө оруулалт',
    location: 'Хан-Уул дүүрэг',
    year: '2022',
    category: 'public',
    categoryLabel: 'Эрүүл мэндийн байгууллага',
    elevatorsInstalled: '4 ширхэг орны лифт (Bed elevator), 2 ширхэг түргэн тусламжийн лифт',
    brand: 'Hyundai Hospital Bed Line',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    description: 'Эмнэлгийн ор болон тэргэнцэрт тохирсон өргөн хаалга, бактерийн эсрэг ионжуулагчтай агааржуулагч.'
  },
  {
    id: 'proj-6',
    title: 'Encanto Tower & Sports Complex',
    client: 'Камдер ХХК',
    location: 'Баянзүрх дүүрэг, 26-р хороо',
    year: '2023',
    category: 'residential',
    categoryLabel: 'Орон сууц & Спорт комплекс',
    elevatorsInstalled: '6 ширхэг зорчигчийн лифт, 1 автомашины лифт',
    brand: 'Sigma Iris NV',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
    description: '3,000 кг даацтай автомашины газар доорх зогсоолын лифт болон хурдан зорчигчийн лифтүүд.'
  }
];

export const PARTNERS: PartnerItem[] = [
  {
    id: 'partner-1',
    name: 'Номин Холдинг',
    type: 'Худалдаа, Үйлчилгээний групп',
    logo: 'NOMIN',
    description: 'Их дэлгүүр болон салбар сүлжээ супермаркетуудын лифт эскалаторын нийлүүлэлт, 24/7 гэрээт үйлчилгээний түнш.'
  },
  {
    id: 'partner-2',
    name: 'Макс Групп',
    type: 'Барилга, Үл хөдлөх хөгжүүлэлт',
    logo: 'MAX GROUP',
    description: 'Орон сууцны хотхонууд болон оффис барилгуудын лифт суурилуулалтын албан ёсны хамтрагч.'
  },
  {
    id: 'partner-3',
    name: 'Заг Констракшн',
    type: 'Ерөнхий гүйцэтгэгч',
    logo: 'ZAG',
    description: 'Томоохон хотхон, сургууль, соёлын барилгын лифт тоног төхөөрөмжийн нийлүүлэгч.'
  },
  {
    id: 'partner-4',
    name: 'Монкон Констракшн',
    type: 'Тэргүүлэгч девелопер',
    logo: 'MONCON',
    description: 'Мандала хотхон, Комфорт төслүүдэд Delta Lift-ийн өндөр хурдны ухаалаг лифтүүдийг сонгон суурилуулсан.'
  },
  {
    id: 'partner-5',
    name: 'Жигүүр Гранд Групп',
    type: 'Их бүтээн байгуулалт',
    logo: 'JIGUUR GRAND',
    description: 'Тансаг зэрэглэлийн барилга төслүүдийн панорама шилэн лифт, хотхоны засвар үйлчилгээний түнш.'
  },
  {
    id: 'partner-6',
    name: 'OTIS & Mitsubishi Global Partners',
    type: 'Олон улсын үйлдвэрлэгчид',
    logo: 'GLOBAL TECH',
    description: 'Монгол дахь албан ёсны борлуулалт, инженер техникийн сургалт, ориг сэлбэгийн шууд хангамж.'
  }
];

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
