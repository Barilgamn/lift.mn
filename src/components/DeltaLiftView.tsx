import React, { useState } from 'react';
import {
  Accessibility,
  ArrowUpRight,
  Award,
  Building2,
  Car,
  CheckCircle,
  ClipboardCheck,
  Globe,
  Mail,
  MapPin,
  MoveHorizontal,
  MoveVertical,
  PenTool,
  PhoneCall,
  Ruler,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import {
  COMPANY,
  ENGINEERING,
  HOW_WE_WORK,
  KEY_FACTS,
  KLEEMANN,
  PHOTOS,
  PRODUCTS,
  PROJECTS,
  SERVICE_SCOPE,
} from '../data/deltaData';
import { DeltaLiftsLogo } from './DeltaLiftsLogo';

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  elevator: MoveVertical,
  escalator: TrendingUp,
  walkway: MoveHorizontal,
  parking: Car,
  accessibility: Accessibility,
};

const STEP_ICONS = [PenTool, ClipboardCheck, Ruler, Wrench];

/** Хэсгийн дээд талын жижиг гарчиг */
const SectionLabel: React.FC<{ icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }> = ({
  icon: Icon,
  children,
}) => (
  <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-[11px] font-bold uppercase tracking-wider">
    <Icon className="w-3.5 h-3.5" />
    <span>{children}</span>
  </div>
);

