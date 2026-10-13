import React from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Clock,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { ActiveSection } from '../types';
import { LiftMnLogo } from './LiftMnLogo';
import { CONTACT_EMAIL, SHOW_DELTA_LIFT, SITE_NAME } from '../config';

interface FooterProps {
  onSelectSection: (section: ActiveSection) => void;
}

/** Хөл хэсгийн холбоосуудад нэг загвар */
const linkClass =
  'flex items-center gap-1.5 py-1.5 lg:py-0.5 text-left cursor-pointer text-ink-dark-muted hover:text-brand transition-colors';

/** Баганын гарчиг */
const ColumnTitle: React.FC<{ accent?: 'brand' | 'danger'; children: React.ReactNode }> = ({
  accent = 'brand',
  children,
}) => (
  <h3
    className={`text-sm font-bold text-ink-dark uppercase tracking-wider mb-4 border-l-2 pl-2 ${
      accent === 'danger' ? 'border-danger' : 'border-brand'
    }`}
  >
    {children}
  </h3>
);

export const Footer: React.FC<FooterProps> = ({ onSelectSection }) => {
  return (
    <footer className="bg-paper border-t border-line-light text-ink-dark-muted pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* 1. Компани */}
          <div>
            <div className="mb-4">
              <LiftMnLogo className="h-8" beta="sm" />
            </div>
            <p className="text-xs leading-relaxed mb-4">
              {SHOW_DELTA_LIFT
                ? '"DELTA LIFT" ХХК нь Монгол Улсын барилгын салбарт найдвартай ажиллагаатай лифт, эскалатор нийлүүлэлт, угсралт, 24/7 засвар үйлчилгээ болон сэлбэг хангамжийн чиглэлээр тэргүүлэгч байгууллага юм.'
                : `${SITE_NAME} нь лифт, эскалаторын 24/7 засвар үйлчилгээ болон сэлбэг хэрэгслийн хангамжийн нэгдсэн цахим портал юм.`}
            </p>
            {/* Тусгай зөвшөөрөл нь DELTA LIFT компанийнх тул түүнтэй хамт нуусан */}
            {SHOW_DELTA_LIFT && (
              <div className="flex items-center gap-2 text-xs text-brand font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Тусгай зөвшөөрөл № БХБЯ-ЛЗ-2018/044</span>
              </div>
            )}
          </div>

          {/* 2. Үндсэн цэсүүд */}
          <div>
            <ColumnTitle>Үндсэн цэсүүд</ColumnTitle>
            <ul className="space-y-2.5 text-xs">
              {SHOW_DELTA_LIFT && (
                <li>
                  <button onClick={() => onSelectSection('delta-lift')} className={linkClass}>
                    <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span>DELTA LIFT (Брэнд, Төслүүд, Хамтрагчид)</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onSelectSection('parts')} className={linkClass}>
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Сэлбэг хэрэгсэл (Онлайн дэлгүүр, Захиалга)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectSection('service')} className={linkClass}>
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Засвар үйлчилгээ (Хүсэлт, Цаг захиалга, Тариф)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectSection('standards')} className={linkClass}>
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Норм дүрэм, техникийн шийдлүүд</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('portal')}
                  className={`${linkClass} font-semibold text-brand`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Үндсэн портал хуудас руу очих</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Аюулгүй ажиллагаа */}
          <div>
            <ColumnTitle>Аюулгүй ажиллагаа</ColumnTitle>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Мэргэшсэн инженер техникийн шуурхай баг</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Үйлдвэрийн албан ёсны баталгаат нийлүүлэлт</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-danger shrink-0" />
                <span>24/7 Лифт гацсан хүний шуурхай диспетчер</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
                <span>Бүх сэлбэгт 6-24 сарын албан ёсны баталгаа</span>
              </li>
            </ul>
          </div>

          {/* 4. Шуурхай холбоо */}
          <div>
            <ColumnTitle accent="danger">Шуурхай холбоо</ColumnTitle>
            <div className="space-y-3 text-xs">
              {/*
                * Улаан товчийг хасаж, энгийн дуудлагын холбоос болгов.
                * Дугаар нь хэвээрээ — утаснаас шууд залгаж болно.
                */}
              <a
                href="tel:+97677232222"
                className="block p-3 rounded-xl bg-paper-3 border border-line-light hover:border-brand transition-colors"
              >
                <div className="text-[11px] font-bold text-ink-dark-muted uppercase tracking-wide">
                  24/7 Лифт гацсан дуудлага
                </div>
                <div className="text-lg font-black text-ink-dark font-mono mt-0.5">
                  (+976) 7723-2222
                </div>
                <div className="text-[10px] text-ink-dark-subtle mt-0.5">
                  Яаралтай тусламжийн инженерийн шуурхай бригад
                </div>
              </a>

              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand shrink-0" />
                <a href="tel:+97677232222" className="py-2 -my-2 hover:text-brand transition-colors font-mono">
                  Утас: (+976) 7723-2222
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>
                  И-мэйл:{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand underline">
                    {CONTACT_EMAIL}
                  </a>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Union Building, Unesco St, Sunroad-62, 1st khoroo, Sukhbaatar district,
                  Ulaanbaatar, Mongolia
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Доод мөр */}
        <div className="pt-8 border-t border-line-light flex flex-wrap items-center justify-between gap-4 text-xs text-ink-dark-subtle">
          <div>
            © 2026{' '}
            {SHOW_DELTA_LIFT && (
              <>
                <span className="text-ink-dark font-semibold">DELTA LIFTS</span> ·{' '}
              </>
            )}
            <span className="text-brand font-semibold">{SITE_NAME}</span>. Бүх эрх хуулиар
            хамгаалагдсан.
          </div>
          {/* Хуудас нь хараахан бэлэн биш тул холбоос биш, энгийн бичвэр */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-dark-muted">
            <span>Нууцлалын бодлого</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>Үйлчилгээний нөхцөл</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>Аюулгүй ажиллагааны зааварчилгаа</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
