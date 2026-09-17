import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  ChevronRight 
} from 'lucide-react';
import { ActiveSection } from '../types';
import { DeltaLiftsLogo } from './DeltaLiftsLogo';

interface FooterProps {
  onSelectSection: (section: ActiveSection) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection, onOpenEmergency }) => {
  return (
    <footer className="bg-[#040C1A] border-t border-sky-950/60 text-ink-muted pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Delta Lift LLC */}
          <div>
            <div className="mb-4">
              <DeltaLiftsLogo variant="official" size="md" showText={true} textClassName="text-brand-bright" />
            </div>
            <p className="text-xs leading-relaxed text-brand-soft/70 mb-4">
              "DELTA LIFT" ХХК нь Монгол Улсын барилгын салбарт найдвартай ажиллагаатай лифт, эскалатор нийлүүлэлт, угсралт, 24/7 засвар үйлчилгээ болон сэлбэг хангамжийн чиглэлээр тэргүүлэгч байгууллага юм.
            </p>
            <div className="flex items-center gap-2 text-xs text-accent font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Тусгай зөвшөөрөл № БХБЯ-ЛЗ-2018/044</span>
            </div>
          </div>

          {/* Col 2: The 3 Main Portals */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#005C9E] pl-2">
              Үндсэн Цэсүүд
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onSelectSection('delta-lift')}
                  className="hover:text-brand-bright transition flex items-center gap-1.5 cursor-pointer text-left text-brand-soft/80"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-accent" />
                  <span>DELTA LIFT (Брэнд, Төслүүд, Хамтрагчид)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectSection('service')}
                  className="hover:text-brand-bright transition flex items-center gap-1.5 cursor-pointer text-left text-brand-soft/80"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-accent" />
                  <span>Засвар үйлчилгээ (Хүсэлт, Цаг захиалга, Тариф)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectSection('parts')}
                  className="hover:text-brand-bright transition flex items-center gap-1.5 cursor-pointer text-left text-brand-soft/80"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-accent" />
                  <span>Сэлбэг хэрэгсэл (Онлайн дэлгүүр, Захиалга)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectSection('portal')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer text-left font-semibold text-brand-bright/60"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Үндсэн Портал хуудас руу очих</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Reliability & Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#005C9E] pl-2">
              Аюулгүй Ажиллагаа
            </h3>
            <ul className="space-y-2.5 text-xs text-brand-soft/70">
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Мэргэшсэн инженер техникийн шуурхай баг</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Үйлдвэрийн албан ёсны баталгаат нийлүүлэлт</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>24/7 Лифт гацсан хүний шуурхай диспетчер</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-bright shrink-0" />
                <span>Бүх сэлбэгт 6-24 сарын албан ёсны баталгаа</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              Шуурхай Холбоо
            </h3>
            <div className="space-y-3 text-xs">
              <div 
                onClick={onOpenEmergency}
                className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 hover:border-red-500 transition cursor-pointer"
              >
                <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">
                  24/7 Лифт Гацсан Дуудлага
                </div>
                <div className="text-lg font-black text-white font-mono mt-0.5">
                  (+976) 7723-2222
                </div>
                <div className="text-[10px] text-red-300">
                  Яаралтай тусламжийн инженерийн шуурхай бригад
                </div>
              </div>

              <div className="flex items-center gap-2 text-brand-soft/80">
                <PhoneCall className="w-4 h-4 text-brand-bright shrink-0" />
                <a href="tel:+97677232222" className="hover:text-white transition font-mono">
                  Утас: (+976) 7723-2222
                </a>
              </div>
              <div className="flex items-center gap-2 text-brand-soft/80">
                <Mail className="w-4 h-4 text-brand-bright shrink-0" />
                <span>
                  И-мэйл: <a href="mailto:info@lift.mn" className="hover:text-white underline">info@lift.mn</a>, <a href="mailto:sales@lift.mn" className="hover:text-white underline">sales@lift.mn</a>
                </span>
              </div>
              <div className="flex items-start gap-2 text-brand-soft/80">
                <MapPin className="w-4 h-4 text-brand-bright shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Union Building, Unesco St, Sunroad-62, 1st khoroo, Sukhbaatar district, Ulaanbaatar, Mongolia
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-sky-950/60 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-bright/60">
          <div>
            © 2026 <span className="text-white font-semibold">DELTA LIFTS</span> · <span className="text-accent font-semibold">LIFT.MN</span>. Бүх эрх хуулиар хамгаалагдсан.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Нууцлалын бодлого</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Үйлчилгээний нөхцөл</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Аюулгүй ажиллагааны зааварчилгаа</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
