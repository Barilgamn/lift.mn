import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { LANGS, currentLang, setLang } from '../lib/translate';

/**
 * MN · EN · 中文 — Google автомат орчуулга (src/lib/translate.ts)
 *
 *   - sm ба түүнээс өргөн: гурван товч зэрэгцэн харагдана
 *   - гар утсанд: зөвхөн сонгосон хэл ("MN ▾"); дарахад бусад нь цэсээр гарна
 */
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const active = currentLang();
  const activeLang = LANGS.find((l) => l.code === active) ?? LANGS[0];
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Цэсийн гадна дарах, Escape — хаана
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div translate="no" className={`notranslate ${className}`}>
      {/* Өргөн дэлгэц — гурван товч */}
      <div
        role="group"
        aria-label="Хэл сонгох / Language"
        className="hidden sm:inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-paper-3 border border-line-light"
      >
        <Languages className="hidden xl:block w-4 h-4 mx-1 text-ink-dark-subtle" aria-hidden="true" />
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            title={l.title}
            aria-pressed={active === l.code}
            onClick={() => setLang(l.code)}
            className={`h-9 min-w-9 px-2 rounded-md text-xs font-bold whitespace-nowrap cursor-pointer transition ${
              active === l.code ? 'bg-brand text-white shadow-sm' : 'text-ink-dark-muted hover:text-brand'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Гар утас — зөвхөн сонгосон хэл, дарахад цэс */}
      <div ref={boxRef} className="relative sm:hidden">
        <button
          id="lang-mobile"
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Хэл: ${activeLang.title} / Language`}
          onClick={() => setOpen((v) => !v)}
          className={`h-9 pl-2.5 pr-1.5 rounded-lg border text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition ${
            open ? 'bg-brand text-white border-brand' : 'bg-paper-3 text-ink-dark border-line-light'
          }`}
        >
          <span lang={activeLang.code}>{activeLang.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {open && (
          <ul
            role="menu"
            aria-label="Хэл сонгох"
            className="absolute right-0 top-full mt-1.5 z-50 w-40 p-1 rounded-xl bg-white border border-line-light shadow-xl shadow-slate-900/15"
          >
            {LANGS.map((l) => (
              <li key={l.code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active === l.code}
                  lang={l.code}
                  onClick={() => { setOpen(false); setLang(l.code); }}
                  className={`w-full h-10 px-2.5 rounded-lg flex items-center gap-2.5 text-left text-sm cursor-pointer ${
                    active === l.code ? 'bg-sky-50 text-brand font-bold' : 'text-ink-dark hover:bg-paper-2'
                  }`}
                >
                  <span className="w-8 text-xs font-black">{l.label}</span>
                  <span className="flex-1 text-xs text-ink-dark-muted">{l.title}</span>
                  {active === l.code && <Check className="w-4 h-4" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
