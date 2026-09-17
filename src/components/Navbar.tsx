import React from 'react';
import { 
  Building2, 
  Wrench, 
  ShoppingBag, 
  AlertTriangle, 
  ShoppingCart, 
  Home
} from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-[#051329]/95 backdrop-blur-md border-b border-sky-900/50 text-white shadow-xl">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-red-950/80 via-[#07162C] to-sky-950/80 border-b border-sky-900/30 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-300 font-semibold">24/7 Лифт гацсан яаралтай дуудлагын алба:</span>
            <a href="tel:+97677232222" className="font-mono font-bold text-amber-400 hover:text-white transition">(+976) 7723-2222</a>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sky-200/70">
            <span>Цагийн хуваарь: Даваа - Ням 24 цаг</span>
            <span>·</span>
            <a href="mailto:info@lift.mn" className="hover:text-white transition">info@lift.mn</a>
            <span>·</span>
            <span>Улаанбаатар хот даяар</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Brand logo and Back to Portal button */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            id="nav-back-portal-btn"
            onClick={() => onSelectSection('portal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 text-sky-200 hover:text-white border border-sky-800/40 text-xs font-medium transition cursor-pointer"
            title="Үндсэн портал хуудас руу буцах"
          >
            <Home className="w-3.5 h-3.5 text-[#F9A01B]" />
            <span className="hidden md:inline">Портал</span>
          </button>

          <div 
            onClick={() => onSelectSection('portal')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <DeltaLiftsLogo size="sm" showText={false} className="lg:hidden" />
            <DeltaLiftsLogo size="sm" showText={true} className="hidden lg:block" />
            <div className="hidden xl:block h-5 w-px bg-sky-800/40 mx-1" />
            <div className="hidden xl:block text-[11px] text-sky-300/70 uppercase tracking-wider font-semibold">
              LIFT.MN
            </div>
          </div>
        </div>

        {/* Center: The 3 Core Sub-Sites Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-[#091B36] border border-sky-800/40 min-w-0 shrink">
          
          {/* Sub-site 1: DELTA LIFT */}
          <button
            id="nav-tab-delta"
            title="DELTA LIFT"
            aria-label="DELTA LIFT"
            onClick={() => onSelectSection('delta-lift')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'delta-lift'
                ? 'bg-[#005C9E] text-white shadow-md shadow-[#005C9E]/40 border border-sky-400/40'
                : 'text-sky-200/80 hover:text-white hover:bg-sky-900/40'
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
                ? 'bg-[#005C9E] text-white shadow-md shadow-[#005C9E]/40 border border-sky-400/40'
                : 'text-sky-200/80 hover:text-white hover:bg-sky-900/40'
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
                ? 'bg-[#005C9E] text-white shadow-md shadow-[#005C9E]/40 border border-sky-400/40'
                : 'text-sky-200/80 hover:text-white hover:bg-sky-900/40'
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
            className="relative p-2.5 rounded-lg bg-[#091B36] hover:bg-[#0D264A] border border-sky-800/50 text-white transition hover:border-sky-400 cursor-pointer"
            title="Сэлбэгийн сагс харах"
          >
            <ShoppingCart className="w-4 h-4 text-[#38BDF8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F9A01B] text-neutral-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
