import React from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  ArrowRight, 
  AlertTriangle,
  PhoneCall,
  Mail,
  MapPin
} from 'lucide-react';
import { ActiveSection } from '../types';
import { DeltaLiftsLogo, DeltaLiftsMark } from './DeltaLiftsLogo';

interface PortalHomeProps {
  onSelectSection: (section: ActiveSection) => void;
  onOpenEmergency: () => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({ 
  onSelectSection, 
  onOpenEmergency 
}) => {
  return (
    <div 
      id="portal-container"
      className="relative min-h-dvh md:h-dvh w-full flex flex-col justify-between overflow-x-hidden md:overflow-hidden bg-surface-0 text-white"
    >
      {/* Top Header Bar: Centered & Enlarged Delta Lifts Logo */}
      <header 
        id="portal-header" 
        className="relative z-30 w-full px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 border-b border-line backdrop-blur-md bg-surface-1/90 shrink-0 shadow-md shadow-black/40"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <DeltaLiftsLogo variant="official" size="lg" showText={true} textClassName="text-brand-bright group-hover:text-white" />
          <div className="hidden md:block h-7 w-px bg-sky-800/50" />
          <span className="hidden md:inline text-xs lg:text-sm font-bold tracking-widest text-brand-soft/90 uppercase">
            МОНГОЛЫН ЛИФТ, ЭСКАЛАТОРЫН НЭГДСЭН ЦАХИМ ТАЛБАР
          </span>
        </div>
      </header>

      {/* Main Content Area: 3 Full-Screen Columns */}
      <main 
        id="portal-tri-split"
        className="relative z-10 flex-1 w-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-line"
      >
        {/* COLUMN 1: DELTA LIFT */}
        <section
          id="portal-column-delta"
          onClick={() => onSelectSection('delta-lift')}
          role="button"
          tabIndex={0}
          className="group relative flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-all duration-500 ease-out cursor-pointer overflow-hidden md:hover:flex-[1.12]"
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
          <div className="relative z-10 my-auto py-6 sm:py-8 flex flex-col items-center text-center">
            {/* Header: Icon and Title in ONE row */}
            <div className="flex items-start justify-center gap-3 sm:gap-3.5 mb-2.5">
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

        {/* COLUMN 2: СЭЛБЭГ ХЭРЭГСЭЛ (ГОЛД НЬ ОРУУЛАВ) */}
        <section
          id="portal-column-parts"
          onClick={() => onSelectSection('parts')}
          role="button"
          tabIndex={0}
          className="group relative flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-all duration-500 ease-out cursor-pointer overflow-hidden md:hover:flex-[1.12]"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              backgroundImage: `url('/images/lift_parts_hero.jpg')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040E20]/92 via-[#06152F]/82 to-[#020813]/95 group-hover:from-[#040E20]/80 group-hover:via-[#092144]/65 group-hover:to-[#020813]/88 transition-all duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand group-hover:bg-[#38BDF8] group-hover:h-1.5 transition-all duration-300" />

          {/* Card Middle: Icon, Titles & Representative Keywords */}
          <div className="relative z-10 my-auto py-6 sm:py-8 flex flex-col items-center text-center">
            {/* Header: Icon and Title in ONE row */}
            <div className="flex items-start justify-center gap-3 sm:gap-3.5 mb-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg border border-sky-500/30 group-hover:border-brand-bright bg-surface-3/90 group-hover:bg-brand/40 backdrop-blur-md flex items-center justify-center p-1.5 transition-all duration-300 shadow-lg group-hover:shadow-sky-500/20 shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-brand-soft group-hover:text-white transition duration-300" strokeWidth={1.75} />
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white group-hover:text-brand-bright transition duration-300">
                СЭЛБЭГ ХЭРЭГСЭЛ
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-wider text-brand-bright uppercase mb-4">
              ОРИГИНАЛ ЭД АНГИ · ОНЛАЙН ЗАХИАЛГА
            </p>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm mb-6 min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
              Бүх төрлийн лифт, эскалаторын оригинал сэлбэгийн онлайн каталоги, шууд худалдан авалт, агуулахын үлдэгдэл болон тусгай захиалга
            </p>

            {/* Representative Keywords Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md pt-1">
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Онлайн дэлгүүр
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Бэлэн нөөц
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Шуурхай хүргэлт
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Баталгаат сэлбэг
              </span>
            </div>
          </div>

          {/* Card Bottom: Button */}
          <div className="relative z-10 w-full pt-4">
            <div className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-brand/50 group-hover:bg-brand text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-sky-600/50 group-hover:border-sky-300 shadow-lg shadow-sky-950/50">
              <span>Дэлгүүр лүү орох</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition duration-300" />
            </div>
          </div>
        </section>

        {/* COLUMN 3: ЗАСВАР ҮЙЛЧИЛГЭЭ */}
        <section
          id="portal-column-service"
          onClick={() => onSelectSection('service')}
          role="button"
          tabIndex={0}
          className="group relative flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-all duration-500 ease-out cursor-pointer overflow-hidden md:hover:flex-[1.12]"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              backgroundImage: `url('/images/service_hero.jpg')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040E20]/92 via-[#06152F]/82 to-[#020813]/95 group-hover:from-[#040E20]/80 group-hover:via-[#092144]/65 group-hover:to-[#020813]/88 transition-all duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand group-hover:bg-[#38BDF8] group-hover:h-1.5 transition-all duration-300" />

          {/* Card Middle: Icon, Titles & Representative Keywords */}
          <div className="relative z-10 my-auto py-6 sm:py-8 flex flex-col items-center text-center">
            {/* Header: Icon and Title in ONE row */}
            <div className="flex items-start justify-center gap-3 sm:gap-3.5 mb-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg border border-sky-500/30 group-hover:border-brand-bright bg-surface-3/90 group-hover:bg-brand/40 backdrop-blur-md flex items-center justify-center p-1.5 transition-all duration-300 shadow-lg group-hover:shadow-sky-500/20 shrink-0">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-brand-soft group-hover:text-white transition duration-300" strokeWidth={1.75} />
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white group-hover:text-brand-bright transition duration-300">
                ЗАСВАР ҮЙЛЧИЛГЭЭ
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-wider text-brand-bright uppercase mb-4">
              ОНОШИЛГОО · ХУВААРЬТ ҮЗЛЭГ · ТАРИФ
            </p>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm mb-6 min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
              Засвар үйлчилгээний онлайн дуудлага өгөх, цаг товлох, СӨХ-ийн гэрээт багц, тариф үнийн жагсаалт болон 24/7 диспетчерийн алба
            </p>

            {/* Representative Keywords Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md pt-1">
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                24/7 Шуурхай алба
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                СӨХ гэрээт үйлчилгээ
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Хуваарьт үзлэг оношилгоо
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-muted text-xs font-medium opacity-80 group-hover:opacity-100 group-hover:border-sky-500/40 group-hover:text-white transition-all">
                Инженерийн баг
              </span>
            </div>
          </div>

          {/* Card Bottom: Button */}
          <div className="relative z-10 w-full pt-4">
            <div className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-brand/50 group-hover:bg-brand text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-sky-600/50 group-hover:border-sky-300 shadow-lg shadow-sky-950/50">
              <span>Үйлчилгээ рүү орох</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition duration-300" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar: Contains Emergency Hotline & Contacts */}
      <footer 
        id="portal-footer" 
        className="relative z-30 w-full px-4 sm:px-8 py-2.5 md:py-3 flex flex-wrap items-center justify-between gap-3 border-t border-line backdrop-blur-md bg-[#020814]/95 text-[11px] md:text-xs text-brand-bright/70 shrink-0"
      >
        <div className="flex items-center gap-2">
          <span>© 2026 <strong className="text-white">DELTA LIFTS</strong> · <strong className="text-brand-bright">LIFT.MN</strong>. Бүх эрх хуулиар хамгаалагдсан.</span>
        </div>

        {/* Emergency Call Button & Contacts in Footer */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <button 
            id="footer-emergency-call-btn"
            onClick={onOpenEmergency}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-red-600/30 border border-red-400/40 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-mono font-bold">24/7 Дуудлага: (+976) 7723-2222</span>
          </button>

          <a 
            href="tel:+97677232222"
            className="flex items-center gap-1.5 text-brand-soft/90 hover:text-white transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-bright" />
            <span className="font-mono font-semibold">(+976) 7723-2222</span>
          </a>

          <span className="hidden xl:inline text-brand-bright/30">·</span>

          <span className="hidden md:flex items-center gap-1.5 text-brand-soft/80">
            <Mail className="w-3.5 h-3.5 text-brand-bright" />
            <a href="mailto:info@lift.mn" className="hover:text-white transition">info@lift.mn</a>
            <span className="text-sky-500/50">,</span>
            <a href="mailto:sales@lift.mn" className="hover:text-white transition">sales@lift.mn</a>
          </span>

          <span className="hidden xl:inline text-brand-bright/30">·</span>

          <span className="hidden lg:flex items-center gap-1.5 text-brand-bright/80">
            <MapPin className="w-3.5 h-3.5 text-brand-bright shrink-0" />
            <span title="Union Building, Unesco St, Sunroad-62, 1st khoroo, Sukhbaatar district, Ulaanbaatar">
              Union Building, Unesco St, Сүхбаатар дүүрэг, 1-р хороо
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
};
