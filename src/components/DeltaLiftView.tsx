import React, { useEffect, useState } from 'react';
import { submitForm } from '../lib/submitForm';

/** Сонголтын утгыг админд ойлгомжтой нэр болгоно */
const QUOTE_TYPE_LABELS: Record<string, string> = {
  passenger: 'Зорчигчийн',
  freight: 'Ачааны',
  hospital: 'Эмнэлгийн',
  home: 'Хаусны',
  food: 'Хоолны',
  escalator: 'Урсдаг шат',
};
import {
  Accessibility,
  ArrowUpRight,
  Award,
  Building2,
  Car,
  CheckCircle,
  ClipboardCheck,
  Globe,
  Mail,
  MapPin,
  MoveHorizontal,
  MoveVertical,
  PenTool,
  PhoneCall,
  Ruler,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  XCircle,
} from 'lucide-react';
import {
  COMPANY,
  ENGINEERING,
  HOW_WE_WORK,
  KEY_FACTS,
  KLEEMANN,
  OPERATING_PANELS,
  PHOTOS,
  PRODUCTS,
  PROJECT_GROUPS,
  SERVICE_SCOPE,
} from '../data/deltaData';
import { DeltaLiftsLogo } from './DeltaLiftsLogo';
import { Reveal } from './Reveal';
import { CountUp } from './CountUp';
import { ImageSlider } from './ImageSlider';
import { CabinOptions } from './CabinOptions';
import { useInView } from '../lib/useReveal';

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  elevator: MoveVertical,
  escalator: TrendingUp,
  walkway: MoveHorizontal,
  parking: Car,
  accessibility: Accessibility,
};

const STEP_ICONS = [PenTool, ClipboardCheck, Ruler, Wrench];

/** Гүйлгэхэд дээр наалддаг хэсгийн цэс */
const SECTION_NAV = [
  { id: 'kleemann', label: 'KLEEMANN' },
  { id: 'products', label: 'Бүтээгдэхүүн' },
  { id: 'options', label: 'Сонголтууд' },
  { id: 'engineering', label: 'Инженер' },
  { id: 'projects', label: 'Төслүүд' },
  { id: 'quote-section', label: 'Үнийн санал' },
] as const;

/** Хэсгийн дээд талын жижиг гарчиг */
const SectionLabel: React.FC<{ icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }> = ({
  icon: Icon,
  children,
}) => (
  <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-[11px] font-bold uppercase tracking-wider">
    <Icon className="w-3.5 h-3.5" />
    <span>{children}</span>
  </div>
);