export const DeltaLiftView: React.FC = () => {
  const [quoteFloors, setQuoteFloors] = useState<number>(12);
  const [quoteType, setQuoteType] = useState<string>('passenger');
  const [quoteCapacity, setQuoteCapacity] = useState<string>('1000kg');
  const [quotePhone, setQuotePhone] = useState<string>('');
  const [quoteError, setQuoteError] = useState<string>('');
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotePhone.trim()) {
      setQuoteError('Утасны дугаараа оруулна уу.');
      return;
    }
    setQuoteError('');
    setQuoteSuccess(true);
  };

  return (
    <div id="delta-lift-view" className="w-full bg-surface-1 text-ink">

      {/* 1. Толгой хэсэг */}
      <section className="relative overflow-hidden border-b border-line">
        <img
          src={PHOTOS.shaftWork}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051329]/85 via-[#051329]/92 to-[#051329]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">

            <div>
              <SectionLabel icon={Award}>Албан ёсны онцгой эрхт дистрибьютер</SectionLabel>

              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                {COMPANY.legalName}
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-bold text-brand-bright">
                {COMPANY.role}
              </p>

              <p className="mt-5 text-sm sm:text-[15px] text-ink-muted leading-relaxed max-w-2xl">
                {COMPANY.intro}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Бүтээгдэхүүн үзэх
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Хэрэгжүүлсэн төслүүд
                </a>
                <a
                  href="#quote-section"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Үнийн санал авах
                </a>
              </div>
            </div>

            {/* Брэндийн лого карт */}
            <div className="relative rounded-2xl bg-white p-8 sm:p-10 shadow-2xl shadow-black/40">
              <DeltaLiftsLogo size="custom" iconClassName="w-full h-auto" />
              <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
                <span className="text-ink-subtle">Худалдааны тэмдэг</span>
                <span className="text-brand">Албан ёсны лого</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Гол үзүүлэлтүүд */}
      <section className="border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-line">
            {KEY_FACTS.map((f) => (
              <div key={f.label} className="py-7 px-4 sm:px-6 text-center">
                <dt className="text-3xl sm:text-4xl font-black text-accent tabular-nums">{f.value}</dt>
                <dd className="mt-1.5 text-[11px] sm:text-xs text-ink-muted leading-snug">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. KLEEMANN брэнд */}
      <section id="kleemann" className="py-16 md:py-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-14 items-start">

            <div>
              <SectionLabel icon={Globe}>Үйлдвэрлэгч</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                KLEEMANN
              </h2>
              <p className="mt-1.5 text-sm font-bold text-accent uppercase tracking-wider">
                {KLEEMANN.slogan}
              </p>

              <p className="mt-5 text-sm text-ink-muted leading-relaxed">{KLEEMANN.overview}</p>
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">{KLEEMANN.standard}</p>

              <div className="mt-6 p-5 rounded-xl bg-brand/10 border-l-2 border-accent">
                <p className="text-sm text-ink leading-relaxed">{KLEEMANN.innovation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src={PHOTOS.cabin}
                alt="KLEEMANN лифтний бүхээгний дотоод засал"
                className="w-full h-full object-cover rounded-xl border border-line"
                loading="lazy"
              />
              <img
                src={PHOTOS.glassLift}
                alt="Шилэн бүхээгтэй цахилгаан шат"
                className="w-full h-full object-cover rounded-xl border border-line"
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 4. Бүтээгдэхүүн */}
      <section id="products" className="py-16 md:py-20 border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel icon={Building2}>Бүтээгдэхүүн</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Бидний нийлүүлдэг төхөөрөмж
          </h2>

          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {PRODUCTS.map((p) => {
              const Icon = PRODUCT_ICONS[p.id] ?? Building2;
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-surface-3/80 border border-line hover:border-brand transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-brand/20 border border-brand/40 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-brand-bright" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white leading-snug">{p.title}</h3>
                  </div>

                  {p.variants && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.variants.map((v) => (
                        <span
                          key={v}
                          className="inline-flex items-center h-6 px-2 rounded bg-brand/15 border border-brand/30 text-[11px] text-ink-muted"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {p.note && <p className="mt-3 text-xs text-brand-bright">{p.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Инженер, техникийн алба */}
      <section id="engineering" className="py-16 md:py-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <img
                src={PHOTOS.teamTablet}
                alt="Инженерүүд удирдлагын самбар дээр оношилгоо хийж байна"
                className="col-span-2 w-full object-cover rounded-xl border border-line"
                loading="lazy"
              />
              <img
                src={PHOTOS.techPanel}
                alt="Техникч засвар үйлчилгээ хийж байна"
                className="w-full h-44 object-cover rounded-xl border border-line"
                loading="lazy"
              />
              <img
                src={PHOTOS.techRail}
                alt="Лифтний хөтөчийн шугамын угсралт"
                className="w-full h-44 object-cover rounded-xl border border-line"
                loading="lazy"
              />
            </div>

            <div className="order-1 lg:order-2">
              <SectionLabel icon={Wrench}>Хүний нөөц</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {ENGINEERING.title}
              </h2>
              <p className="mt-5 text-sm text-ink-muted leading-relaxed">{ENGINEERING.body}</p>

              <div className="mt-7 grid grid-cols-2 gap-4">
                {ENGINEERING.highlights.map((h) => (
                  <div key={h.label} className="p-5 rounded-xl bg-surface-3/80 border border-line">
                    <div className="text-3xl font-black text-accent tabular-nums">{h.value}</div>
                    <div className="mt-1 text-[11px] text-ink-muted leading-snug">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Бид хэрхэн ажилладаг */}
      <section id="how-we-work" className="py-16 md:py-20 border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">

            <div>
              <img
                src={PHOTOS.consult}
                alt="Захиалагчтай төслийн зөвлөгөө өгч буй байдал"
                className="w-full object-cover rounded-xl border border-line"
                loading="lazy"
              />
            </div>

            <div>
              <SectionLabel icon={ClipboardCheck}>Ажиллах журам</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {HOW_WE_WORK.title}
              </h2>
              <p className="mt-5 text-sm text-ink-muted leading-relaxed">{HOW_WE_WORK.body}</p>

              <ol className="mt-7 space-y-3">
                {HOW_WE_WORK.steps.map((s, i) => {
                  const Icon = STEP_ICONS[i] ?? ClipboardCheck;
                  return (
                    <li key={s.title} className="flex gap-4 p-4 rounded-xl bg-surface-3/80 border border-line">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-brand/20 border border-brand/40 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-brand-bright" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          <span className="text-accent tabular-nums mr-1.5">{i + 1}.</span>
                          {s.title}
                        </h3>
                        <p className="mt-1 text-xs text-ink-muted leading-relaxed">{s.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Засвар үйлчилгээний хамрах хүрээ */}
      <section id="service-scope" className="py-16 md:py-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-10 lg:gap-14 items-center">

            <div>
              <SectionLabel icon={ShieldCheck}>Засвар үйлчилгээ</SectionLabel>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Хамрах хүрээ
              </h2>
              <p className="mt-5 text-sm text-ink-muted leading-relaxed">
                Мэргэшсэн инженер, техникийн баг цахилгаан шат, урсдаг шатны техникийн бүрэн бүтэн
                байдал, хэвийн үйл ажиллагааг хангах дараах үйлчилгээг үзүүлэн ажилладаг.
              </p>

              <ul className="mt-6 space-y-2.5">
                {SERVICE_SCOPE.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm text-ink">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-brand-bright shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <img
              src={PHOTOS.techField}
              alt="Талбай дээрх техникийн ажил"
              className="w-full object-cover rounded-xl border border-line"
              loading="lazy"
            />

          </div>
        </div>
      </section>

      {/* 8. Хамтран ажилласан төслүүд */}
      <section id="projects" className="py-16 md:py-20 border-b border-line bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel icon={Building2}>Туршлага</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Хамтран ажилласан онцлох төслүүд
          </h2>

          <div className="mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-surface-3/80 border border-line hover:border-brand transition-colors flex flex-col justify-center min-h-24"
              >
                <div className="text-sm font-bold text-white leading-snug">{p.name}</div>
                {p.label && (
                  <div className="mt-1 text-[11px] text-brand-bright uppercase tracking-wider">{p.label}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Үнийн санал */}
      <section id="quote-section" className="py-16 md:py-20 border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-7 sm:p-9 rounded-2xl bg-surface-3/80 border border-accent/40">

            <div className="text-center max-w-lg mx-auto mb-8">
              <SectionLabel icon={Sparkles}>Шуурхай үнийн санал</SectionLabel>
              <h2 className="mt-4 text-2xl md:text-3xl font-black text-white tracking-tight">
                Урьдчилсан тооцоо авах
              </h2>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                Барилгынхаа үзүүлэлтийг сонгон үлдээвэл манай төслийн инженер тантай холбогдож,
                техникийн үзүүлэлт болон албан ёсны үнийн саналыг илгээнэ.
              </p>
            </div>

            {quoteSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Хүсэлт хүлээн авлаа</h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto mb-6">
                  Манай төслийн инженер таны{' '}
                  <strong className="text-accent">{quotePhone}</strong> дугаар луу удахгүй
                  холбогдоно.
                </p>
                <button
                  onClick={() => setQuoteSuccess(false)}
                  className="h-10 px-5 rounded-xl bg-accent text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Дахин тооцоолох
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <label className="block">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Төрөл
                    </span>
                    <select
                      value={quoteType}
                      onChange={(e) => setQuoteType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-white text-xs focus:border-brand-bright focus:outline-none"
                    >
                      <option value="passenger">Зорчигчийн</option>
                      <option value="freight">Ачааны</option>
                      <option value="hospital">Эмнэлгийн</option>
                      <option value="home">Хаусны</option>
                      <option value="food">Хоолны</option>
                      <option value="escalator">Урсдаг шат</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Давхрын тоо
                    </span>
                    <input
                      type="number"
                      min={2}
                      max={60}
                      value={quoteFloors}
                      onChange={(e) => setQuoteFloors(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-white text-xs focus:border-brand-bright focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                      Даац
                    </span>
                    <select
                      value={quoteCapacity}
                      onChange={(e) => setQuoteCapacity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-white text-xs focus:border-brand-bright focus:outline-none"
                    >
                      <option value="450kg">450 кг</option>
                      <option value="630kg">630 кг</option>
                      <option value="1000kg">1000 кг</option>
                      <option value="1600kg">1600 кг</option>
                      <option value="2000kg">2000 кг</option>
                    </select>
                  </label>

                </div>

                <label className="block">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                    Холбоо барих утас
                  </span>
                  <input
                    type="tel"
                    value={quotePhone}
                    onChange={(e) => {
                      setQuotePhone(e.target.value);
                      if (quoteError) setQuoteError('');
                    }}
                    placeholder="9911-XXXX"
                    aria-invalid={Boolean(quoteError)}
                    className={`w-full h-11 px-3 rounded-xl bg-surface-2 border text-white text-xs font-mono placeholder:text-ink-subtle focus:outline-none ${
                      quoteError ? 'border-red-500' : 'border-line focus:border-brand-bright'
                    }`}
                  />
                  {quoteError && <span className="mt-1.5 block text-[11px] text-red-400">{quoteError}</span>}
                </label>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Үнийн санал хүсэх
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. Холбоо барих */}
      <section id="contact" className="py-16 md:py-20 bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel icon={MapPin}>Холбоо барих</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {COMPANY.legalName}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-surface-3/80 border border-line">
              <MapPin className="w-5 h-5 text-brand-bright" />
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Хаяг</h3>
              <p className="mt-1.5 text-sm text-ink leading-relaxed">{COMPANY.address}</p>
            </div>

            <div className="p-6 rounded-xl bg-surface-3/80 border border-line">
              <PhoneCall className="w-5 h-5 text-brand-bright" />
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Утас</h3>
              <a
                href={`tel:${COMPANY.phone.replace(/\D/g, '')}`}
                className="mt-1.5 block text-lg font-bold text-white hover:text-brand-bright transition-colors font-mono"
              >
                {COMPANY.phone}
              </a>
            </div>

            <div className="p-6 rounded-xl bg-surface-3/80 border border-line">
              <Mail className="w-5 h-5 text-brand-bright" />
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">И-мэйл, вэб</h3>
              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-1.5 block text-sm font-semibold text-white hover:text-brand-bright transition-colors"
              >
                {COMPANY.email}
              </a>
              <a
                href={`https://${COMPANY.web}`}
                className="mt-0.5 block text-sm font-semibold text-brand-bright hover:text-white transition-colors"
              >
                {COMPANY.web}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DeltaLiftView;
