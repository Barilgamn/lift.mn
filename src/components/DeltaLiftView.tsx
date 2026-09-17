import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  ArrowUpRight, 
  Gauge, 
  Layers, 
  Users, 
  Building, 
  Send, 
  Info,
  Calendar,
  Sparkles,
  Search,
  PhoneCall,
  Mail,
  MapPin
} from 'lucide-react';
import { ELEVATOR_BRANDS, COMPLETED_PROJECTS, PARTNERS } from '../data/mockData';
import { ElevatorBrand, ProjectItem } from '../types';
import { DeltaLiftsLogo } from './DeltaLiftsLogo';

export const DeltaLiftView: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<ElevatorBrand | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [quoteFloors, setQuoteFloors] = useState<number>(12);
  const [quoteType, setQuoteType] = useState<string>('passenger');
  const [quoteCapacity, setQuoteCapacity] = useState<string>('1000kg');
  const [quotePhone, setQuotePhone] = useState<string>('');
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);

  const filteredProjects = projectFilter === 'all' 
    ? COMPLETED_PROJECTS 
    : COMPLETED_PROJECTS.filter(p => p.category === projectFilter);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotePhone) {
      alert('Утасны дугаараа оруулна уу!');
      return;
    }
    setQuoteSuccess(true);
  };

  return (
    <div id="delta-lift-view" className="w-full bg-[#051329] text-neutral-100 min-h-screen">
      
      {/* 1. Hero / Header Section */}
      <section className="relative py-16 md:py-24 border-b border-sky-900/40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5" />
                <span>Компаний тухай · Лифтний брэндүүд · Төслүүд</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
                DELTA LIFT <span className="text-amber-400">LLC</span>
              </h1>
              
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
                Дэлхийн шилдэг технологи бүхий лифт, эскалаторын албан ёсны нийлүүлэлт, Монгол орны цаг уурын онцлогт тохирсон найдвартай инженерчлэл.
              </p>

              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold">
                <a 
                  href="#brands-section"
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 transition flex items-center gap-2 shadow-lg shadow-amber-400/20"
                >
                  <span>Лифтний брэндүүд үзэх</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a 
                  href="#projects-section"
                  className="px-5 py-3 rounded-xl bg-[#091B36] hover:bg-neutral-800 text-white border border-sky-800/40 transition flex items-center gap-2"
                >
                  <span>Хэрэгжүүлсэн төслүүд</span>
                </a>
                <a 
                  href="#quote-section"
                  className="px-5 py-3 rounded-xl bg-[#091B36]/60 hover:bg-neutral-800 text-amber-300 border border-amber-400/30 transition flex items-center gap-2"
                >
                  <span>Үнийн санал тооцоолох</span>
                </a>
              </div>
            </div>

            {/* Right: Official DELTA LIFTS Brand Logo Spotlight Card (Matching user uploaded asset) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl bg-black/90 p-6 sm:p-8 shadow-2xl shadow-sky-950/60 border border-sky-600/30 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#0063A5] transition duration-300">
                {/* Background subtle atmospheric ambient */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#0063A5]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#F9A01B]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  {/* Брэндийн албан ёсны бүтэн лого — public/logo.webp */}
                  <div className="w-full flex items-center justify-center py-3 px-2">
                    <DeltaLiftsLogo
                      size="custom"
                      iconClassName="h-14 sm:h-16 md:h-20 drop-shadow-[0_4px_12px_rgba(0,99,165,0.4)] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-4 pt-3 border-t border-sky-900/40 w-full flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-amber-400 font-semibold">Худалдааны тэмдэг</span>
                    <span className="text-sky-400 font-semibold">Албан ёсны лого</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Компаний тухай (About Company) */}
      <section id="about-section" className="py-16 md:py-20 border-b border-sky-900/40/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                БИДНИЙ ТУХАЙ
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-5">
                Монголын Барилгын Салбарт 12+ Жилийн Найдвартай Түнш
              </h2>
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
                <p>
                  "Delta Lift" ХХК нь 2012 оноос эхлэн Монгол Улсын барилга, хот байгуулалтын салбарт зорчигчийн өндөр хурдны лифт, панорама шилэн лифт, ачаа болон автомашины лифт, эскалатор, урсдаг зам нийлүүлэх, угсрах, засварлах цогц үйлчилгээ үзүүлж байна.
                </p>
                <p>
                  Бид аюулгүй найдвартай ажиллагааг чанд эрхэмлэж, бүх төсөлд үйлдвэрийн албан ёсны баталгаатай тоног төхөөрөмж суурилуулдаг. Манай инженер техникийн баг нь Япон, Солонгос, Европын үйлдвэрүүдэд мэргэшсэн сертификаттай.
                </p>
              </div>

              {/* Core Strengths */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-[#091B36] border border-sky-900/40">
                  <ShieldCheck className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="font-bold text-white text-sm">Албан Ёсны Эрхтэй</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    OTIS, Mitsubishi, Hyundai брэндүүдийн шууд нийлүүлэгч
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#091B36] border border-sky-900/40">
                  <Award className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="font-bold text-white text-sm">Бүрэн Баталгаа</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Улсын хяналтын үзлэгт 100% тэнцэх техникийн дүгнэлт
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#091B36] border border-sky-900/40">
                  <Users className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="font-bold text-white text-sm">Мэргэшсэн Инженерүүд</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    45+ мэргэшсэн инженер техникийн шуурхай баг
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#091B36] border border-sky-900/40">
                  <Layers className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="font-bold text-white text-sm">Бүрэн Цогц Систем</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Төсөллөлтөөс эхлээд 24/7 урт хугацааны засвар хүртэл
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Graphic with Stats */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-sky-900/40 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80" 
                  alt="Delta Lift Engineers"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#091B36]/90 border border-sky-800/40/80 backdrop-blur-md">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-black text-amber-400">850+</div>
                      <div className="text-[11px] text-neutral-400 uppercase font-semibold">Суурилуулалт</div>
                    </div>
                    <div className="border-x border-sky-800/40">
                      <div className="text-2xl font-black text-white">99.9%</div>
                      <div className="text-[11px] text-neutral-400 uppercase font-semibold">Аюулгүй байдал</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-amber-400">120+</div>
                      <div className="text-[11px] text-neutral-400 uppercase font-semibold">Гэрээт СӨХ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Лифтний брэндүүд (Elevator Brands) */}
      <section id="brands-section" className="py-16 md:py-20 border-b border-sky-900/40/80 bg-[#051329]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
              МАНАЙ БҮТЭЭГДЭХҮҮН
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Дэлхийн Тэргүүлэгч Лифтний Брэндүүд
            </h2>
            <p className="text-xs md:text-sm text-neutral-400">
              Бид орон сууц, өндөр зэрэглэлийн оффис, худалдааны төв, эмнэлэгт зориулсан дэлхийн шилдэг үйлдвэрлэгчдийн лифт, эскалаторыг нийлүүлж байна.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ELEVATOR_BRANDS.map((brand) => (
              <div 
                key={brand.id}
                className="group rounded-2xl bg-[#091B36] border border-sky-900/40 hover:border-amber-400/80 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div className="relative h-48 overflow-hidden bg-[#051329]">
                  <img 
                    src={brand.image} 
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#051329]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-400 font-bold">
                    {brand.origin}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="text-xs font-bold text-amber-300">
                      {brand.category}
                    </div>
                    <div className="text-xl font-black text-white">
                      {brand.logoText}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      {brand.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#051329]/80 border border-sky-900/40 text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Даац:</span>
                        <span className="font-semibold text-neutral-300">{brand.specs.maxCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Хурд:</span>
                        <span className="font-semibold text-neutral-300">{brand.specs.speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Давхрын хязгаар:</span>
                        <span className="font-semibold text-neutral-300">{brand.specs.floors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Технологи:</span>
                        <span className="font-semibold text-amber-400">{brand.specs.tech}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-neutral-950 text-neutral-300 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Техникийн үзүүлэлт харах</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Хэрэгжүүлсэн төслүүд (Completed Projects) */}
      <section id="projects-section" className="py-16 md:py-20 border-b border-sky-900/40/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                ПОРТФОЛИО
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Хэрэгжүүлсэн Төслүүд
              </h2>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Бүх төсөл' },
                { key: 'commercial', label: 'Бизнес & Худалдаа' },
                { key: 'residential', label: 'Орон сууц' },
                { key: 'public', label: 'Эмнэлэг & Сургууль' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setProjectFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    projectFilter === tab.key
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-[#091B36] text-neutral-400 hover:text-white border border-sky-900/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div 
                key={proj.id}
                className="group rounded-2xl bg-[#091B36] border border-sky-900/40 hover:border-sky-800/40 overflow-hidden flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-[#051329]">
                  <img 
                    src={proj.image} 
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#091B36]/80 backdrop-blur-md text-[11px] font-semibold text-amber-400 border border-white/10">
                    {proj.categoryLabel}
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#091B36]/80 backdrop-blur-md text-[11px] font-mono text-white">
                    {proj.year} он
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                      {proj.title}
                    </h3>
                    <div className="text-xs text-neutral-400">
                      Захиалагч: {proj.client}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="font-semibold text-neutral-300">Байршил:</span>
                      <span>{proj.location}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#051329] border border-sky-900/40/80 text-amber-300 font-medium">
                      {proj.elevatorsInstalled}
                    </div>
                    <p className="text-neutral-400 leading-relaxed pt-1">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-sky-900/40/80 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Суурилуулсан:</span>
                    <span className="font-mono text-neutral-200 font-bold">{proj.brand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Хамтран ажиллагч байгууллагууд (Partners & Clients) */}
      <section id="partners-section" className="py-16 md:py-20 border-b border-sky-900/40/80 bg-[#051329]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
              ТҮНШҮҮД
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Хамтран Ажиллагч Байгууллагууд
            </h2>
            <p className="text-xs md:text-sm text-neutral-400">
              Монголын барилгын тэргүүлэх групп компаниуд, девелоперууд болон дэлхийн лифт үйлдвэрлэгч нартай олон жил хамтран ажиллаж байна.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((partner) => (
              <div 
                key={partner.id}
                className="p-5 rounded-xl bg-[#091B36]/80 border border-sky-900/40 hover:border-amber-400/60 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-neutral-800 border border-sky-800/40 flex items-center justify-center font-black text-sm text-amber-400 group-hover:scale-110 transition mb-3">
                  {partner.logo.slice(0, 4)}
                </div>
                <div className="text-xs font-bold text-white mb-1 group-hover:text-amber-300">
                  {partner.name}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {partner.type}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Үнийн санал авах тооцоолуур (Elevator Quote Calculator) */}
      <section id="quote-section" className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-400/40 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Шуурхай Үнийн Санал</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Барилгын Лифтний Урьдчилсан Тооцоо
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Та шинээр баригдах эсвэл засварлах барилгынхаа үзүүлэлтийг сонгон шуурхай үнийн санал авна уу.
              </p>
            </div>

            {quoteSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Үнийн саналын хүсэлт хүлээн авлаа!
                </h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto mb-6">
                  Манай төслийн инженер таны <strong className="text-amber-400">{quotePhone}</strong> дугаар луу 30 минутын дотор холбогдож, техникийн үзүүлэлт ба албан ёсны үнийн саналыг илгээх болно.
                </p>
                <button
                  onClick={() => setQuoteSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
                >
                  Дахин тооцоолох
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Elevator Type */}
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-2">
                      Лифтний төрөл
                    </label>
                    <select
                      value={quoteType}
                      onChange={(e) => setQuoteType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="passenger">Зорчигчийн лифт (Орон сууц/Оффис)</option>
                      <option value="panorama">Панорама шилэн лифт</option>
                      <option value="hospital">Эмнэлгийн орны лифт</option>
                      <option value="freight">Ачаа ба автомашины лифт</option>
                      <option value="escalator">Эскалатор / Урсдаг зам</option>
                    </select>
                  </div>

                  {/* Number of Floors */}
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-2">
                      Давхрын тоо: <span className="text-amber-400 font-bold">{quoteFloors} давхар</span>
                    </label>
                    <input 
                      type="range"
                      min="2"
                      max="45"
                      value={quoteFloors}
                      onChange={(e) => setQuoteFloors(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                      <span>2 давхар</span>
                      <span>20 давхар</span>
                      <span>45+ давхар</span>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-2">
                      Даац (Хүний тоо)
                    </label>
                    <select
                      value={quoteCapacity}
                      onChange={(e) => setQuoteCapacity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="630kg">630 кг (8 хүн) - Стандарт</option>
                      <option value="800kg">800 кг (10 хүн)</option>
                      <option value="1000kg">1000 кг (13 хүн) - Өндөр ачаалал</option>
                      <option value="1600kg">1600 кг (21 хүн) - Эмнэлэг/Ачаа</option>
                      <option value="3000kg">3000 кг (Автомашины зогсоол)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Холбоо барих утас *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="9911-XXXX"
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Төслийн нэр / Байгууллага
                    </label>
                    <input 
                      type="text"
                      placeholder="Жишээ: Хан-Уул шинэ төсөл"
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 cursor-pointer"
                  >
                    Албан ёсны үнийн санал авах хүсэлт илгээх
                  </button>
                </div>

              </form>
            )}

            {/* Official Contact Info Box */}
            <div className="mt-10 pt-8 border-t border-sky-900/40">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider text-center mb-4">
                Холбоо барих мэдээлэл
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-sky-200/90">
                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#05142B]/80 border border-sky-900/40">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">Утас</div>
                    <a href="tel:+97677232222" className="font-mono font-bold text-sm text-white hover:text-sky-300 transition">
                      (+976) 7723-2222
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#05142B]/80 border border-sky-900/40">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">И-мэйл</div>
                    <div className="font-medium text-white truncate text-xs">
                      <a href="mailto:info@lift.mn" className="hover:underline">info@lift.mn</a>, <a href="mailto:sales@lift.mn" className="hover:underline">sales@lift.mn</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#05142B]/80 border border-sky-900/40">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">Хаяг</div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Union Building, Unesco St, Sunroad-62, 1-р хороо, Сүхбаатар дүүрэг
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#091B36] border border-sky-900/40 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4 border-b border-sky-900/40 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{selectedBrand.origin}</span>
                <h3 className="text-xl font-black">{selectedBrand.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedBrand(null)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <img 
              src={selectedBrand.image} 
              alt={selectedBrand.name}
              className="w-full h-56 object-cover rounded-xl mb-4"
            />

            <div className="text-xs text-neutral-300 leading-relaxed mb-4">
              {selectedBrand.description}
            </div>

            <div className="p-4 rounded-xl bg-[#051329] border border-sky-900/40 text-xs space-y-2 mb-4">
              <div className="flex justify-between border-b border-sky-900/40/80 pb-1.5">
                <span className="text-neutral-400">Даацын хязгаар:</span>
                <span className="font-semibold text-white">{selectedBrand.specs.maxCapacity}</span>
              </div>
              <div className="flex justify-between border-b border-sky-900/40/80 pb-1.5">
                <span className="text-neutral-400">Хамгийн дээд хурд:</span>
                <span className="font-semibold text-white">{selectedBrand.specs.speed}</span>
              </div>
              <div className="flex justify-between border-b border-sky-900/40/80 pb-1.5">
                <span className="text-neutral-400">Давхрын хүчин чадал:</span>
                <span className="font-semibold text-white">{selectedBrand.specs.floors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Технологийн онцлог:</span>
                <span className="font-semibold text-amber-400">{selectedBrand.specs.tech}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBrand(null)}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Хаах
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