export const DeltaLiftView: React.FC = () => {
  const [quoteFloors, setQuoteFloors] = useState<number>(12);
  const [quoteType, setQuoteType] = useState<string>('passenger');
  const [quoteCapacity, setQuoteCapacity] = useState<string>('1000kg');
  const [quotePhone, setQuotePhone] = useState<string>('');
  const [quoteError, setQuoteError] = useState<string>('');
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const [quoteSending, setQuoteSending] = useState<boolean>(false);
  /** "Сонголтууд" хэсгээс сонгосон бүхээг, хаалганы загвар */
  const [quoteCabin, setQuoteCabin] = useState<string>('');

  /**
   * Каталогийн загвар сонгоход үнийн саналын маягт руу аваачна.
   * Сонгосон загварын нэр маягтад урьдчилан бөглөгдөж, хүсэлттэй хамт очно.
   */
  const pickCabin = (label: string) => {
    setQuoteCabin(label);
    setQuoteSuccess(false);
    document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Цахилгаан шат нь дэд төрлүүдтэй тул тусад нь онцолно. Авто зогсоолын
  // системийг доор зурагтай картаар үзүүлдэг тул жагсаалтаас хасна.
  const featuredProduct = PRODUCTS.find((p) => p.id === 'elevator');
  const otherProducts = PRODUCTS.filter((p) => p.id !== 'elevator' && p.id !== 'parking');

  // Ажлын алхмуудыг холбосон шугам болон картуудыг нэг дор эхлүүлнэ
  const [stepsRef, stepsIn] = useInView<HTMLOListElement>();

  // Нийтийн цэс нь sticky бөгөөд өндөр нь дэлгэцээс хамаарна. Хэсгийн цэс
  // түүний доор яг наалдахын тулд өндрийг нь хэмжиж авна.
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

  // Аль хэсэг дээр байгааг цэсэнд тодруулна
  const [activeSection, setActiveSection] = useState<string>('');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    for (const s of SECTION_NAV) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotePhone.trim()) {
      setQuoteError('Утасны дугаараа оруулна уу.');
      return;
    }
    setQuoteError('');
    setQuoteSending(true);

    const result = await submitForm('quote', {
      phone: quotePhone,
      summary: [
        QUOTE_TYPE_LABELS[quoteType] ?? quoteType,
        `${quoteFloors} давхар`,
        quoteCapacity,
        quoteCabin,
      ].filter(Boolean).join(' · '),
      details: {
        'Төрөл': QUOTE_TYPE_LABELS[quoteType] ?? quoteType,
        'Давхрын тоо': quoteFloors,
        'Даац': quoteCapacity,
        ...(quoteCabin ? { 'Сонгосон загвар': quoteCabin } : {}),
      },
    });

    setQuoteSending(false);
    if (result.status === 'sent') setQuoteSuccess(true);
    else setQuoteError(result.message);
  };

  return (
    <div id="delta-lift-view" className="w-full bg-surface-1 text-ink">

      {/* 1. Толгой хэсэг */}
      <section className="relative overflow-hidden border-b border-line bg-surface-1">
        {/* Дэвсгэр зураг маш удаанаар томорно */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={PHOTOS.techShaft}
            alt=""
            aria-hidden="true"
            className="dl-ken-burns w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#051329]/85 via-[#051329]/92 to-[#051329]" />

        {/* Хөвж буй өнгөт толбууд */}
        <div
          aria-hidden
          className="dl-drift absolute -top-28 -left-24 w-[30rem] h-[30rem] rounded-full bg-brand/25 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="dl-drift-slow absolute -bottom-40 right-[-8rem] w-[26rem] h-[26rem] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        />
        {/* Нарийн тор */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #7DD3FC 1px, transparent 1px), linear-gradient(to bottom, #7DD3FC 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">

            <Reveal>
              <SectionLabel icon={Award}>Албан ёсны онцгой эрхт дистрибьютер</SectionLabel>

              <p className="mt-5 text-sm font-bold text-accent-ink tracking-wide">
                {COMPANY.tagline}
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink leading-[1.1]">
                {COMPANY.legalName}
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-bold text-brand-bright">
                {COMPANY.role}
              </p>

              <p className="mt-5 text-sm sm:text-[15px] text-ink-muted leading-relaxed max-w-2xl">
                {COMPANY.intro}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Бүтээгдэхүүн үзэх
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-ink font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Хэрэгжүүлсэн төслүүд
                </a>
                <a
                  href="#quote-section"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Үнийн санал авах
                </a>
              </div>
            </Reveal>

            {/* Брэндийн лого карт */}
            <Reveal delay={120} className="space-y-4">
              <div className="dl-sheen relative overflow-hidden rounded-2xl bg-white p-8 sm:p-12 shadow-2xl shadow-black/40">
                <DeltaLiftsLogo size="custom" iconClassName="w-full h-auto" />
              </div>
              <img
                src={PHOTOS.kleemannLockup}
                alt={`KLEEMANN ${KLEEMANN.years} YEARS — ${KLEEMANN.slogan}`}
                className="w-full rounded-2xl border border-white/10"
              />
            </Reveal>

          </div>
        </div>
      </section>

      {/* Хэсгийн цэс — гүйлгэхэд нийтийн цэсний доор наалдана */}
      <nav
        id="delta-section-nav"
        aria-label="Танилцуулгын хэсгүүд"
        className="sticky z-30 bg-surface-1/95 backdrop-blur-md border-b border-line"
        style={{ top: navOffset }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 py-3">
            {SECTION_NAV.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`shrink-0 inline-flex items-center h-11 px-5 rounded-xl text-sm font-bold whitespace-nowrap border transition-colors ${
                    isActive
                      ? 'bg-brand text-white border-brand shadow-lg shadow-brand/25'
                      : 'bg-surface-2 text-ink-muted border-line hover:text-ink hover:border-line-strong'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. Гол үзүүлэлтүүд */}
      <section className="theme-light border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-line">
            {KEY_FACTS.map((f, i) => (
              <Reveal key={f.label} delay={i * 90} className="py-7 px-4 sm:px-6 text-center">
                <dt className="text-3xl sm:text-4xl font-black text-accent-ink tabular-nums">
                  <CountUp value={f.value} />
                </dt>
                <dd className="mt-1.5 text-[11px] sm:text-xs text-ink-muted leading-snug">{f.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. KLEEMANN брэнд */}
      <section id="kleemann" style={{ scrollMarginTop: navOffset + 64 }} className="theme-light py-16 md:py-20 border-b border-line bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-14 items-stretch">

            <Reveal>
              <SectionLabel icon={Globe}>Үйлдвэрлэгч</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
                KLEEMANN
              </h2>
              <p className="mt-1.5 text-sm font-bold text-accent-ink uppercase tracking-wider">
                {KLEEMANN.slogan}
              </p>

              <p className="mt-5 text-sm text-ink-muted leading-relaxed">{KLEEMANN.overview}</p>
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">{KLEEMANN.standard}</p>

              <div className="mt-6 p-5 rounded-xl bg-brand/10 border-l-2 border-accent">
                <p className="text-sm text-ink leading-relaxed">{KLEEMANN.innovation}</p>
              </div>
            </Reveal>

            <Reveal delay={120} className="h-full">
              <ImageSlider
                images={[
                  {
                    src: PHOTOS.cabin,
                    alt: 'KLEEMANN лифтний бүхээгний дотоод засал',
                    caption: 'Далд гэрэлтүүлэгтэй бүхээгний дотоод засал',
                  },
                  {
                    src: PHOTOS.glassLift,
                    alt: 'Тунгалаг бүхээгтэй дугуй панорама лифт',
                    caption: 'Муруй буюу вааран хэлбэрийн панорама бүхээг',
                  },
                  {
                    src: PHOTOS.panel,
                    alt: 'KLEEMANN-ы шинэ удирдлагын хавтан',
                    caption: 'Шинэ үеийн удирдлагын хавтан',
                  },
                ]}
              />
            </Reveal>

          </div>

          {/* KLEEMANN-ы дэлхийн сүлжээ */}
          <Reveal as="figure" className="mt-10 rounded-2xl overflow-hidden border border-line bg-[#0B5EA8]">
            <div className="relative">
              <img
                src={PHOTOS.worldMap}
                alt="KLEEMANN 100 гаруй улсад салбар компани, борлуулалтын сүлжээтэй"
                className="w-full"
                loading="lazy"
              />
              {/* Монгол дээрх цэгийг тодруулж цохиулна — газрын зураг дээр
                  Улаанбаатарын цэг аль хэдийн байгаа тул зөвхөн цагирагыг нэмнэ */}
              <span
                aria-hidden
                className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] pointer-events-none"
                style={{ left: '82.2%', top: '42.3%' }}
              >
                <span className="dl-ping absolute inset-0 rounded-full bg-accent" />
              </span>
            </div>
            <figcaption className="px-5 py-3.5 text-[11px] sm:text-xs text-white/80 border-t border-white/10">
              KLEEMANN-ы бүтээгдэхүүн Ази, Европ, Австрали, АНУ зэрэг 100 гаруй улсад хүрдэг.
              <span className="text-accent font-semibold"> Монгол дахь албан ёсны онцгой эрхт дистрибьютер нь DELTA LIFTS.</span>
            </figcaption>
          </Reveal>

          {/* Шинэ удирдлагын хавтан */}
          <Reveal className="mt-10 grid grid-cols-1 sm:grid-cols-[0.55fr_1fr] gap-6 items-stretch p-5 sm:p-6 rounded-2xl bg-surface-2 border border-line">
            <ImageSlider
              images={[
                {
                  src: PHOTOS.panel,
                  alt: 'KLEEMANN-ы шинэ удирдлагын хавтан, бараан шилэн бүхээг',
                },
              ]}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                {OPERATING_PANELS.title}
              </h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-accent-ink">
                {OPERATING_PANELS.subtitle}
              </p>
              <ul className="mt-4 space-y-2">
                {OPERATING_PANELS.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <Sparkles className="w-3.5 h-3.5 mt-1 text-brand-bright shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

        </div>
      </section>

      {/* 4. Бүтээгдэхүүн */}
      <section id="products" style={{ scrollMarginTop: navOffset + 64 }} className="py-16 md:py-20 border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel icon={Building2}>Бүтээгдэхүүн</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
            Бидний нийлүүлдэг төхөөрөмж
          </h2>

          {/* Цахилгаан шат нь дэд төрлүүдтэй тул бүтэн мөр эзэлнэ. Авто зогсоол
              доороо зурагтай онцлох карттай учир жагсаалтад давхардуулахгүй. */}
          {featuredProduct && (
            <Reveal className="group mt-9 relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface-3 via-surface-3 to-brand/15 p-6 sm:p-8 hover:border-brand transition-colors duration-300">
              <div
                aria-hidden
                className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-brand/15 blur-3xl pointer-events-none"
              />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MoveVertical className="w-6 h-6 text-brand-bright" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                    {featuredProduct.title}
                  </h3>
                  {featuredProduct.variants && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {featuredProduct.variants.map((v) => (
                        <span
                          key={v}
                          className="inline-flex items-center h-8 px-3 rounded-lg bg-brand/15 border border-brand/30 text-xs font-semibold text-ink"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherProducts.map((p, i) => {
              const Icon = PRODUCT_ICONS[p.id] ?? Building2;
              return (
                <Reveal
                  key={p.id}
                  delay={i * 90}
                  className="group flex h-full flex-col p-6 rounded-xl bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center group-hover:bg-brand/30 group-hover:scale-110 transition-[background-color,scale] duration-300">
                    <Icon className="w-5 h-5 text-brand-bright" />
                  </div>
                  {/* Гарчгийг доод ирмэг рүү нь түлхэнэ — өөр өөр урттай нэрстэй
                      картууд ижил өндөртэй үед доод тал нь хоосон харагдахгүй */}
                  <div className="mt-auto pt-5 sm:pt-8">
                    <h3 className="text-base font-bold text-ink leading-snug">{p.title}</h3>
                    {p.note && <p className="mt-2 text-xs text-brand-bright">{p.note}</p>}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Бүрэн автомат авто зогсоолын систем */}
          <Reveal className="dl-sheen relative mt-6 grid grid-cols-1 sm:grid-cols-[1fr_0.9fr] items-stretch rounded-2xl bg-surface-3 border border-line overflow-hidden">
            <div className="p-6 sm:p-8 order-2 sm:order-1">
              <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-accent/15 border border-accent/40 text-accent-ink text-[11px] font-bold uppercase tracking-wider">
                <Car className="w-3.5 h-3.5" />
                <span>Онцлох шийдэл</span>
              </div>
              <h3 className="mt-4 text-lg sm:text-xl font-black text-ink tracking-tight leading-snug">
                Бүрэн автомат авто машины давхар зогсоолын систем
              </h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Талбайн хэмжээгээ хоёр дахин үр ашигтай ашиглах KLEEMANN-ы автомат зогсоолын
                систем. Орон сууц, оффис, худалдааны төвийн зогсоолын хүрэлцээг нэмэгдүүлнэ.
              </p>
            </div>
            <div className="order-1 sm:order-2 bg-white flex items-center justify-center min-h-56">
              <img
                src={PHOTOS.parking}
                alt="Бүрэн автомат авто машины давхар зогсоолын систем"
                className="w-full h-full max-h-80 object-contain p-4"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. KLEEMANN-ы каталогийн сонголтууд */}
      <section
        id="options"
        style={{ scrollMarginTop: navOffset + 64 }}
        className="py-16 md:py-20 border-b border-line bg-surface-1"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CabinOptions onRequestQuote={pickCabin} />
        </div>
      </section>

      {/* 6. Инженер, техникийн алба */}
      <section id="engineering" style={{ scrollMarginTop: navOffset + 64 }} className="theme-light py-16 md:py-20 border-b border-line bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">

            <Reveal className="order-2 lg:order-1 h-full">
              <ImageSlider
                images={[
                  {
                    src: PHOTOS.techDoor,
                    alt: 'KLEEMANN-ы инженер хаалганы угсралт дээр ажиллаж байна',
                    caption: 'Хаалганы механизмын угсралт, тохируулга',
                  },
                  {
                    src: PHOTOS.techControl,
                    alt: 'Удирдлагын самбар дээрх техникчид',
                    caption: 'Удирдлагын самбарын оношилгоо',
                  },
                  {
                    src: PHOTOS.techShaft,
                    alt: 'Лифтний худаг дотор ажиллаж буй техникч',
                    caption: 'Худаг доторх хөтөчийн шугамын ажил',
                  },
                ]}
              />
            </Reveal>

            <Reveal delay={120} className="order-1 lg:order-2">
              <SectionLabel icon={Wrench}>Хүний нөөц</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
                {ENGINEERING.title}
              </h2>
              <p className="mt-5 text-sm text-ink-muted leading-relaxed">{ENGINEERING.body}</p>

              <div className="mt-7 grid grid-cols-2 gap-4">
                {ENGINEERING.highlights.map((h) => (
                  <div key={h.label} className="p-5 rounded-xl bg-surface-3 border border-line">
                    <div className="text-3xl font-black text-accent-ink tabular-nums">
                      <CountUp value={h.value} />
                    </div>
                    <div className="mt-1 text-[11px] text-ink-muted leading-snug">{h.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* 6. Бид хэрхэн ажилладаг */}
      <section id="how-we-work" style={{ scrollMarginTop: navOffset + 64 }} className="theme-light py-16 md:py-20 border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-stretch">

            <Reveal className="h-full">
              <ImageSlider
                images={[
                  {
                    src: PHOTOS.consult,
                    alt: 'Зураг төслийн шийдэл дээр ажиллаж буй инженерүүд',
                    caption: 'Талбай дээрх хэмжилт, техникийн зөвлөгөө',
                  },
                  {
                    src: PHOTOS.techDoor,
                    alt: 'Угсралтын ажил дээрх инженер',
                    caption: 'Угсралт, суурилуулалтын хяналт',
                  },
                ]}
              />
            </Reveal>

            <Reveal delay={120}>
              <SectionLabel icon={ClipboardCheck}>Ажиллах журам</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
                {HOW_WE_WORK.title}
              </h2>
              <p className="mt-5 text-sm text-ink-muted leading-relaxed">{HOW_WE_WORK.body}</p>

              <ol ref={stepsRef} className="relative mt-7 space-y-3 pl-1">
                {/* Алхмуудыг холбосон шугам — харагдахад дээрээс доош татагдана */}
                <span
                  aria-hidden
                  className={`dl-track ${stepsIn ? 'is-in' : ''} absolute left-[38px] top-6 bottom-6 w-px bg-gradient-to-b from-brand via-brand/50 to-transparent`}
                />
                {HOW_WE_WORK.steps.map((s, i) => {
                  const Icon = STEP_ICONS[i] ?? ClipboardCheck;
                  return (
                    <li
                      key={s.title}
                      className={`reveal ${stepsIn ? 'is-in' : ''} relative flex gap-4 p-4 rounded-xl bg-surface-3 border border-line hover:border-brand transition-colors`}
                      style={{ transitionDelay: `${i * 110}ms` }}
                    >
                      <div className="relative z-10 w-9 h-9 shrink-0 rounded-lg bg-brand/20 border border-brand/40 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-brand-bright" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-ink">
                          <span className="text-accent-ink tabular-nums mr-1.5">{i + 1}.</span>
                          {s.title}
                        </h3>
                        <p className="mt-1 text-xs text-ink-muted leading-relaxed">{s.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Reveal>

          </div>
        </div>
      </section>

      {/* 7. Засвар үйлчилгээний хамрах хүрээ */}
      <section id="service-scope" style={{ scrollMarginTop: navOffset + 64 }} className="py-16 md:py-20 border-b border-line bg-surface-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionLabel icon={ShieldCheck}>Засвар үйлчилгээ</SectionLabel>
            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
              Хамрах хүрээ
            </h2>
            <p className="mt-5 text-sm text-ink-muted leading-relaxed">
              Мэргэшсэн инженер, техникийн баг цахилгаан шат, урсдаг шатны техникийн бүрэн бүтэн
              байдал, хэвийн үйл ажиллагааг хангах дараах үйлчилгээг үзүүлэн ажилладаг.
            </p>
          </Reveal>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SERVICE_SCOPE.map((s, i) => (
              <Reveal
                key={s}
                as="li"
                delay={i * 80}
                className="flex items-start gap-3 p-5 rounded-xl bg-surface-3 border border-line hover:border-brand hover:-translate-y-0.5 transition-[border-color,translate] duration-300"
              >
                <CheckCircle className="w-4 h-4 mt-0.5 text-brand-bright shrink-0" />
                <span className="text-sm text-ink leading-relaxed">{s}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Хамтран ажилласан төслүүд */}
      <section id="projects" style={{ scrollMarginTop: navOffset + 64 }} className="py-16 md:py-20 border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel icon={Building2}>Туршлага</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
            Хамтран ажилласан онцлох төслүүд
          </h2>

          <div className="mt-9 space-y-8">
            {PROJECT_GROUPS.map((g) => (
              <div key={g.id}>
                <div className="flex items-center gap-2.5 mb-4">
                  <MapPin className="w-4 h-4 text-brand-bright shrink-0" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-ink">{g.title}</h3>
                  <span className="text-[11px] text-ink-subtle tabular-nums">({g.items.length})</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {g.items.map((name, i) => (
                    <Reveal
                      key={name}
                      as="li"
                      delay={(i % 3) * 90}
                      className="group p-4 sm:p-5 rounded-xl bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300 flex items-center gap-3 min-h-20"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-bright/50 group-hover:bg-accent group-hover:scale-150 transition-[background-color,scale] duration-300 shrink-0" />
                      <span className="text-sm font-bold text-ink leading-snug">{name}</span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Үнийн санал */}
      <section id="quote-section" style={{ scrollMarginTop: navOffset + 64 }} className="theme-light py-16 md:py-20 border-b border-line bg-surface-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="relative p-7 sm:p-9 rounded-2xl bg-surface-3 border border-accent/40 shadow-2xl shadow-accent/5">

            <div className="text-center max-w-lg mx-auto mb-8">
              <SectionLabel icon={Sparkles}>Шуурхай үнийн санал</SectionLabel>
              <h2 className="mt-4 text-2xl md:text-3xl font-black text-ink tracking-tight">
                Урьдчилсан тооцоо авах
              </h2>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                Барилгынхаа үзүүлэлтийг сонгон үлдээвэл манай төслийн инженер тантай холбогдож,
                техникийн үзүүлэлт болон албан ёсны үнийн саналыг илгээнэ.
              </p>
            </div>

            {quoteCabin && !quoteSuccess && (
              <div
                id="quote-cabin"
                className="mb-5 flex items-start justify-between gap-3 p-4 rounded-xl bg-brand/10 border border-brand/40"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand-bright">
                    Сонгосон загвар
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-ink leading-snug">{quoteCabin}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuoteCabin('')}
                  aria-label="Сонгосон загварыг арилгах"
                  className="p-1.5 rounded-lg hover:bg-surface-2 text-ink-muted cursor-pointer shrink-0"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}

            {quoteSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-success mx-auto mb-3" />
                <h3 className="text-xl font-bold text-ink mb-2">Хүсэлт хүлээн авлаа</h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto mb-6">
                  Манай төслийн инженер таны{' '}
                  <strong className="text-accent-ink">{quotePhone}</strong> дугаар луу удахгүй
                  холбогдоно.
                  {quoteCabin && (
                    <>
                      {' '}Сонгосон загвар:{' '}
                      <strong className="text-accent-ink">{quoteCabin}</strong>.
                    </>
                  )}
                </p>
                <button
                  onClick={() => setQuoteSuccess(false)}
                  className="h-10 px-5 rounded-xl bg-accent text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Дахин тооцоолох
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <label className="block">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Төрөл
                    </span>
                    <select
                      value={quoteType}
                      onChange={(e) => setQuoteType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-ink text-xs focus:border-brand-bright focus:outline-none"
                    >
                      <option value="passenger">Зорчигчийн</option>
                      <option value="freight">Ачааны</option>
                      <option value="hospital">Эмнэлгийн</option>
                      <option value="home">Хаусны</option>
                      <option value="food">Хоолны</option>
                      <option value="escalator">Урсдаг шат</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Давхрын тоо
                    </span>
                    <input
                      type="number"
                      min={2}
                      max={60}
                      value={quoteFloors}
                      onChange={(e) => setQuoteFloors(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-ink text-xs focus:border-brand-bright focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Даац
                    </span>
                    <select
                      value={quoteCapacity}
                      onChange={(e) => setQuoteCapacity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-ink text-xs focus:border-brand-bright focus:outline-none"
                    >
                      <option value="450kg">450 кг</option>
                      <option value="630kg">630 кг</option>
                      <option value="1000kg">1000 кг</option>
                      <option value="1600kg">1600 кг</option>
                      <option value="2000kg">2000 кг</option>
                    </select>
                  </label>

                </div>

                <label className="block">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                    Холбоо барих утас
                  </span>
                  <input
                    type="tel"
                    value={quotePhone}
                    onChange={(e) => {
                      setQuotePhone(e.target.value);
                      if (quoteError) setQuoteError('');
                    }}
                    placeholder="9911-XXXX"
                    aria-invalid={Boolean(quoteError)}
                    className={`w-full h-11 px-3 rounded-xl bg-surface-2 border text-ink text-xs font-mono placeholder:text-ink-subtle focus:outline-none ${
                      quoteError ? 'border-red-500' : 'border-line focus:border-brand-bright'
                    }`}
                  />
                  {quoteError && <span className="mt-1.5 block text-[11px] text-danger-soft">{quoteError}</span>}
                </label>

                <button
                  type="submit"
                  disabled={quoteSending}
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  <Send className="w-4 h-4" />
                  {quoteSending ? 'Илгээж байна…' : 'Үнийн санал хүсэх'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* 10. Холбоо барих */}
      <section id="contact" style={{ scrollMarginTop: navOffset + 64 }} className="theme-light py-16 md:py-20 bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel icon={MapPin}>Холбоо барих</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
            {COMPANY.legalName}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Reveal className="p-6 rounded-xl bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300">
              <MapPin className="w-5 h-5 text-brand-bright" />
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Хаяг</h3>
              <p className="mt-1.5 text-sm text-ink leading-relaxed">{COMPANY.address}</p>
            </Reveal>

            <Reveal delay={90} className="p-6 rounded-xl bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300">
              <PhoneCall className="w-5 h-5 text-brand-bright" />
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Утас</h3>
              <a
                href={`tel:${COMPANY.phone.replace(/\D/g, '')}`}
                className="mt-1.5 block text-lg font-bold text-ink hover:text-brand-bright transition-colors font-mono"
              >
                {COMPANY.phone}
              </a>
            </Reveal>

            <Reveal delay={180} className="p-6 rounded-xl bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300">
              <Mail className="w-5 h-5 text-brand-bright" />
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">И-мэйл, вэб</h3>
              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-1.5 block text-sm font-semibold text-ink hover:text-brand-bright transition-colors"
              >
                {COMPANY.email}
              </a>
              <a
                href={`https://${COMPANY.web}`}
                className="mt-0.5 block text-sm font-semibold text-brand-bright hover:text-ink transition-colors"
              >
                {COMPANY.web}
              </a>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DeltaLiftView;
