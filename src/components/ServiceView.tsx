import React, { useEffect, useState } from 'react';
import { submitForm, HOTLINE } from '../lib/submitForm';

/** Энэ төхөөрөмжөөс илгээсэн хүсэлтүүдийн түлхүүр */
const MY_TICKETS_KEY = 'lift.mn:my-tickets';
import { 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  PhoneCall, 
  BadgeCheck, 
  HelpCircle,
  Truck,
  Timer,
  Users,
  Building2,
  Headset,
  ClipboardCheck,
  Send,
  Package,
  Award,
} from 'lucide-react';
import { TARIFF_PLANS } from '../data/mockData';
import { ServiceTicket } from '../types';

/** Толгой хэсгийн товч үзүүлэлтүүд */
const HERO_STATS = [
  { icon: Headset, value: '24/7', label: 'Диспетчерийн жижүүр' },
  { icon: Timer, value: '15–30', label: 'Минутын доторх хариу' },
  { icon: Users, value: '20+', label: 'Мэргэшсэн инженер' },
  { icon: Building2, value: '350+', label: 'Гэрээт объект' },
] as const;

/** Дэд цэсний тодорхойлолт */
const SERVICE_TABS = [
  { id: 'request', label: 'Засварын хүсэлт илгээх', icon: FileText },
  { id: 'booking', label: 'Цаг захиалах', icon: Calendar },
  { id: 'tariffs', label: 'Засварын хөлс & Тариф', icon: BadgeCheck },
  { id: 'track', label: 'Хүсэлтийн явц шалгах', icon: Truck },
] as const;

/** Хүсэлт илгээснээс хойших дөрвөн алхам */
const SERVICE_STEPS = [
  {
    icon: Send,
    title: 'Хүсэлт бүртгүүлэх',
    text: 'Маягтыг бөглөх эсвэл утсаар залгахад дуудлага системд тикет дугаартай бүртгэгдэнэ.',
  },
  {
    icon: ClipboardCheck,
    title: 'Оношилгоо',
    text: 'Дүүрэг хариуцсан инженер очиж эвдрэлийн шалтгаан, шаардагдах сэлбэгийг тодорхойлно.',
  },
  {
    icon: Package,
    title: 'Сэлбэг, төсөв',
    text: 'Засварын хөлс, сэлбэгийн үнийн саналыг урьдчилан танилцуулж зөвшөөрөл авна.',
  },
  {
    icon: Award,
    title: 'Засвар ба баталгаа',
    text: 'Ажлыг гүйцэтгэж, тест хийсний дараа гүйцэтгэлийн акт болон баталгаат хугацаа олгоно.',
  },
] as const;

/** Яагаад DELTA LIFT-ийг сонгох вэ */
const SERVICE_TRUST = [
  {
    icon: ShieldCheck,
    title: 'Албан ёсны эрх бүхий',
    text: 'Мэргэжлийн хяналтын шаардлага хангасан, гэрчилгээтэй инженерийн баг.',
  },
  {
    icon: Package,
    title: 'Агуулахын бэлэн сэлбэг',
    text: 'Түгээмэл эвдрэлийн сэлбэгүүд агуулахад бэлэн — хүлээх хугацаа богино.',
  },
  {
    icon: BadgeCheck,
    title: 'Ил тод үнэ',
    text: 'Гүйцэтгэхээс өмнө төсөв, тарифыг бичгээр баталгаажуулна. Далд төлбөргүй.',
  },
  {
    icon: Clock,
    title: 'Баталгаат хугацаа',
    text: 'Хийсэн ажил, солиулсан сэлбэг бүрт баталгаат хугацаа олгож, давтан үзлэг хийнэ.',
  },
] as const;

interface ServiceViewProps {
  onOpenEmergency: () => void;
}

