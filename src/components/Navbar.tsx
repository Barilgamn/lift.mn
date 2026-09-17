import React from 'react';
import { Building2, Wrench, ShoppingBag, AlertTriangle, ShoppingCart } from 'lucide-react';
import { ActiveSection } from '../types';
import { DeltaLiftsLogo } from './DeltaLiftsLogo';

interface NavbarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  onOpenEmergency: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onOpenEmergency,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-1/95 backdrop-blur-md border-b border-line text-white shadow-xl">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-red-950/80 via-[#07162C] to-sky-950/80 border-b border-line py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-soft opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
            </span>
            {/* Нарийн дэлгэцэд богино хувилбар — өмнө нь хоёр мөр болж эвдэрдэг байв */}
            <span className="text-danger-soft font-semibold truncate">
              <span className="sm:hidden">24/7 яаралтай дуудлага</span>
              <span className="hidden sm:inline">24/7 Лифт гацсан яаралтай дуудлагын алба:</span>
            </span>
            <a
              href="tel:+97677232222"
              className="font-mono font-bold text-accent hover:text-white transition shrink-0"
            >
              7723-2222
            </a>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-ink-muted">
            <span>Даваа - Ням 24 цаг</span>
            <span aria-hidden="true">·</span>
            <a href="mailto:info@lift.mn" className="hover:text-white transition">info@lift.mn</a>
            <span aria-hidden="true">·</span>
            <span>Улаанбаатар хот даяар</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Зүүн тал: зөвхөн лого. Дарахад портал руу буцна. */}
        <button
          type="button"
          onClick={() => onSelectSection('portal')}
          className="flex items-center shrink-0 cursor-pointer"
          title="Үндсэн портал хуудас руу буцах"
          aria-label="Үндсэн портал хуудас руу буцах"
        >
          <DeltaLiftsLogo size="sm" showText={false} className="lg:hidden" />
          <DeltaLiftsLogo size="sm" showText={true} className="hidden lg:block" />
        </button>

        {/* Center: The 3 Core Sub-Sites Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-surface-2 border border-line min-w-0 shrink">
          
          {/* Sub-site 1: DELTA LIFT */}
          <button
            id="nav-tab-delta"
            title="DELTA LIFT"
            aria-label="DELTA LIFT"
            onClick={() => onSelectSection('delta-lift')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'delta-lift'
                ? 'bg-brand text-white shadow-md shadow-[#005C9E]/40 border border-sky-400/40'
                : 'text-brand-soft/80 hover:text-white hover:bg-sky-900/40'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">DELTA LIFT</span>
          </button>

          {/* Sub-site 2: Сэлбэг хэрэгсэл */}
          <button
            id="nav-tab-parts"
            title="Сэлбэг хэрэгсэл"
            aria-label="Сэлбэг хэрэгсэл"
            onClick={() => onSelectSection('parts')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'parts'
                ? 'bg-brand text-white shadow-md shadow-[#005C9E]/40 border border-sky-400/40'
                : 'text-brand-soft/80 hover:text-white hover:bg-sky-900/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">СЭЛБЭГ ХЭРЭГСЭЛ</span>
          </button>

          {/* Sub-site 3: Засвар үйлчилгээ */}
          <button
            id="nav-tab-service"
            title="Засвар үйлчилгээ"
            aria-label="Засвар үйлчилгээ"
            onClick={() => onSelectSection('service')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'service'
                ? 'bg-brand text-white shadow-md shadow-[#005C9E]/40 border border-sky-400/40'
                : 'text-brand-soft/80 hover:text-white hover:bg-sky-900/40'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">ЗАСВАР ҮЙЛЧИЛГЭЭ</span>
          </button>

        </nav>

        {/* Right Actions: Emergency button & Cart drawer button */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Emergency Alert Button */}
          <button
            id="nav-emergency-btn"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/25 hover:bg-red-600/35 text-red-300 border border-red-500/40 text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title="Лифтэнд хүн гацсан үед дарах"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="hidden xl:inline">Гацсан дуудлага</span>
            <span className="hidden sm:inline xl:hidden">24/7</span>
          </button>

          {/* Cart button */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg bg-surface-2 hover:bg-surface-4 border border-line text-white transition hover:border-sky-400 cursor-pointer"
            title="Сэлбэгийн сагс харах"
          >
            <ShoppingCart className="w-4 h-4 text-brand-bright" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-neutral-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
