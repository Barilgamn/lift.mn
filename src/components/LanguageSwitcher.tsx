import React from 'react';
import { Languages } from 'lucide-react';
import { LANGS, currentLang, setLang } from '../lib/translate';

/** MN · EN · 中文 — Google автомат орчуулга (src/lib/translate.ts) */
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const active = currentLang();
  return (
    <div
      role="group"
      aria-label="Хэл сонгох / Language"
      translate="no"
      className={`notranslate inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-paper-3 border border-line-light ${className}`}
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
          className={`h-9 min-w-9 px-2 rounded-md text-[11px] sm:text-xs font-bold whitespace-nowrap cursor-pointer transition ${
            active === l.code ? 'bg-brand text-white shadow-sm' : 'text-ink-dark-muted hover:text-brand'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
