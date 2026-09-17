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
import { DeltaLiftsLogo } from './DeltaLiftsLogo';

interface FooterProps {
  onSelectSection: (section: ActiveSection) => void;
  onOpenEmergency: () => void;
}

/** Хөл хэсгийн холбоосуудад нэг загвар */
const linkClass =
  'flex items-center gap-1.5 text-left cursor-pointer text-ink-dark-muted hover:text-brand transition-colors';

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

export const Footer: React.FC<FooterProps> = ({ onSelectSection, onOpenEmergency }) => {
  return (
    <footer className="bg-paper border-t border-line-light text-ink-dark-muted pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* 1. Компани */}
          <div>
            <div className="mb-4">
              <DeltaLiftsLogo size="md" showText={true} />
            </div>
            <p className="text-xs leading-relaxed mb-4">
              "DELTA LIFT" ХХК нь Монгол Улсын барилгын салбарт найдвартай ажиллагаатай лифт,
              эскалатор нийлүүлэлт, угсралт, 24/7 засвар үйлчилгээ болон сэлбэг хангамжийн
              чиглэлээр тэргүүлэгч байгууллага юм.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Тусгай зөвшөөрөл № БХБЯ-ЛЗ-2018/044</span>
            </div>
          </div>

          {/* 2. Үндсэн цэсүүд */}
          <div>
            <ColumnTitle>Үндсэн цэсүүд</ColumnTitle>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onSelectSection('delta-lift')} className={linkClass}>
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>DELTA LIFT (Брэнд, Төслүүд, Хамтрагчид)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectSection('service')} className={linkClass}>
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Засвар үйлчилгээ (Хүсэлт, Цаг захиалга, Тариф)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectSection('parts')} className={linkClass}>
                  <ChevronRight className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Сэлбэг хэрэгсэл (Онлайн дэлгүүр, Захиалга)</span>
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
              <button
                type="button"
                onClick={onOpenEmergency}
                className="w-full text-left p-3 rounded-xl bg-red-50 border border-red-200 hover:border-danger transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-red-700 uppercase tracking-wide">
                  24/7 Лифт гацсан дуудлага
                </div>
                <div className="text-lg font-black text-ink-dark font-mono mt-0.5">
                  (+976) 7723-2222
                </div>
                <div className="text-[10px] text-red-700 mt-0.5">
                  Яаралтай тусламжийн инженерийн шуурхай бригад
                </div>
              </button>

              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand shrink-0" />
                <a href="tel:+97677232222" className="hover:text-brand transition-colors font-mono">
                  Утас: (+976) 7723-2222
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>
                  И-мэйл:{' '}
                  <a href="mailto:info@lift.mn" className="hover:text-brand underline">
                    info@lift.mn
                  </a>
                  ,{' '}
                  <a href="mailto:sales@lift.mn" className="hover:text-brand underline">
                    sales@lift.mn
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
            © 2026 <span className="text-ink-dark font-semibold">DELTA LIFTS</span> ·{' '}
            <span className="text-brand font-semibold">LIFT.MN</span>. Бүх эрх хуулиар
            хамгаалагдсан.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-ink-dark-muted hover:text-brand cursor-pointer transition-colors">Нууцлалын бодлого</span>
            <span aria-hidden="true">·</span>
            <span className="text-ink-dark-muted hover:text-brand cursor-pointer transition-colors">Үйлчилгээний нөхцөл</span>
            <span aria-hidden="true">·</span>
            <span className="text-ink-dark-muted hover:text-brand cursor-pointer transition-colors">
              Аюулгүй ажиллагааны зааварчилгаа
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
