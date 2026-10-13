import React, { useEffect, useState } from 'react';
import { BookOpen, Building2, Wrench, ShoppingBag, ShoppingCart, PhoneCall } from 'lucide-react';
import { ActiveSection } from '../types';
import { LiftMnLogo } from './LiftMnLogo';
import { CONTACT_EMAIL, SHOW_DELTA_LIFT } from '../config';
import { CART_BUMP_EVENT } from '../lib/flyToCart';

interface NavbarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  cartCount,
  onOpenCart,
}) => {
  // Бараа нисч ирэхэд сагсны тоо болон товч нэг удаа цохилно
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onBump = () => {
      setBump(false);
      // Нэг кадр хүлээж дахин асаана — эс бөгөөс дараалсан нэмэлт дээр
      // хөдөлгөөн дахин эхлэхгүй
      requestAnimationFrame(() => setBump(true));
      window.setTimeout(() => setBump(false), 700);
    };
    window.addEventListener(CART_BUMP_EVENT, onBump);
    return () => window.removeEventListener(CART_BUMP_EVENT, onBump);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-paper/95 backdrop-blur-md border-b border-line-light text-ink-dark shadow-sm">
      {/* Top emergency announcement bar */}
      <div className="bg-paper-3 border-b border-line-light py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-soft opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
            </span>
            {/* Нарийн дэлгэцэд богино хувилбар — өмнө нь хоёр мөр болж эвдэрдэг байв */}
            <span className="text-red-700 font-semibold truncate">
              <span className="sm:hidden">24/7 яаралтай дуудлага</span>
              <span className="hidden sm:inline">24/7 Лифт гацсан яаралтай дуудлагын алба:</span>
            </span>
            <a
              href="tel:+97677232222"
              className="font-mono font-bold text-brand hover:text-brand-hover transition shrink-0 py-1.5 -my-1.5 px-1 -mx-1"
            >
              7723-2222
            </a>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-ink-dark-muted">
            <span>Даваа - Ням 24 цаг</span>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand transition">{CONTACT_EMAIL}</a>
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
          className="flex items-center shrink-0 cursor-pointer py-3 -my-3"
          title="Үндсэн портал хуудас руу буцах"
          aria-label="Үндсэн портал хуудас руу буцах"
        >
          <LiftMnLogo className="h-5 sm:h-6 lg:h-7" beta="sm" />
        </button>

        {/* Center: The 3 Core Sub-Sites Switcher */}
        {/* Дэлгэц дээр л харагдана — утас, таблетад доод цэс (MobileNav) ашиглана */}
        <nav className="hidden lg:flex items-center gap-2 p-1 rounded-xl bg-paper-3 border border-line-light min-w-0 shrink">
          
          {/* Sub-site 1: DELTA LIFT — түр нуусан (src/config.ts) */}
          {SHOW_DELTA_LIFT && (
          <button
            id="nav-tab-delta"
            title="DELTA LIFT"
            aria-label="DELTA LIFT"
            onClick={() => onSelectSection('delta-lift')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'delta-lift'
                ? 'bg-brand text-white shadow-sm border border-transparent'
                : 'text-ink-dark-muted hover:text-brand hover:bg-paper border border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>DELTA LIFT</span>
          </button>
          )}

          {/* Sub-site 2: Сэлбэг хэрэгсэл */}
          <button
            id="nav-tab-parts"
            title="Сэлбэг хэрэгсэл"
            aria-label="Сэлбэг хэрэгсэл"
            onClick={() => onSelectSection('parts')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'parts'
                ? 'bg-brand text-white shadow-sm border border-transparent'
                : 'text-ink-dark-muted hover:text-brand hover:bg-paper border border-transparent'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>СЭЛБЭГ ХЭРЭГСЭЛ</span>
          </button>

          {/* Sub-site 3: Засвар үйлчилгээ */}
          <button
            id="nav-tab-service"
            title="Засвар үйлчилгээ"
            aria-label="Засвар үйлчилгээ"
            onClick={() => onSelectSection('service')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'service'
                ? 'bg-brand text-white shadow-sm border border-transparent'
                : 'text-ink-dark-muted hover:text-brand hover:bg-paper border border-transparent'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>ЗАСВАР ҮЙЛЧИЛГЭЭ</span>
          </button>

          {/* Sub-site 4: Норм дүрэм, техникийн шийдлүүд */}
          <button
            id="nav-tab-standards"
            title="Норм дүрэм, техникийн шийдлүүд"
            aria-label="Норм дүрэм, техникийн шийдлүүд"
            onClick={() => onSelectSection('standards')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer ${
              activeSection === 'standards'
                ? 'bg-brand text-white shadow-sm border border-transparent'
                : 'text-ink-dark-muted hover:text-brand hover:bg-paper border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>НОРМ ДҮРЭМ</span>
          </button>

        </nav>

        {/* Баруун талын үйлдэл: сагс */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Cart button */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className={`relative p-3 lg:p-2.5 rounded-lg bg-paper-3 hover:bg-paper border text-brand transition hover:border-brand cursor-pointer ${
              bump ? 'border-brand animate-cart-ring' : 'border-line-light'
            }`}
            title="Сэлбэгийн сагс харах"
            aria-label={cartCount > 0 ? `Сэлбэгийн сагс харах (${cartCount} бараа)` : 'Сэлбэгийн сагс харах'}
          >
            <ShoppingCart className="w-5 h-5 lg:w-4 lg:h-4" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 bg-danger text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                  bump ? 'animate-cart-bump' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>

    {/*
      * header-ийн гадна: backdrop-blur нь доторх fixed элементийг header-ээр
      * хязгаарладаг тул доод цэс дэлгэцийн ёроолд биш header дотор гарна.
      */}
    <MobileNav activeSection={activeSection} onSelectSection={onSelectSection} />
    </>
  );
};

const MOBILE_ITEMS: { section: ActiveSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { section: 'parts', label: 'Сэлбэг', icon: ShoppingBag },
  { section: 'service', label: 'Засвар', icon: Wrench },
  { section: 'standards', label: 'Норм дүрэм', icon: BookOpen },
];

/**
 * Утас, таблетын доод цэс — эрхий хуруугаар хүрэхэд ойр, нэр бүхий товчнууд.
 * Дээд цэсний жижиг дүрснүүдийг орлоно. Сагс дээд баруун буланд үлдэнэ.
 */
const MobileNav: React.FC<{
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
}> = ({ activeSection, onSelectSection }) => (
  <nav
    id="mobile-nav"
    aria-label="Үндсэн цэс"
    className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-paper/95 backdrop-blur-md border-t border-line-light shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
  >
    <div className="grid grid-cols-4 h-16 max-w-xl mx-auto">
      {MOBILE_ITEMS.map(({ section, label, icon: Icon }) => {
        const active = activeSection === section;
        return (
          <button
            key={section}
            id={`mnav-${section}`}
            type="button"
            onClick={() => onSelectSection(section)}
            aria-current={active ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-bold cursor-pointer transition ${
              active ? 'text-brand' : 'text-ink-dark-muted hover:text-brand'
            }`}
          >
            {active && <span className="absolute top-0 inset-x-5 h-0.5 rounded-full bg-brand" />}
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        );
      })}
      <a
        id="mnav-call"
        href="tel:+97677232222"
        className="flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-red-700"
      >
        <PhoneCall className="w-5 h-5" />
        <span>Залгах</span>
      </a>
    </div>
  </nav>
);
