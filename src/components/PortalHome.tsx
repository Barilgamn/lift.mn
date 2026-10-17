import React from 'react';
import { ArrowRight, PhoneCall, Mail, MapPin } from 'lucide-react';
import { PartsIcon, ServiceIcon, StandardsIcon } from './PortalIcons';
import { ActiveSection } from '../types';
import { DeltaLiftsMark } from './DeltaLiftsLogo';
import { LiftMnLogo } from './LiftMnLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ROUTES } from '../routes';
import { NAADAM, SPORTS } from '../data/naadamData';
// Баннерын гарчгийн фонт (наадмын хуудастай ижил)
import '@fontsource/oswald/700.css';
import { CONTACT_EMAIL, SHOW_DELTA_LIFT, SITE_NAME } from '../config';

/**
 * DELTA LIFT нуугдсан үед гурван багана (Сэлбэг, Засвар, Норм дүрэм)
 * үлдэнэ. Бүтэн өргөнөөр сунгавал өргөн дэлгэц дээр сунжирсан харагддаг
 * тул голд нь хүрээтэй, ижил өргөнтэй карт болгон байрлуулна.
 */
const NARROW = !SHOW_DELTA_LIFT;

interface PortalCardProps {
  id: string;
  /** Дэлгэц дээрх байрлал (lg:order-*) */
  order: string;
  onOpen: () => void;
  image: string;
  /** Гараар зурсан хөдөлгөөнтэй дүрс (PortalIcons) */
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  cta: string;
  /** Гол үйлчилгээ — дэвсгэр цайвар, дээд зураас өтгөн, товч дүүрэн өнгөтэй */
  featured?: boolean;
}

/**
 * Нүүрний карт. Гурван карт яг ижил бүтэцтэй байж, гарчиг, дэд гарчиг,
 * тайлбар, шошго, товч нь хажуу картынхаа түвшинд эгнэнэ:
 *   - гарчиг үргэлж нэг мөрөнд (хэмжээ нь өргөнөөс хамаарч багасна)
 *   - дэд гарчигт хоёр мөрийн зай нөөцөлсөн
 *   - тайлбарт ижил өндөр нөөцөлж (lg: 6, xl: 4 мөр), шошго нь 2×2 тор
 */
