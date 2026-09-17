import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  User, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  HelpCircle 
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEmergency?: (data: any) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitEmergency 
}) => {
  const [district, setDistrict] = useState('Хан-Уул дүүрэг');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [stuckCount, setStuckCount] = useState('1');
  const [hasVulnerable, setHasVulnerable] = useState(false);
  const [floor, setFloor] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) {
      alert('Утасны дугаар болон байршлын хаягийг заавал оруулна уу!');
      return;
    }
    setIsSubmitted(true);
    if (onSubmitEmergency) {
      onSubmitEmergency({
        district,
        address,
        phone,
        contactName,
        stuckCount,
        hasVulnerable,
        floor,
        notes,
        submittedAt: new Date().toLocaleTimeString('mn-MN')
      });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setAddress('');
    setPhone('');
    setContactName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        id="emergency-modal-card"
        className="relative w-full max-w-xl bg-surface-2 border-2 border-red-500/80 rounded-2xl shadow-2xl shadow-red-900/40 text-white overflow-hidden"
      >
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white animate-pulse">
              <AlertTriangle className="w-6 h-6 text-warn" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-black text-warn">
                24/7 Шуурхай Алба
              </div>
              <h2 className="text-xl font-black tracking-tight">
                Лифтэнд Хүн Гацсан Яаралтай Дуудлага
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-success border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-bold text-accent-ink uppercase tracking-widest">
                ДУУДЛАГА БҮРТГЭГДЛЭЭ #EMG-{Math.floor(1000 + Math.random() * 9000)}
              </span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">
                Шуурхай Бригад Гарлаа!
              </h3>
              <p className="text-sm text-ink-muted max-w-md mx-auto mb-6 leading-relaxed">
                Манай жижүүрийн шуурхай инженерийн баг дуудлагыг хүлээн авч, тухайн байршил руу гарлаа. <strong className="text-accent-ink">Очих хугацаа ойролцоогоор 12-18 минут.</strong>
              </p>

              {/* Crucial Safety Advice */}
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-left text-xs text-danger-soft mb-6 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-danger-soft">
                  <ShieldAlert className="w-4 h-4 text-danger-soft" />
                  <span>ЯАРАЛТАЙ САНАМЖ:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-ink-muted">
                  <li>Лифтний хаалгыг гараар хүчээр хөшиж нээхгүй байх</li>
                  <li>Лифтний агааржуулагч хэвийн ажилладаг тул агаар дутагдахгүй, тайван амьсгалах</li>
                  <li>Лифтний доторх "Alarm" хонх товчийг дарж холбоо барих</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="tel:+97677232222" 
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Диспетчертэй шууд ярих: (+976) 7723-2222</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-surface-3 hover:bg-neutral-700 text-neutral-200 font-bold text-sm cursor-pointer"
                >
                  Хаах
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Emergency Callout Box */}
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-danger-soft">
                  <PhoneCall className="w-4 h-4 shrink-0 text-danger-soft" />
                  <span>Шууд ярих шаардлагатай бол:</span>
                </div>
                <a 
                  href="tel:+97677232222" 
                  className="font-mono font-bold text-sm text-warn hover:underline px-2 py-1 rounded bg-red-900/60"
                >
                  (+976) 7723-2222
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Дүүрэг *
                  </label>
                  <select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs focus:border-accent focus:outline-none"
                  >
                    <option value="Хан-Уул дүүрэг">Хан-Уул дүүрэг</option>
                    <option value="Сүхбаатар дүүрэг">Сүхбаатар дүүрэг</option>
                    <option value="Баянзүрх дүүрэг">Баянзүрх дүүрэг</option>
                    <option value="Баянгол дүүрэг">Баянгол дүүрэг</option>
                    <option value="Чингэлтэй дүүрэг">Чингэлтэй дүүрэг</option>
                    <option value="Сонгинохайрхан дүүрэг">Сонгинохайрхан дүүрэг</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Утасны дугаар *
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="9911-XXXX эсвэл 8800-XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs placeholder:text-ink-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Байршил, Хотхон, Байр, Орц *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Жишээ: Хан-Уул 15-р хороо, Рапид Харш 22-р байр 2-р орц"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs placeholder:text-ink-subtle focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Гацсан хүний тоо
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="30"
                    value={stuckCount}
                    onChange={(e) => setStuckCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Аль давхар орчим
                  </label>
                  <input 
                    type="text"
                    placeholder="Жишээ: 7-р давхарт"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs placeholder:text-ink-subtle focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Холбоо баригчийн нэр
                  </label>
                  <input 
                    type="text"
                    placeholder="Нэр"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs placeholder:text-ink-subtle focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox"
                  id="vulnerable-check"
                  checked={hasVulnerable}
                  onChange={(e) => setHasVulnerable(e.target.checked)}
                  className="rounded border-neutral-700 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="vulnerable-check" className="text-xs text-ink-muted cursor-pointer">
                  Дотор нь бага насны хүүхэд, өндөр настан эсвэл бие муу хүн байгаа
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Нэмэлт тайлбар (Лифтний гэрэл унтарсан уу, сонин дуу гарсан уу г.м.)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Нөхцөл байдлыг товч бичнэ үү..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white text-xs placeholder:text-ink-subtle focus:border-accent focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted text-xs font-medium cursor-pointer"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Шуурхай дуудлага илгээх</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