export const ServiceView: React.FC<ServiceViewProps> = ({ onOpenEmergency }) => {
  const [activeTab, setActiveTab] = useState<'request' | 'booking' | 'tariffs' | 'track'>('request');
  // Нийтийн цэс нь `sticky top-0` бөгөөд өндөр нь дэлгэцээс хамаарч өөрчлөгддөг.
  // Дэд цэс түүний доор яг наалдахын тулд өндрийг нь хэмжиж авна.
  const [navOffset, setNavOffset] = useState(0);
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header');
      setNavOffset(header instanceof HTMLElement ? header.offsetHeight : 0);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  // Энэ хөтөч дээрээс илгээсэн хүсэлтүүд. Өгөгдлийн сангийн бодлого зочинд
  // `submissions`-ыг унших эрх өгдөггүй (бусдын утасны дугаар хамгаалагдана),
  // тиймээс явцыг зөвхөн илгээсэн төхөөрөмж дээрээ хардаг.
  const [tickets, setTickets] = useState<ServiceTicket[]>(() => {
    try {
      const saved = localStorage.getItem(MY_TICKETS_KEY);
      return saved ? (JSON.parse(saved) as ServiceTicket[]) : [];
    } catch {
      return [];
    }
  });

  const rememberTicket = (ticket: ServiceTicket) => {
    const next = [ticket, ...tickets].slice(0, 20);
    setTickets(next);
    try {
      localStorage.setItem(MY_TICKETS_KEY, JSON.stringify(next));
    } catch {
      // Хувийн горимд хадгалалт хаагдсан байж болно — тоохгүй өнгөрнө
    }
  };
  
  // Service Request Form State
  const [clientType, setClientType] = useState('СӨХ');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Хан-Уул дүүрэг');
  const [address, setAddress] = useState('');
  const [brand, setBrand] = useState('OTIS');
  const [issueType, setIssueType] = useState('Хаалга гацах / Нээгдэхгүй байх');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('high');
  const [details, setDetails] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<ServiceTicket | null>(null);
  const [serviceSending, setServiceSending] = useState(false);
  const [serviceError, setServiceError] = useState('');

  // Booking Form State
  const [bookingService, setBookingService] = useState('Сар тутмын хуваарьт техникийн үйлчилгээ');
  const [bookingDate, setBookingDate] = useState('2026-09-18');
  const [bookingTime, setBookingTime] = useState('10:00 - 12:00');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Ticket Tracker State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<ServiceTicket | null>(null);
  const [searchError, setSearchError] = useState(false);

  const URGENCY_LABELS: Record<string, string> = {
    high: 'Яаралтай',
    medium: 'Хэвийн',
    low: 'Сул',
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address || !contactName) {
      setServiceError('Нэр, утас, хаяг гурвыг бүрэн бөглөнө үү.');
      return;
    }
    setServiceError('');
    setServiceSending(true);

    const result = await submitForm('service-ticket', {
      contactName,
      phone,
      summary: `${issueType} — ${district}`,
      details: {
        'Харилцагчийн төрөл': clientType,
        'Дүүрэг': district,
        'Хаяг': address,
        'Тоноглолын брэнд': brand,
        'Асуудлын төрөл': issueType,
        'Яаралтай байдал': URGENCY_LABELS[urgency] ?? urgency,
        'Нэмэлт тайлбар': details,
      },
    });

    setServiceSending(false);
    if (result.status === 'failed') {
      setServiceError(result.message);
      return;
    }

    const newTicket: ServiceTicket = {
      id: result.id,
      createdAt: new Date().toLocaleString('mn-MN'),
      clientType,
      contactName,
      phone,
      district,
      address,
      brand,
      issueType,
      urgency,
      details,
      status: 'Хүлээн авсан',
      assignedEngineer: 'Хуваарилагдаж байна...',
      estimatedArrival: urgency === 'high' ? '30 минутын дотор' : 'Өнөөдөртөө'
    };

    rememberTicket(newTicket);
    setSubmittedTicket(newTicket);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPhone) {
      setBookingError('Утасны дугаараа оруулна уу.');
      return;
    }
    setBookingError('');
    setBookingSending(true);

    const result = await submitForm('booking', {
      phone: bookingPhone,
      summary: `${bookingService} · ${bookingDate} ${bookingTime}`,
      details: {
        'Үйлчилгээний төрөл': bookingService,
        'Барилгын хаяг': bookingAddress,
        'Товлосон огноо': bookingDate,
        'Товлосон цаг': bookingTime,
      },
    });

    setBookingSending(false);
    if (result.status === 'sent') setBookingSuccess(true);
    else setBookingError(result.message);
  };

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTicketId.trim().toUpperCase();
    const found = tickets.find(t => t.id.toUpperCase() === query);
    if (found) {
      setSearchedTicket(found);
      setSearchError(false);
    } else {
      setSearchedTicket(null);
      setSearchError(true);
    }
  };

  return (
    <div id="service-view" className="w-full bg-surface-1 text-ink min-h-screen">
      
      {/* 1. Толгой хэсэг — үйлчилгээний танилцуулга ба яаралтай дуудлага */}
      <section className="relative overflow-hidden bg-surface-2 border-b border-line">
        {/* Бодит засварын ажлын дэвсгэр зураг */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: `url('/images/service_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#04101F] via-[#051329]/92 to-[#04101F]/78 pointer-events-none" />
        {/* Брэндийн гэрэлтэлт */}
        <div className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-brand/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12 items-start">

            {/* Танилцуулга */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-xs font-bold uppercase tracking-wider mb-5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Засвар · Оношилгоо · Үзлэг</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-ink mb-4">
                Лифтний засвар
                <span className="block text-brand-bright">үйлчилгээний төв</span>
              </h1>

              <p className="text-sm md:text-base text-ink-muted leading-relaxed max-w-2xl mb-7">
                Гэнэтийн эвдрэлийн дуудлага, хуваарьт үзлэг оношилгооны цаг захиалга,
                СӨХ болон байгууллагын сар бүрийн гэрээт үйлчилгээний тарифыг нэг дороос.
              </p>

              {/* Товч үзүүлэлтүүд */}
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3.5 rounded-xl bg-[#040E20]/70 border border-line backdrop-blur-[3px]"
                  >
                    <stat.icon className="w-4 h-4 text-brand-bright mb-2" />
                    <dt className="text-lg md:text-xl font-black text-ink leading-none font-mono">
                      {stat.value}
                    </dt>
                    <dd className="text-[11px] text-ink-muted mt-1.5 leading-snug">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Яаралтай дуудлагын хайрцаг */}
            <div className="relative rounded-2xl bg-[#1A0A0C]/90 border border-red-700/50 shadow-2xl shadow-red-950/50 overflow-hidden backdrop-blur-[2px]">
              <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-red-500" />
                  </span>
                  <span className="text-[11px] uppercase font-extrabold text-danger-soft tracking-[0.18em]">
                    24 цагийн диспетчер
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-red-600/25 border border-red-600/40 flex items-center justify-center text-danger-soft">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-ink leading-tight">
                    Лифтэнд хүн гацсан уу?
                  </h2>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed mb-5">
                  Хамгийн ойр яваа инженерийн багийг 15–30 минутын дотор илгээнэ.
                  Хүн гацсан тохиолдолд хаалгыг өөрсдөө онгойлгохыг бүү оролдоорой.
                </p>

                <button
                  id="service-emergency-action-btn"
                  onClick={onOpenEmergency}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/30 cursor-pointer transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Яаралтай дуудлага өгөх</span>
                </button>

                <a
                  href={`tel:+976${HOTLINE.replace('-', '')}`}
                  className="mt-3 flex items-center justify-center gap-2 text-sm font-mono font-black text-ink hover:text-danger-soft transition"
                >
                  <span>(+976) {HOTLINE}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Дэд цэс — гүйлгэх үед дээр наалддаг */}
      <div
        id="service-tabs"
        className="sticky z-30 bg-surface-1/95 backdrop-blur-md border-b border-line"
        style={{ top: navOffset }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Засварын үйлчилгээний хэсгүүд"
            className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 py-2.5"
          >
            {SERVICE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border ${
                    isActive
                      ? 'bg-brand text-white border-brand shadow-lg shadow-brand/25'
                      : 'bg-surface-2 text-ink-muted border-line hover:text-ink hover:border-line-strong'
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 2. Main Tab Contents */}
      <section className="theme-light bg-surface-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: ЗАХИАЛГЫН ХҮСЭЛТ ИЛГЭЭХ */}
        {activeTab === 'request' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-6 md:p-8 rounded-2xl bg-surface-2 border border-line shadow-2xl">
              
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-ink">
                  Лифтний Засварын Хүсэлт Илгээх Маягт
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Эвдрэл, доголдлын мэдээллийг илгээснээр манай инженерүүд дуудлагыг системд бүртгэж, шуурхай холбогдох болно.
                </p>
              </div>

              {submittedTicket ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-success border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-bright uppercase tracking-wider">
                    ТИКЕТ ДУГААР: {submittedTicket.id}
                  </span>
                  <h3 className="text-2xl font-black text-ink mt-1 mb-2">
                    Таны хүсэлт амжилттай бүртгэгдлээ!
                  </h3>
                  <p className="text-xs text-ink-muted max-w-md mx-auto mb-6 leading-relaxed">
                    Бид хүсэлтийг хүлээн авч, тухайн дүүрэг хариуцсан засварын инженерт дамжууллаа. Таны <strong className="text-brand-bright">{submittedTicket.phone}</strong> дугаарт холбогдох болно.
                  </p>

                  <div className="p-4 rounded-xl bg-surface-1 border border-line text-left text-xs max-w-md mx-auto space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Хаяг:</span>
                      <span className="text-ink font-medium">{submittedTicket.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Эвдрэлийн төрөл:</span>
                      <span className="text-brand-bright font-medium">{submittedTicket.issueType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Төлөв:</span>
                      <span className="text-success font-bold">{submittedTicket.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Очих баримжаа хугацаа:</span>
                      <span className="text-ink font-semibold">{submittedTicket.estimatedArrival}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setDetails('');
                        setAddress('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-surface-3 hover:bg-neutral-700 text-ink font-bold text-xs uppercase cursor-pointer"
                    >
                      Шинэ хүсэлт илгээх
                    </button>
                    <button
                      onClick={() => {
                        setSearchTicketId(submittedTicket.id);
                        setSearchedTicket(submittedTicket);
                        setActiveTab('track');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase cursor-pointer"
                    >
                      Явцыг шууд шалгах
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
                  
                  {/* Client Type */}
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1.5">
                      Захиалагчийн статус *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['СӨХ', 'Бизнес / Оффис', 'Түрээслэгч', 'Иргэн'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setClientType(t)}
                          className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer ${
                            clientType === t 
                              ? 'bg-brand border-brand text-white' 
                              : 'bg-surface-3 border-line text-ink-muted'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Холбоо барих хүний нэр *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Жишээ: Б. Болд (СӨХ-ийн дарга)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Утасны дугаар *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="9911-XXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink font-mono focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* District & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Дүүрэг *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      >
                        <option value="Хан-Уул дүүрэг">Хан-Уул дүүрэг</option>
                        <option value="Сүхбаатар дүүрэг">Сүхбаатар дүүрэг</option>
                        <option value="Баянзүрх дүүрэг">Баянзүрх дүүрэг</option>
                        <option value="Баянгол дүүрэг">Баянгол дүүрэг</option>
                        <option value="Чингэлтэй дүүрэг">Чингэлтэй дүүрэг</option>
                        <option value="Сонгинохайрхан дүүрэг">Сонгинохайрхан дүүрэг</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Байршил, Хотхон, Байр, Орц *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Жишээ: 15-р хороо, Рапид Харш 21-р байр 2-р орц"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Brand & Issue type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Лифтний брэнд / загвар
                      </label>
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      >
                        <option value="OTIS">OTIS Elevator</option>
                        <option value="Mitsubishi">Mitsubishi Electric</option>
                        <option value="Hyundai">Hyundai Elevator</option>
                        <option value="Sigma">Sigma / LG</option>
                        <option value="Delta">Delta Line / Бусад</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Эвдрэлийн төрөл *
                      </label>
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      >
                        <option value="Хаалга гацах / Нээгдэхгүй байх">Хаалга гацах / Нээгдэхгүй байх</option>
                        <option value="Лифт бүрэн ажиллахгүй зогссон">Лифт бүрэн ажиллахгүй зогссон</option>
                        <option value="Хөдлөх үед ердийн бус чимээ, доргио гарах">Хөдлөх үед ердийн бус чимээ, доргио гарах</option>
                        <option value="Товчлуур / Дэлгэц ажиллахгүй">Товчлуур / Дэлгэц ажиллахгүй</option>
                        <option value="Давхартайгаа зөрж зогсох">Давхартайгаа зөрж зогсох</option>
                        <option value="Урсгал засвар, тосолгоо хийлгэх">Урсгал засвар, тосолгоо хийлгэх</option>
                      </select>
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Яаралтай зэрэг
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgency('high')}
                        className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                          urgency === 'high' 
                            ? 'bg-danger border-danger text-white' 
                            : 'bg-surface-3 border-line text-ink-muted'
                        }`}
                      >
                        Яаралтай (Өнөөдөр)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('medium')}
                        className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                          urgency === 'medium' 
                            ? 'bg-brand border-brand text-white' 
                            : 'bg-surface-3 border-line text-ink-muted'
                        }`}
                      >
                        Энгийн (24 цагт)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('low')}
                        className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                          urgency === 'low' 
                            ? 'bg-brand border-brand text-white' 
                            : 'bg-surface-3 border-line text-ink-muted'
                        }`}
                      >
                        Төлөвлөгөөт үзлэг
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Эвдрэлийн дэлгэрэнгүй тайлбар
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Лифтний нөхцөл байдал, ямар код зааж байгаа эсвэл хэзээнээс эхэлснийг бичнэ үү..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                    />
                  </div>

                  {serviceError && (
                    <p role="alert" className="text-[11px] text-danger-soft leading-relaxed">
                      {serviceError}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={serviceSending}
                      className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand/30 disabled:opacity-60 disabled:cursor-wait"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>{serviceSending ? 'Илгээж байна…' : 'Засварын дуудлага / хүсэлт илгээх'}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: ЦАГ ЗАХИАЛАХ (BOOKING) */}
        {activeTab === 'booking' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-6 md:p-8 rounded-2xl bg-surface-2 border border-line shadow-2xl">
              
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-ink">
                  Үзлэг Оношилгооны Цаг Захиалах
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Урьдчилан сэргийлэх техникийн үзлэг, кабель хэмжилт, тоормос тохируулга эсвэл жилийн улсын хяналтын үзлэгт бэлтгэх инженер багийн цаг товлох.
                </p>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-success border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-2">
                    Цаг амжилттай товлогдлоо!
                  </h3>
                  <p className="text-xs text-ink-muted max-w-md mx-auto mb-6">
                    Таны сонгосон <strong className="text-brand-bright">{bookingDate}</strong> өдрийн <strong className="text-brand-bright">{bookingTime}</strong> цагт манай оношилгооны тусгай инженер томилогдлоо.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Өөр цаг захиалах
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                  
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Үйлчилгээний төрөл *
                    </label>
                    <select
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                    >
                      <option value="Сар тутмын хуваарьт техникийн үйлчилгээ">Сар тутмын хуваарьт техникийн үйлчилгээ (СӨХ гэрээ)</option>
                      <option value="1 удаагийн компьютерийн оношилгоо">1 удаагийн компьютерийн оношилгоо & алдаа тайлах</option>
                      <option value="Жилийн улсын хяналтын үзлэгт бэлтгэх">Жилийн улсын хяналтын үзлэгт бэлтгэх</option>
                      <option value="Тросс кабель, тоормосны хэмжилт шалгалт">Тросс кабель, тоормосны хэмжилт шалгалт</option>
                      <option value="Лифт шинэчлэх, модернизаци хийх үнэлгээ">Лифт шинэчлэх, модернизаци хийх үнэлгээ</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Үзлэг хийх өдөр *
                      </label>
                      <input 
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Тохиромжтой цагийн завсар *
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      >
                        <option value="09:00 - 11:00">09:00 - 11:00 (Өглөө)</option>
                        <option value="11:00 - 13:00">11:00 - 13:00 (Үдээс өмнө)</option>
                        <option value="14:00 - 16:00">14:00 - 16:00 (Үдээс хойш)</option>
                        <option value="16:00 - 18:00">16:00 - 18:00 (Орой)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Холбогдох утас *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="9911-XXXX"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink font-mono focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Барилгын хаяг, байр *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Жишээ: Сүхбаатар 1-р хороо, 5-р байр"
                        value={bookingAddress}
                        onChange={(e) => setBookingAddress(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <p role="alert" className="text-[11px] text-danger-soft leading-relaxed">
                      {bookingError}
                    </p>
                  )}

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={bookingSending}
                      className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand/30 disabled:opacity-60 disabled:cursor-wait"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{bookingSending ? 'Илгээж байна…' : 'Үзлэгийн цаг захиалгыг илгээх'}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: ЗАСВАРЫН ХӨЛС & ТАРИФ */}
        {activeTab === 'tariffs' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="text-xs font-bold text-brand-bright uppercase tracking-widest mb-2">
                ИЛ ТОД ҮНЭ ТАРИФ
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-ink tracking-tight mb-2">
                Засвар Үйлчилгээний Хөлс ба Багцууд
              </h2>
              <p className="text-xs md:text-sm text-ink-muted">
                Орон сууцны СӨХ, бизнес ба оффис цамхгуудад зориулсан шат дараалсан, уян хатан үнийн санал.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TARIFF_PLANS.map((tariff) => (
                <div 
                  key={tariff.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    tariff.popular 
                      ? 'bg-surface-2 border-2 border-accent shadow-2xl shadow-amber-500/10' 
                      : 'bg-surface-2/70 border border-line hover:border-line'
                  }`}
                >
                  <div>
                    {tariff.popular && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent text-neutral-950 font-black text-[10px] uppercase tracking-wider mb-3">
                        Эрэлт ихтэй
                      </span>
                    )}

                    <h3 className="text-base font-black text-ink mb-1">
                      {tariff.title}
                    </h3>
                    <div className="text-xs text-ink-muted mb-4">
                      {tariff.target}
                    </div>

                    <div className="p-4 rounded-xl bg-surface-1 border border-line mb-6">
                      <div className="text-2xl md:text-3xl font-black text-accent-ink font-mono">
                        {tariff.price}
                      </div>
                      <div className="text-[11px] text-ink-subtle">
                        {tariff.period}
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-ink-muted mb-6">
                      {tariff.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-bright shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setBookingService(tariff.title);
                      setActiveTab('booking');
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                      tariff.popular 
                        ? 'bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/30' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Гэрээ байгуулах / Захиалах
                  </button>
                </div>
              ))}
            </div>

            {/* Tariff Notes */}
            <div className="p-6 rounded-2xl bg-surface-2 border border-line text-xs text-ink-muted space-y-2 max-w-4xl mx-auto">
              <div className="font-bold text-ink flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-bright" />
                <span>ТАРИФЫН ТУХАЙ ТАЙЛБАР БА САНАМЖ:</span>
              </div>
              <p>
                1. СӨХ болон байгууллагатай хийсэн гэрээний хүрээнд 24/7 гацсан хүний шуурхай дуудлага үнэ төлбөргүй багтана.
              </p>
              <p>
                2. Засварын явцад шаардагдах үндсэн эд анги, сэлбэг (мотор, инвертер, кабель гэх мэт)-ийн үнэ тарифын сарын суурь хөлсөнд орохгүй ба гэрээт байгууллагууд 10-20%-ийн хөнгөлөлттэй үнээр нийлүүлүүлнэ.
              </p>
              <p>
                3. НӨАТ-ын албан ёсны цахим баримт ба акт дүгнэлтийг сар бүр олгоно.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: ХҮСЭЛТИЙН ЯВЦ ШАЛГАХ (TICKET TRACKER) */}
        {activeTab === 'track' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="p-6 md:p-8 rounded-2xl bg-surface-2 border border-line shadow-2xl">
              
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-ink">
                  Засварын Дуудлага / Тикетийн Явц Шалгах
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Та хүсэлт илгээх үед олгогдсон тикет дугаараа оруулан инженерийн одоогийн статус, байршлыг хянана уу.
                </p>
              </div>

              <form onSubmit={handleSearchTicket} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-ink-subtle" />
                  <input 
                    type="text"
                    required
                    placeholder="Жишээ: DL-2026-9041 эсвэл DL-2026-9039"
                    value={searchTicketId}
                    onChange={(e) => setSearchTicketId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-3 border border-line text-ink font-mono text-xs focus:border-brand-bright focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Шалгах
                </button>
              </form>

              {searchError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-xs text-danger-soft text-center leading-relaxed">
                  <strong>{searchTicketId}</strong> дугаар энэ төхөөрөмжөөс илгээсэн
                  хүсэлтүүдийн дунд алга байна.
                  <br />
                  Явцыг зөвхөн хүсэлтээ илгээсэн хөтчөөсөө хардаг. Өөр утас, компьютер
                  ашигласан бол <strong className="font-mono">{HOTLINE}</strong> дугаар луу
                  залгаж лавлана уу.
                </div>
              )}

              {searchedTicket && (
                <div className="p-5 rounded-xl bg-surface-1 border border-line space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-ink-muted">Тикет дугаар:</span>
                      <div className="text-lg font-mono font-black text-accent-ink">{searchedTicket.id}</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-success font-bold text-xs border border-emerald-500/30">
                      {searchedTicket.status}
                    </div>
                  </div>

                  {/* Visual Status Step Indicator */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
                    <div className="p-2 rounded bg-accent/20 border border-accent text-warn font-bold">
                      1. Хүлээн авсан
                    </div>
                    <div className={`p-2 rounded border ${
                      searchedTicket.status !== 'Хүлээн авсан' 
                        ? 'bg-brand/20 border-brand text-brand-bright font-bold' 
                        : 'bg-surface-2 border-line text-ink-subtle'
                    }`}>
                      2. Инженер гарсан
                    </div>
                    <div className={`p-2 rounded border ${
                      searchedTicket.status === 'Оношилж байна' || searchedTicket.status === 'Амжилттай шийдвэрлэсэн'
                        ? 'bg-brand/20 border-brand text-brand-bright font-bold' 
                        : 'bg-surface-2 border-line text-ink-subtle'
                    }`}>
                      3. Оношилгоо
                    </div>
                    <div className={`p-2 rounded border ${
                      searchedTicket.status === 'Амжилттай шийдвэрлэсэн'
                        ? 'bg-emerald-500/20 border-emerald-500 text-success font-bold' 
                        : 'bg-surface-2 border-line text-ink-subtle'
                    }`}>
                      4. Дууссан
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-lg bg-surface-2 border border-line">
                      <span className="text-ink-subtle block">Байршил:</span>
                      <span className="font-semibold text-ink">{searchedTicket.address}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-line">
                      <span className="text-ink-subtle block">Лифтний марк:</span>
                      <span className="font-semibold text-brand-bright">{searchedTicket.brand}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-line">
                      <span className="text-ink-subtle block">Томилогдсон инженер:</span>
                      <span className="font-semibold text-ink">{searchedTicket.assignedEngineer}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-line">
                      <span className="text-ink-subtle block">Хүлээгдэж буй хугацаа:</span>
                      <span className="font-semibold text-success">{searchedTicket.estimatedArrival}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-2 text-xs text-ink-muted">
                    <span className="text-ink-muted font-semibold block mb-1">Эвдрэлийн агуулга:</span>
                    {searchedTicket.issueType} - {searchedTicket.details}
                  </div>
                </div>
              )}

              {/* Энэ төхөөрөмжөөс илгээсэн хүсэлтүүд */}
              <div className={`mt-8 pt-6 border-t border-line ${tickets.length ? '' : 'hidden'}`}>
                <div className="text-xs font-semibold text-ink-muted mb-2">
                  Энэ төхөөрөмжөөс илгээсэн хүсэлтүүд:
                </div>
                <div className="flex flex-wrap gap-2">
                  {tickets.slice(0, 3).map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSearchTicketId(t.id);
                        setSearchedTicket(t);
                        setSearchError(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted text-xs font-mono border border-line cursor-pointer"
                    >
                      {t.id} ({t.status})
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        </div>
      </section>

      {/* 3. Үйл явц — хүсэлт илгээснээс хойш юу болох вэ */}
      <section className="theme-light bg-surface-2 border-t border-line py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-bold text-brand-bright uppercase tracking-widest mb-2">
              Ажлын урсгал
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight mb-2">
              Хүсэлт илгээснээс хойш юу болох вэ?
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Дуудлага бүрийг тикет дугаараар бүртгэж, алхам бүрийн явцыг танд мэдэгдэнэ.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative p-5 rounded-2xl bg-surface-3 border border-line hover:border-line-strong transition-colors"
              >
                {/* Алхмуудыг холбосон зураас — зөвхөн өргөн дэлгэцэд */}
                {index < SERVICE_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden lg:block absolute top-9 -right-4 w-4 border-t-2 border-dashed border-line-strong"
                  />
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/15 border border-brand/35 flex items-center justify-center text-brand-bright">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black font-mono text-brand-bright/60 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-sm font-black text-ink mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Итгэлийн баталгаа */}
      <section className="theme-light bg-surface-1 border-t border-line py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-start">
            <div>
              <div className="text-xs font-bold text-brand-bright uppercase tracking-widest mb-2">
                Яагаад DELTA LIFT?
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight mb-3">
                Найдвартай засварын түнш
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Улаанбаатар хотын орон сууц, оффис, худалдааны төвүүдийн лифт, эскалаторыг
                өдөр тутам хэвийн ажиллуулах нь бидний ажил.
              </p>

              <button
                onClick={() => {
                  setActiveTab('request');
                  // Хуудасны доод талаас дарсан тул маягт руу буцааж аваачна
                  document.getElementById('service-tabs')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-lg shadow-brand/25 cursor-pointer transition active:scale-[0.98]"
              >
                <FileText className="w-4 h-4" />
                <span>Засварын хүсэлт илгээх</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_TRUST.map((item) => (
                <li
                  key={item.title}
                  className="p-5 rounded-2xl bg-surface-2 border border-line hover:border-line-strong transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand/15 border border-brand/35 flex items-center justify-center text-brand-bright mb-3">
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-black text-ink mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};