const PortalCard: React.FC<PortalCardProps> = ({
  id, order, onOpen, image, icon: Icon, title, subtitle, description, tags, cta, featured,
}) => (
  <section
    id={id}
    onClick={onOpen}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpen();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={title}
    className={`${order} ${
      NARROW
        ? 'lg:rounded-2xl lg:border lg:border-white/70 lg:shadow-xl lg:shadow-slate-900/20 lg:hover:shadow-2xl lg:hover:shadow-sky-900/30 lg:hover:-translate-y-1 lg:basis-0'
        : 'lg:border-l lg:border-line lg:hover:flex-[1.12]'
    } max-lg:rounded-2xl max-lg:border max-lg:border-white/70 max-lg:shadow-lg max-lg:shadow-slate-900/20 group relative flex-1 min-w-0 flex flex-col p-2.5 sm:p-3 lg:p-8 xl:p-9 transition-all duration-500 ease-out cursor-pointer overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-bright focus-visible:-outline-offset-4`}
  >
    {/* Дэвсгэр зураг */}
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
      style={{ backgroundImage: `url('${image}')` }}
    />
    <div
      className={`absolute inset-0 bg-gradient-to-b transition-all duration-500 ${
        featured
          ? 'from-[#040E20]/80 via-[#06152F]/62 to-[#020813]/88 group-hover:from-[#040E20]/70 group-hover:via-[#092144]/48 group-hover:to-[#020813]/80'
          : 'from-[#040E20]/92 via-[#06152F]/82 to-[#020813]/95 group-hover:from-[#040E20]/80 group-hover:via-[#092144]/65 group-hover:to-[#020813]/88'
      }`}
    />
    <div
      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-transparent to-transparent transition-opacity duration-500 pointer-events-none ${
        featured ? 'from-sky-500/20' : 'from-sky-500/10 opacity-0 group-hover:opacity-100'
      }`}
    />

    {/* Дээд зураас */}
    <div
      className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
        featured ? 'h-1.5 bg-brand-bright group-hover:h-2' : 'h-1 bg-brand group-hover:bg-[#38BDF8] group-hover:h-1.5'
      }`}
    />

    {/*
      * Текстийн хавтан. Ар дэвсгэрийн зураг дээр цайвар толбо тохиолдвол
      * саарал текст уншигдахаа больдог тул текстийн доогуур нимгэн бүрхүүл.
      *
      * lg-ээс бага (утас, таблет): хэвтээ мөр — дүрс, гарчиг, товч холбоос.
      * Гурван карт нэг дэлгэцэнд багтаж, доор нь өөр хэсэг байгаа нь
      * шууд харагдана. Тайлбар, шошго, том товч зөвхөн өргөн дэлгэцэд.
      */}
    <div className="relative z-10 my-auto lg:mt-10 flex flex-row lg:flex-col items-center gap-3.5 sm:gap-5 lg:gap-0 text-left lg:text-center p-3 sm:p-4 lg:py-7 lg:px-5 rounded-xl lg:rounded-2xl bg-[#040E20]/60 backdrop-blur-[3px]">
      {/* Гадна давхарга — hover-оор томорно; дотор нь хөвөх хөдөлгөөн (transform давхцахгүй) */}
      <div className="shrink-0 lg:mb-4 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3">
        <div className="pi-tile w-16 h-16 sm:w-[72px] sm:h-[72px] lg:w-[84px] lg:h-[84px] rounded-[18px] lg:rounded-[24px] bg-gradient-to-br from-white via-white to-sky-100 ring-1 ring-white/80 shadow-xl shadow-sky-950/50 flex items-center justify-center">
          <Icon className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
        </div>
      </div>

      <div className="min-w-0 flex-1 lg:flex-none w-full flex flex-col items-start lg:items-center">
        <h2 className="whitespace-nowrap text-lg sm:text-[1.4rem] lg:text-[clamp(1.2rem,1.75vw,1.65rem)] leading-tight font-black tracking-tight text-white group-hover:text-brand-bright transition duration-300">
          {title}
        </h2>

        <p className="mt-1 lg:mt-2 lg:min-h-[2.6em] flex items-center lg:justify-center text-[10px] sm:text-[11px] lg:text-xs font-semibold tracking-wider text-brand-bright uppercase leading-snug">
          {subtitle}
        </p>

        {/* Утас, таблет — жижиг товч */}
        <span className="lg:hidden mt-2 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand text-white text-[11px] font-bold uppercase tracking-wide shadow-md shadow-sky-950/40">
          {cta}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>

        <p className="hidden lg:block mt-3 text-sm text-ink-muted leading-relaxed max-w-sm lg:min-h-[9.75em] xl:min-h-[6.5em]">
          {description}
        </p>

        {/* 2×2 тор — шошго хэдэн үгтэй байсан ч бүх картад ижил өндөртэй */}
        <div className="hidden lg:grid mt-5 grid-cols-2 gap-2 w-full max-w-sm">
          {tags.map((tag) => (
            <span
              key={tag}
              className="min-h-11 flex items-center justify-center text-center py-1.5 px-2 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium leading-tight opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Товч — өргөн дэлгэцэд */}
    <div className="hidden lg:block relative z-10 w-full pt-4">
      <div
        className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
          featured
            ? 'bg-brand group-hover:bg-brand-hover border border-sky-300/50 shadow-xl shadow-sky-900/50'
            : 'bg-brand/50 group-hover:bg-brand border border-sky-600/50 group-hover:border-sky-300 shadow-lg shadow-sky-950/50'
        }`}
      >
        <span>{cta}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition duration-300" />
      </div>
    </div>
  </section>
);

/** Наадам эхлэх хүртэлх хоног: 0 — өнөөдөр/маргааш эхэлж байна, null — дууссан */
function naadamDaysLeft(now = Date.now()): number | null {
  const start = new Date(NAADAM.startsAt).getTime();
  const end = start + 2 * 86400000;
  if (now >= end) return null;
  return Math.max(0, Math.ceil((start - now) / 86400000));
}

const daysLabel = (d: number) => (d === 0 ? 'Өнөөдөр эхэлнэ' : `${d} хоног үлдлээ`);

interface PortalHomeProps {
  onSelectSection: (section: ActiveSection) => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({ 
  onSelectSection, 
}) => {
  // Наадам эхлэх хүртэл үлдсэн хоног (Улаанбаатарын цагаар). Дууссан бол харуулахгүй.
  const daysLeft = naadamDaysLeft();
  return (
    <div 
      id="portal-container"
      className="relative min-h-dvh lg:h-dvh w-full flex flex-col justify-between overflow-x-hidden lg:overflow-hidden bg-[#EEF3F9] text-white"
    >
      {/* Цайвар дэвсгэр — картуудын хоёр тал: зөөлөн цэнхэр туяа, нарийн цэгэн тор */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_35%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_85%_70%,rgba(247,198,0,0.10),transparent_50%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(rgba(14,93,168,0.13)_1px,transparent_1px)] [background-size:22px_22px]" />
      {/* Дээд мөр: голлосон LIFT.MN лого */}
      <header 
        id="portal-header" 
        className="relative z-30 w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sm:justify-center gap-2 sm:gap-4 border-b border-line-light bg-paper shrink-0 shadow-sm"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <LiftMnLogo className="h-7 sm:h-9" beta="lg" />
          <div className="hidden xl:block h-7 w-px bg-line-light" />
          <span className="hidden xl:inline text-sm font-bold tracking-widest text-ink-dark-muted uppercase">
            МОНГОЛЫН ЛИФТ, ЭСКАЛАТОРЫН НЭГДСЭН ЦАХИМ ТАЛБАР
          </span>
        </div>
        <LanguageSwitcher className="sm:absolute sm:right-6 lg:right-8" />
      </header>

      {/* Спортын их наадам 2026 — нарийхан баннер (постерын өнгө төрхтэй) */}
      <a
        id="portal-naadam-banner"
        href={ROUTES.sportnaadam.path}
        onClick={(e) => {
          e.preventDefault();
          onSelectSection('sportnaadam');
        }}
        className="group relative z-20 block shrink-0 overflow-hidden bg-white border-b border-slate-200"
      >
        {/* Хөдөлгөөнтэй дэвсгэр — өнгөний туяа аажим хөдөлж, гэрэл гүйнэ (index.css: nb-*) */}
        <div aria-hidden="true" className="nb-glow absolute -inset-x-[10%] inset-y-0 bg-[radial-gradient(ellipse_at_left,rgba(186,230,253,0.75),transparent_55%),radial-gradient(ellipse_at_right,rgba(251,207,232,0.5),transparent_50%)]" />
        <div aria-hidden="true" className="nb-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[4.5rem] flex items-center gap-3 sm:gap-5">
          <div className="min-w-0 flex flex-col md:flex-row md:items-baseline md:gap-3">
            <span style={{ fontFamily: "'Oswald', 'Arial Narrow', sans-serif" }} className="text-[17px] min-[380px]:text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#0E5DA8] leading-tight truncate">
              {NAADAM.edition} спортын их наадам
            </span>
            <span className="text-[11px] sm:text-sm font-bold text-slate-600 truncate">
              {NAADAM.dateLabel}
              {daysLeft !== null && (
                <span id="naadam-days" className="text-[#C2410C]">
                  {' · '}
                  <span className="relative inline-flex w-2 h-2 mr-1 align-middle -translate-y-px" aria-hidden="true">
                    <span className="nb-ping absolute inline-flex w-full h-full rounded-full bg-orange-500/70" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-orange-500" />
                  </span>
                  {daysLeft === 0 ? daysLabel(0) : (
                    <>{daysLeft} хоног<span className="hidden min-[380px]:inline"> үлдлээ</span></>
                  )}
                </span>
              )}
              {/* Хаяг зөвхөн icon-гүй өргөн (lg) дэлгэцэд — бусад үед зай хүрэлцэхгүй */}
              <span className="hidden lg:inline xl:hidden"> · {NAADAM.venue}</span>
            </span>
          </div>
          <div className="hidden xl:flex items-center gap-3 ml-auto" aria-hidden="true">
            {SPORTS.map((sp, i) => (
              <img
                key={sp.id}
                src={sp.icon}
                alt=""
                style={{ animationDelay: `${i * 0.18}s` }}
                className={`nb-sport ${sp.wide ? 'h-6' : 'h-8'} w-auto`}
              />
            ))}
          </div>
          <span className="nb-cta ml-auto xl:ml-4 shrink-0 inline-flex items-center gap-1.5 h-10 sm:h-11 px-2.5 min-[380px]:px-3 sm:px-5 rounded-xl bg-[#F7C600] group-hover:bg-[#ffd21f] text-[#0B3F78] text-[11px] min-[380px]:text-xs sm:text-sm font-extrabold uppercase min-[380px]:tracking-wider shadow-md shadow-amber-500/25 transition">
            Бүртгүүлэх
            <ArrowRight className="nb-arrow hidden min-[380px]:block w-4 h-4" />
          </span>
        </div>
      </a>

      {/* Үндсэн хэсэг — гурван бүтэн дэлгэцийн багана */}
      <main 
        id="portal-tri-split"
        /*
         * Дараалал: гар утсанд Сэлбэг → Засвар → Delta (DOM дараалал),
         * дэлгэц дээр Засвар → Сэлбэг → Delta (lg:order-*).
         * Гар утасны дарааллыг DOM-д тавьсан учир нь Tab товчны дараалал
         * DOM-ыг дагадаг — зочны дийлэнх нь утаснаас ордог.
         *
         * divide-* ангилал энд тохирохгүй: тэр нь DOM дарааллаар шугам
         * зурдаг тул order-оор байр сольсны дараа буруу талд гарна.
         * Оронд нь хэсэг бүрд харагдах байрлалынх нь дагуу хүрээ өгөв.
         */
        className={`relative z-10 flex-1 w-full flex flex-col lg:flex-row ${
          NARROW ? 'gap-3 p-3 sm:gap-4 sm:p-4 lg:max-w-7xl lg:mx-auto lg:gap-5 lg:p-4 lg:py-6' : ''
        }`}
      >
        {/* Дараалал: Сэлбэг → Засвар → Норм дүрэм (утас, дэлгэц хоёуланд) */}
        <PortalCard
          id="portal-column-parts"
          order="lg:order-1"
          featured
          onOpen={() => onSelectSection('parts')}
          // Эх зургийн дээд хэсэгт "DELTA LIFT" самбар харагддаг тул нуусан
          // үед түүнийг тайрсан хувилбарыг ашиглана
          image={SHOW_DELTA_LIFT ? '/images/lift_parts_hero.jpg' : '/images/parts_hero.jpg'}
          icon={PartsIcon}
          title="СЭЛБЭГ ХЭРЭГСЭЛ"
          subtitle="ОРИГИНАЛ ЭД АНГИ · ОНЛАЙН ЗАХИАЛГА"
          description="Бүх төрлийн лифт, эскалаторын оригинал сэлбэгийн онлайн каталоги, шууд худалдан авалт, агуулахын үлдэгдэл болон тусгай захиалга, суурилуулалт"
          tags={['Онлайн дэлгүүр', 'Бэлэн нөөц', 'Шуурхай хүргэлт', 'Баталгаат сэлбэг']}
          cta="Дэлгүүр лүү орох"
        />

        <PortalCard
          id="portal-column-service"
          order="lg:order-2"
          onOpen={() => onSelectSection('service')}
          image="/images/service_hero.jpg"
          icon={ServiceIcon}
          title="ЗАСВАР ҮЙЛЧИЛГЭЭ"
          subtitle="ОНОШИЛГОО · ХУВААРЬТ ҮЗЛЭГ · ТАРИФ"
          description="Засвар үйлчилгээний онлайн дуудлага өгөх, цаг товлох, СӨХ-ийн гэрээт багц, тариф үнийн жагсаалт болон 24/7 диспетчерийн алба"
          tags={['24/7 Шуурхай алба', 'СӨХ гэрээт үйлчилгээ', 'Хуваарьт үзлэг оношилгоо', 'Инженерийн баг']}
          cta="Үйлчилгээ рүү орох"
        />

        <PortalCard
          id="portal-column-standards"
          order="lg:order-3"
          onOpen={() => onSelectSection('standards')}
          image="/images/cabins/atlas-gigas-traction-mrl.webp"
          icon={StandardsIcon}
          title="НОРМ ДҮРЭМ"
          subtitle="СТАНДАРТ · ТЕХНИКИЙН ШИЙДЭЛ"
          description="Лифт, урсдаг шатны олон улсын стандартууд болон шинэчлэл, эрчим хүч хэмнэлт, аюулгүй байдлын техникийн шийдлүүд"
          tags={['EN 81-20 / 50', 'Шинэчлэл', 'Эрчим хүч хэмнэлт', 'Галын аюулгүй байдал']}
          cta="Дэлгэрэнгүй үзэх"
        />

        {/* DELTA LIFT — хоёуланд нь 4-рт. Түр нуусан (src/config.ts) */}
        {SHOW_DELTA_LIFT && (
        <section
          id="portal-column-delta"
          onClick={() => onSelectSection('delta-lift')}
          role="button"
          tabIndex={0}
          className="lg:order-4 border-t border-line lg:border-t-0 lg:border-l lg:border-line group relative flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-all duration-500 ease-out cursor-pointer overflow-hidden lg:hover:flex-[1.12]"
        >
          {/* Background Image with Dark Navy Gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80')`
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#040E20]/92 via-[#06152F]/82 to-[#020813]/95 group-hover:from-[#040E20]/80 group-hover:via-[#092144]/65 group-hover:to-[#020813]/88 transition-all duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand group-hover:bg-[#38BDF8] group-hover:h-1.5 transition-all duration-300" />

          {/* Card Middle: Icon, Titles & Brand Logos */}
          {/*
            * Текстийн ард нимгэн бүрхүүл. Ар дэвсгэрийн зураг дээр цайвар
            * толбо тохиолдвол саарал текст уншигдахаа больдог (хэмжихэд
            * 2:1 орчим байсан, хэрэгтэй нь 4.5:1). Бүрхүүл нь зургийг
            * бүрэн дарахгүй, зөвхөн текстийн доогуур л ордог.
            */}
          <div className="relative z-10 my-auto py-6 sm:py-8 px-4 sm:px-5 rounded-2xl bg-[#040E20]/55 backdrop-blur-[3px] flex flex-col items-center text-center">
            {/* Header: Icon and Title in ONE row */}
            <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg border border-sky-500/30 group-hover:border-brand bg-black/80 group-hover:bg-black backdrop-blur-md flex items-center justify-center p-1.5 transition-all duration-300 shadow-lg group-hover:shadow-[#0063A5]/30 shrink-0">
                <DeltaLiftsMark 
                  className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
                  bladeColor="#0063A5" 
                  yellowColor="#F9A01B" 
                />
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white group-hover:text-brand-bright transition duration-300">
                DELTA LIFT
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-wider text-brand-bright uppercase mb-4">
              ШИНЭ ТОНОГ ТӨХӨӨРӨМЖ БА НИЙЛҮҮЛЭЛТ
            </p>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm mb-6 min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
              KLEEMANN брэндийн Монгол дахь албан ёсны онцгой эрхт дистрибьютер. Компанийн танилцуулга, бүтээгдэхүүн, хэрэгжүүлсэн төслүүд.
            </p>

            {/* KLEEMANN — албан ёсны онцгой эрхт дистрибьютер */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-md pt-1">
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-brand/25 border border-brand/60 text-white text-[11px] font-black tracking-wider group-hover:bg-brand/40 group-hover:border-sky-400 transition-all">
                KLEEMANN
              </span>
              <span className="inline-flex items-center h-7 px-2.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-[11px] font-bold tracking-wider opacity-70 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Цахилгаан шат
              </span>
              <span className="inline-flex items-center h-7 px-2.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-[11px] font-bold tracking-wider opacity-70 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Урсдаг шат
              </span>
              <span className="inline-flex items-center h-7 px-2.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-[11px] font-bold tracking-wider opacity-70 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Урсдаг зам
              </span>
              <span className="inline-flex items-center h-7 px-2.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-[11px] font-bold tracking-wider opacity-70 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Авто зогсоол
              </span>
            </div>
          </div>

          {/* Card Bottom: Button */}
          <div className="relative z-10 w-full pt-4">
            <div className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-brand/50 group-hover:bg-brand text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-sky-600/50 group-hover:border-sky-300 shadow-lg shadow-sky-950/50">
              <span>Вэб сайт руу орох</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition duration-300" />
            </div>
          </div>
        </section>
        )}
      </main>

      {/* Footer Bar: Contains Emergency Hotline & Contacts */}
      <footer 
        id="portal-footer" 
        className="relative z-30 w-full px-4 sm:px-8 py-2.5 md:py-3 flex flex-wrap items-center justify-between gap-3 border-t border-line-light bg-paper text-[11px] md:text-xs text-ink-dark-muted shrink-0"
      >
        <div className="flex items-center gap-2">
          <span>
            © 2026{' '}
            {SHOW_DELTA_LIFT && (<><strong className="text-ink-dark">DELTA LIFTS</strong> · </>)}
            <strong className="text-brand">{SITE_NAME}</strong>. Бүх эрх хуулиар хамгаалагдсан.
          </span>
        </div>

        {/* Хөл хэсгийн холбоо барих мэдээлэл */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <a 
            href="tel:+97677232222" translate="no"
            className="flex items-center gap-1.5 hover:text-brand transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand" />
            <span className="font-mono font-semibold">(+976) 7723-2222</span>
          </a>

          <span className="hidden xl:inline text-ink-dark-subtle" aria-hidden="true">·</span>

          <span className="hidden md:flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand" />
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand transition-colors">{CONTACT_EMAIL}</a>
          </span>

          <span className="hidden xl:inline text-ink-dark-subtle" aria-hidden="true">·</span>

          <span className="hidden lg:flex items-center gap-1.5 text-ink-dark-muted">
            <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
            <span title="Union Building, Unesco St, Sunroad-62, 1st khoroo, Sukhbaatar district, Ulaanbaatar">
              Union Building, Unesco St, Сүхбаатар дүүрэг, 1-р хороо
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
};
