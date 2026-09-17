import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  PhoneCall, 
  BadgeCheck, 
  HelpCircle,
  Truck
} from 'lucide-react';
import { TARIFF_PLANS, INITIAL_TICKETS } from '../data/mockData';
import { ServiceTicket } from '../types';

interface ServiceViewProps {
  onOpenEmergency: () => void;
}

export const ServiceView: React.FC<ServiceViewProps> = ({ onOpenEmergency }) => {
  const [activeTab, setActiveTab] = useState<'request' | 'booking' | 'tariffs' | 'track'>('request');
  const [tickets, setTickets] = useState<ServiceTicket[]>(INITIAL_TICKETS);
  
  // Service Request Form State
  const [clientType, setClientType] = useState('СӨХ');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Хан-Уул дүүрэг');
  const [address, setAddress] = useState('');
  const [brand, setBrand] = useState('OTIS');
  const [issueType, setIssueType] = useState('Хаалга гацах / Нээгдэхгүй байх');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('high');
  const [details, setDetails] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<ServiceTicket | null>(null);

  // Booking Form State
  const [bookingService, setBookingService] = useState('Сар тутмын хуваарьт техникийн үйлчилгээ');
  const [bookingDate, setBookingDate] = useState('2026-09-18');
  const [bookingTime, setBookingTime] = useState('10:00 - 12:00');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Ticket Tracker State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<ServiceTicket | null>(null);
  const [searchError, setSearchError] = useState(false);

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address || !contactName) {
      alert('Шаардлагатай талбаруудыг бүрэн бөглөнө үү!');
      return;
    }

    const newTicket: ServiceTicket = {
      id: `DL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('mn-MN'),
      clientType,
      contactName,
      phone,
      district,
      address,
      brand,
      issueType,
      urgency,
      details,
      status: 'Хүлээн авсан',
      assignedEngineer: 'Хуваарилагдаж байна...',
      estimatedArrival: urgency === 'high' ? '30 минутын дотор' : 'Өнөөдөртөө'
    };

    setTickets([newTicket, ...tickets]);
    setSubmittedTicket(newTicket);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPhone) {
      alert('Утасны дугаараа оруулна уу!');
      return;
    }
    setBookingSuccess(true);
  };

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTicketId.trim().toUpperCase();
    const found = tickets.find(t => t.id.toUpperCase() === query);
    if (found) {
      setSearchedTicket(found);
      setSearchError(false);
    } else {
      setSearchedTicket(null);
      setSearchError(true);
    }
  };

  return (
    <div id="service-view" className="w-full bg-surface-1 text-ink min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="relative py-14 border-b border-line overflow-hidden bg-[#071326]">
        {/* Authentic Service Background Photo Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: `url('/images/service_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#051329] via-[#051329]/90 to-[#051329]/75 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-xs font-bold uppercase tracking-wider mb-4">
                <Wrench className="w-3.5 h-3.5" />
                <span>Засвар, Оношилгоо, Үзлэг</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
                Лифтний Засвар Үйлчилгээ
              </h1>
              
              <p className="text-sm md:text-base text-ink-muted leading-relaxed">
                Гэнэтийн эвдрэлийн дуудлага, хуваарьт үзлэг оношилгооны цаг захиалга, СӨХ болон байгууллагын сар бүрийн гэрээт үйлчилгээний тарифын нэгдсэн систем.
              </p>
            </div>

            {/* Emergency Quick Action Box */}
            <div className="p-6 rounded-2xl bg-red-950/40 border-2 border-red-600/60 shadow-xl shadow-red-950/40 max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center text-red-400 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold text-red-300 tracking-wider">
                    НЭН ЯАРАЛТАЙ ДУУДЛАГА
                  </div>
                  <div className="text-lg font-black text-white">
                    Лифтэнд хүн гацсан уу?
                  </div>
                </div>
              </div>
              <p className="text-xs text-ink-muted mb-4">
                24 цагийн диспетчер 15-30 минутын дотор хамгийн ойр яваа инженерийн багийг илгээнэ.
              </p>
              <button
                id="service-emergency-action-btn"
                onClick={onOpenEmergency}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Яаралтай дуудлага өгөх ((+976) 7723-2222)</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-10 border-b border-line pb-2 text-xs sm:text-sm font-bold">
            <button
              id="tab-request"
              onClick={() => setActiveTab('request')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'request'
                  ? 'bg-brand text-white'
                  : 'bg-surface-2 text-ink-muted hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Засварын хүсэлт илгээх</span>
            </button>

            <button
              id="tab-booking"
              onClick={() => setActiveTab('booking')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'booking'
                  ? 'bg-brand text-white'
                  : 'bg-surface-2 text-ink-muted hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Цаг захиалах (Үзлэг/Оношилгоо)</span>
            </button>

            <button
              id="tab-tariffs"
              onClick={() => setActiveTab('tariffs')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'tariffs'
                  ? 'bg-brand text-white'
                  : 'bg-surface-2 text-ink-muted hover:text-white'
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              <span>Засварын хөлс & Тариф</span>
            </button>

            <button
              id="tab-track"
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-brand text-white'
                  : 'bg-surface-2 text-ink-muted hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Хүсэлтийн явц шалгах</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Main Tab Contents */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: ЗАХИАЛГЫН ХҮСЭЛТ ИЛГЭЭХ */}
        {activeTab === 'request' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-6 md:p-8 rounded-2xl bg-surface-2 border border-line shadow-2xl">
              
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Лифтний Засварын Хүсэлт Илгээх Маягт
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Эвдрэл, доголдлын мэдээллийг илгээснээр манай инженерүүд дуудлагыг системд бүртгэж, шуурхай холбогдох болно.
                </p>
              </div>

              {submittedTicket ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-bright uppercase tracking-wider">
                    ТИКЕТ ДУГААР: {submittedTicket.id}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1 mb-2">
                    Таны хүсэлт амжилттай бүртгэгдлээ!
                  </h3>
                  <p className="text-xs text-ink-muted max-w-md mx-auto mb-6 leading-relaxed">
                    Бид хүсэлтийг хүлээн авч, тухайн дүүрэг хариуцсан засварын инженерт дамжууллаа. Таны <strong className="text-brand-bright">{submittedTicket.phone}</strong> дугаарт холбогдох болно.
                  </p>

                  <div className="p-4 rounded-xl bg-surface-1 border border-line text-left text-xs max-w-md mx-auto space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Хаяг:</span>
                      <span className="text-white font-medium">{submittedTicket.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Эвдрэлийн төрөл:</span>
                      <span className="text-brand-bright font-medium">{submittedTicket.issueType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Төлөв:</span>
                      <span className="text-emerald-400 font-bold">{submittedTicket.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Очих баримжаа хугацаа:</span>
                      <span className="text-white font-semibold">{submittedTicket.estimatedArrival}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setDetails('');
                        setAddress('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-surface-3 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
                    >
                      Шинэ хүсэлт илгээх
                    </button>
                    <button
                      onClick={() => {
                        setSearchTicketId(submittedTicket.id);
                        setSearchedTicket(submittedTicket);
                        setActiveTab('track');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase cursor-pointer"
                    >
                      Явцыг шууд шалгах
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
                  
                  {/* Client Type */}
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1.5">
                      Захиалагчийн статус *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['СӨХ', 'Бизнес / Оффис', 'Түрээслэгч', 'Иргэн'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setClientType(t)}
                          className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer ${
                            clientType === t 
                              ? 'bg-brand/20 border-brand text-brand-bright' 
                              : 'bg-surface-3 border-line text-ink-muted'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Холбоо барих хүний нэр *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Жишээ: Б. Болд (СӨХ-ийн дарга)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Утасны дугаар *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="9911-XXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white font-mono focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* District & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Дүүрэг *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
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
                      <label className="block font-semibold text-ink-muted mb-1">
                        Байршил, Хотхон, Байр, Орц *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Жишээ: 15-р хороо, Рапид Харш 21-р байр 2-р орц"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Brand & Issue type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Лифтний брэнд / загвар
                      </label>
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      >
                        <option value="OTIS">OTIS Elevator</option>
                        <option value="Mitsubishi">Mitsubishi Electric</option>
                        <option value="Hyundai">Hyundai Elevator</option>
                        <option value="Sigma">Sigma / LG</option>
                        <option value="Delta">Delta Line / Бусад</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Эвдрэлийн төрөл *
                      </label>
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      >
                        <option value="Хаалга гацах / Нээгдэхгүй байх">Хаалга гацах / Нээгдэхгүй байх</option>
                        <option value="Лифт бүрэн ажиллахгүй зогссон">Лифт бүрэн ажиллахгүй зогссон</option>
                        <option value="Хөдлөх үед ердийн бус чимээ, доргио гарах">Хөдлөх үед ердийн бус чимээ, доргио гарах</option>
                        <option value="Товчлуур / Дэлгэц ажиллахгүй">Товчлуур / Дэлгэц ажиллахгүй</option>
                        <option value="Давхартайгаа зөрж зогсох">Давхартайгаа зөрж зогсох</option>
                        <option value="Урсгал засвар, тосолгоо хийлгэх">Урсгал засвар, тосолгоо хийлгэх</option>
                      </select>
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Яаралтай зэрэг
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgency('high')}
                        className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                          urgency === 'high' 
                            ? 'bg-red-600/30 border-red-500 text-red-300' 
                            : 'bg-surface-3 border-line text-ink-muted'
                        }`}
                      >
                        Яаралтай (Өнөөдөр)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('medium')}
                        className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                          urgency === 'medium' 
                            ? 'bg-brand/20 border-brand text-brand-bright' 
                            : 'bg-surface-3 border-line text-ink-muted'
                        }`}
                      >
                        Энгийн (24 цагт)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('low')}
                        className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                          urgency === 'low' 
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                            : 'bg-surface-3 border-line text-ink-muted'
                        }`}
                      >
                        Төлөвлөгөөт үзлэг
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Эвдрэлийн дэлгэрэнгүй тайлбар
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Лифтний нөхцөл байдал, ямар код зааж байгаа эсвэл хэзээнээс эхэлснийг бичнэ үү..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand/30"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Засварын дуудлага / хүсэлт илгээх</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: ЦАГ ЗАХИАЛАХ (BOOKING) */}
        {activeTab === 'booking' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-6 md:p-8 rounded-2xl bg-surface-2 border border-line shadow-2xl">
              
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Үзлэг Оношилгооны Цаг Захиалах
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Урьдчилан сэргийлэх техникийн үзлэг, кабель хэмжилт, тоормос тохируулга эсвэл жилийн улсын хяналтын үзлэгт бэлтгэх инженер багийн цаг товлох.
                </p>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    Цаг амжилттай товлогдлоо!
                  </h3>
                  <p className="text-xs text-ink-muted max-w-md mx-auto mb-6">
                    Таны сонгосон <strong className="text-brand-bright">{bookingDate}</strong> өдрийн <strong className="text-brand-bright">{bookingTime}</strong> цагт манай оношилгооны тусгай инженер томилогдлоо.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Өөр цаг захиалах
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                  
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Үйлчилгээний төрөл *
                    </label>
                    <select
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                    >
                      <option value="Сар тутмын хуваарьт техникийн үйлчилгээ">Сар тутмын хуваарьт техникийн үйлчилгээ (СӨХ гэрээ)</option>
                      <option value="1 удаагийн компьютерийн оношилгоо">1 удаагийн компьютерийн оношилгоо & алдаа тайлах</option>
                      <option value="Жилийн улсын хяналтын үзлэгт бэлтгэх">Жилийн улсын хяналтын үзлэгт бэлтгэх</option>
                      <option value="Тросс кабель, тоормосны хэмжилт шалгалт">Тросс кабель, тоормосны хэмжилт шалгалт</option>
                      <option value="Лифт шинэчлэх, модернизаци хийх үнэлгээ">Лифт шинэчлэх, модернизаци хийх үнэлгээ</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Үзлэг хийх өдөр *
                      </label>
                      <input 
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Тохиромжтой цагийн завсар *
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      >
                        <option value="09:00 - 11:00">09:00 - 11:00 (Өглөө)</option>
                        <option value="11:00 - 13:00">11:00 - 13:00 (Үдээс өмнө)</option>
                        <option value="14:00 - 16:00">14:00 - 16:00 (Үдээс хойш)</option>
                        <option value="16:00 - 18:00">16:00 - 18:00 (Орой)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Холбогдох утас *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="9911-XXXX"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white font-mono focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink-muted mb-1">
                        Барилгын хаяг, байр *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Жишээ: Сүхбаатар 1-р хороо, 5-р байр"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-white focus:border-brand-bright focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand/30"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Үзлэгийн цаг захиалгыг илгээх</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: ЗАСВАРЫН ХӨЛС & ТАРИФ */}
        {activeTab === 'tariffs' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="text-xs font-bold text-brand-bright uppercase tracking-widest mb-2">
                ИЛ ТОД ҮНЭ ТАРИФ
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                Засвар Үйлчилгээний Хөлс ба Багцууд
              </h2>
              <p className="text-xs md:text-sm text-ink-muted">
                Орон сууцны СӨХ, бизнес ба оффис цамхгуудад зориулсан шат дараалсан, уян хатан үнийн санал.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TARIFF_PLANS.map((tariff) => (
                <div 
                  key={tariff.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    tariff.popular 
                      ? 'bg-surface-2 border-2 border-accent shadow-2xl shadow-amber-500/10' 
                      : 'bg-surface-2/70 border border-line hover:border-line'
                  }`}
                >
                  <div>
                    {tariff.popular && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent text-neutral-950 font-black text-[10px] uppercase tracking-wider mb-3">
                        Эрэлт ихтэй
                      </span>
                    )}

                    <h3 className="text-base font-black text-white mb-1">
                      {tariff.title}
                    </h3>
                    <div className="text-xs text-ink-muted mb-4">
                      {tariff.target}
                    </div>

                    <div className="p-4 rounded-xl bg-surface-1 border border-line mb-6">
                      <div className="text-2xl md:text-3xl font-black text-accent font-mono">
                        {tariff.price}
                      </div>
                      <div className="text-[11px] text-ink-subtle">
                        {tariff.period}
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-ink-muted mb-6">
                      {tariff.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-bright shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setBookingService(tariff.title);
                      setActiveTab('booking');
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                      tariff.popular 
                        ? 'bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/30' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Гэрээ байгуулах / Захиалах
                  </button>
                </div>
              ))}
            </div>

            {/* Tariff Notes */}
            <div className="p-6 rounded-2xl bg-surface-2/60 border border-line text-xs text-ink-muted space-y-2 max-w-4xl mx-auto">
              <div className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-bright" />
                <span>ТАРИФЫН ТУХАЙ ТАЙЛБАР БА САНАМЖ:</span>
              </div>
              <p>
                1. СӨХ болон байгууллагатай хийсэн гэрээний хүрээнд 24/7 гацсан хүний шуурхай дуудлага үнэ төлбөргүй багтана.
              </p>
              <p>
                2. Засварын явцад шаардагдах үндсэн эд анги, сэлбэг (мотор, инвертер, кабель гэх мэт)-ийн үнэ тарифын сарын суурь хөлсөнд орохгүй ба гэрээт байгууллагууд 10-20%-ийн хөнгөлөлттэй үнээр нийлүүлүүлнэ.
              </p>
              <p>
                3. НӨАТ-ын албан ёсны цахим баримт ба акт дүгнэлтийг сар бүр олгоно.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: ХҮСЭЛТИЙН ЯВЦ ШАЛГАХ (TICKET TRACKER) */}
        {activeTab === 'track' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="p-6 md:p-8 rounded-2xl bg-surface-2 border border-line shadow-2xl">
              
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Засварын Дуудлага / Тикетийн Явц Шалгах
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Та хүсэлт илгээх үед олгогдсон тикет дугаараа оруулан инженерийн одоогийн статус, байршлыг хянана уу.
                </p>
              </div>

              <form onSubmit={handleSearchTicket} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-ink-subtle" />
                  <input 
                    type="text"
                    required
                    placeholder="Жишээ: DL-2026-9041 эсвэл DL-2026-9039"
                    value={searchTicketId}
                    onChange={(e) => setSearchTicketId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-3 border border-line text-white font-mono text-xs focus:border-brand-bright focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Шалгах
                </button>
              </form>

              {searchError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 text-center">
                  Уучлаарай, "{searchTicketId}" дугаартай тикет олдсонгүй. Дугаараа зөв эсэхийг шалгана уу.
                </div>
              )}

              {searchedTicket && (
                <div className="p-5 rounded-xl bg-surface-1 border border-line space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-ink-muted">Тикет дугаар:</span>
                      <div className="text-lg font-mono font-black text-accent">{searchedTicket.id}</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                      {searchedTicket.status}
                    </div>
                  </div>

                  {/* Visual Status Step Indicator */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
                    <div className="p-2 rounded bg-accent/20 border border-accent text-amber-300 font-bold">
                      1. Хүлээн авсан
                    </div>
                    <div className={`p-2 rounded border ${
                      searchedTicket.status !== 'Хүлээн авсан' 
                        ? 'bg-brand/20 border-brand text-brand-bright font-bold' 
                        : 'bg-surface-2 border-line text-ink-subtle'
                    }`}>
                      2. Инженер гарсан
                    </div>
                    <div className={`p-2 rounded border ${
                      searchedTicket.status === 'Оношилж байна' || searchedTicket.status === 'Амжилттай шийдвэрлэсэн'
                        ? 'bg-brand/20 border-brand text-brand-bright font-bold' 
                        : 'bg-surface-2 border-line text-ink-subtle'
                    }`}>
                      3. Оношилгоо
                    </div>
                    <div className={`p-2 rounded border ${
                      searchedTicket.status === 'Амжилттай шийдвэрлэсэн'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' 
                        : 'bg-surface-2 border-line text-ink-subtle'
                    }`}>
                      4. Дууссан
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-lg bg-surface-2 border border-line/80">
                      <span className="text-ink-subtle block">Байршил:</span>
                      <span className="font-semibold text-white">{searchedTicket.address}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-line/80">
                      <span className="text-ink-subtle block">Лифтний марк:</span>
                      <span className="font-semibold text-brand-bright">{searchedTicket.brand}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-line/80">
                      <span className="text-ink-subtle block">Томилогдсон инженер:</span>
                      <span className="font-semibold text-white">{searchedTicket.assignedEngineer}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-line/80">
                      <span className="text-ink-subtle block">Хүлээгдэж буй хугацаа:</span>
                      <span className="font-semibold text-emerald-400">{searchedTicket.estimatedArrival}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-2 text-xs text-ink-muted">
                    <span className="text-ink-muted font-semibold block mb-1">Эвдрэлийн агуулга:</span>
                    {searchedTicket.issueType} - {searchedTicket.details}
                  </div>
                </div>
              )}

              {/* Sample Tickets for easy testing */}
              <div className="mt-8 pt-6 border-t border-line">
                <div className="text-xs font-semibold text-ink-muted mb-2">
                  Идэвхтэй байгаа тикетүүд (Тест хийхдээ дарна уу):
                </div>
                <div className="flex flex-wrap gap-2">
                  {tickets.slice(0, 3).map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSearchTicketId(t.id);
                        setSearchedTicket(t);
                        setSearchError(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted text-xs font-mono border border-line cursor-pointer"
                    >
                      {t.id} ({t.status})
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </section>

    </div>
  );
};
