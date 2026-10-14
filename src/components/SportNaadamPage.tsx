import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Handshake,
  Loader2,
  Mail,
  Phone,
  Trophy,
  Upload,
  X,
} from 'lucide-react';
// Постерын гарчгийн нарийн бүдүүн үсэг — кирилл (Ө, Ү) бүрэн. Зөвхөн энэ хуудсанд ачаална.
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import { Reveal } from './Reveal';
import { submitForm } from '../lib/submitForm';
import { DOCUMENT_ACCEPT, attachmentKey, checkDocument, storeDocument, type Attachment } from '../lib/attachments';
import {
  FORM_SPORT_ORDER,
  NAADAM,
  NAADAM_BUCKET,
  NAADAM_TYPE,
  NK,
  ORGANIZERS,
  SPORTS,
  sportById,
} from '../data/naadamData';

/** Постерын гарчгийн фонт */
const display = { fontFamily: "'Oswald', 'Arial Narrow', sans-serif" } as const;

const ORG_ICONS = [Trophy, Handshake, Award];

/** Нээлт хүртэлх хугацаа — минут тутам шинэчлэгдэнэ */
function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    done: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
  };
}

const field =
  'w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 ' +
  'focus:border-[#0E5DA8] focus:ring-4 focus:ring-[#0E5DA8]/15 focus:outline-none transition';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={display} className="text-center text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#0E5DA8]">
    {children}
  </h2>
);

export const SportNaadamPage: React.FC = () => {
  const countdown = useCountdown(NAADAM.startsAt);

  const scrollToForm = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    // Үндсэн сайтын бүрхүүл (PageShell) дотор. Өнгө төрх нь албан ёсны постерынх:
    // цагаан дэвсгэр, зөөлөн цэнхэр/ягаан толбо, цэнхэр гарчиг, шар кран.
    <div className="relative isolate overflow-hidden bg-white text-slate-800">
      <div aria-hidden="true" className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-40 -right-40 w-[38rem] h-[38rem] rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute top-[30rem] -left-48 w-[32rem] h-[32rem] rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute bottom-40 right-0 w-[30rem] h-[30rem] rounded-full bg-indigo-100/60 blur-3xl" />
        <img src="/images/sportnaadam/cranes.png" alt="" className="absolute bottom-0 right-2 sm:right-8 w-48 sm:w-80 opacity-60" />
      </div>

      {/*
        * Постер + огноо, байршил, тоолуур — нэг карт. Постерын доод мөрийг
        * (огноо, GAN/ATTILA, вэб/имэйл) тайрч, оронд нь энэ мөрийг тавьсан —
        * ижил мэдээлэл давхардахгүй.
        */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <Reveal>
          <h1 className="sr-only">
            {NAADAM.sector} {NAADAM.edition} {NAADAM.title.toLowerCase()} — {NAADAM.dateLabel}, {NAADAM.venue}
          </h1>
          <div id="naadam-hero" className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-2xl shadow-sky-900/15 ring-1 ring-slate-200">
            <img
              id="naadam-poster"
              src={NAADAM.poster}
              srcSet={`${NAADAM.posterSmall} 1000w, ${NAADAM.poster} 2000w`}
              sizes="(min-width: 1152px) 1104px, calc(100vw - 2rem)"
              width={2000}
              height={752}
              alt={`${NAADAM.sector} ${NAADAM.edition} спортын их наадам. Зохион байгуулагч DELTA LIFTS, LIFT.MN`}
              className="w-full h-auto"
            />

            <div className="border-t border-slate-200 bg-gradient-to-r from-white via-sky-50/60 to-white px-4 sm:px-6 py-4 sm:py-5 grid gap-4 lg:grid-cols-[auto_1fr_auto_auto] items-center">
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-5">
                <span style={display} className="text-3xl sm:text-4xl font-bold text-[#0E5DA8] tracking-tight whitespace-nowrap">
                  {NAADAM.dateLabel}
                </span>
                <span className="w-px h-10 bg-slate-300" aria-hidden="true" />
                <img src="/images/sportnaadam/gan.png" alt="GAN Sports Center" className="h-8 sm:h-10 w-auto" />
                <img src="/images/sportnaadam/attila.png" alt="ATTILA" className="h-11 sm:h-14 w-auto" />
              </div>
              <span className="hidden lg:block" />

              {countdown.done ? (
                <p className="text-center font-bold text-[#0E5DA8]">Наадам эхэллээ! 🏆</p>
              ) : (
                <div id="naadam-countdown" className="flex justify-center gap-2" aria-label="Наадам эхлэх хүртэл">
                  {[
                    [countdown.days, 'өдөр'],
                    [countdown.hours, 'цаг'],
                    [countdown.minutes, 'минут'],
                  ].map(([n, l]) => (
                    <div key={l} className="w-16 sm:w-[4.5rem] py-1.5 rounded-xl bg-[#0E5DA8] text-white text-center">
                      <div style={display} className="text-2xl sm:text-3xl font-bold tabular-nums leading-tight">
                        {String(n).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-100">{l}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl bg-[#F7C600] hover:bg-[#ffd21f] text-[#0B3F78] font-extrabold uppercase tracking-wider shadow-lg shadow-amber-500/25 cursor-pointer transition"
              >
                Бүртгүүлэх
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Урилга — гарчиг нь постерт байгаа тул зөвхөн урилгын үг */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 text-center">
        <Reveal>
          <p className="text-base sm:text-xl leading-relaxed text-slate-700">
            {NAADAM.jubilee}н хүрээнд {NAADAM.dateLong} зохион байгуулагдана. {NAADAM.intro}
          </p>
          <p style={display} className="mt-6 text-2xl sm:text-4xl font-semibold uppercase tracking-tight text-[#0B3F78]">
            <span className="bg-[linear-gradient(transparent_62%,rgba(247,198,0,0.55)_62%)] px-1 [box-decoration-break:clone]">
              {NAADAM.slogan}
            </span>
          </p>
        </Reveal>
      </section>

      {/* Тэмцээний төрлүүд */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20">
        <Reveal>
          <SectionTitle>Тэмцээний төрлүүд</SectionTitle>
        </Reveal>
        <ul id="naadam-sports" className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SPORTS.map((s, i) => (
            <Reveal key={s.id} as="li" delay={i * 50} className={s.wide ? 'col-span-2' : ''}>
              <div className="group h-full min-h-40 flex flex-col items-center justify-center gap-4 p-5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0E5DA8]/40 hover:-translate-y-1 transition-all duration-300">
                <img
                  src={s.icon}
                  alt=""
                  className={`${s.wide ? 'h-14 sm:h-16' : 'h-16 sm:h-20'} max-w-full w-auto object-contain group-hover:scale-105 transition-transform`}
                />
                <span style={display} className="text-base sm:text-lg font-semibold uppercase tracking-wide text-slate-700 text-center">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={SPORTS.length * 50} className="col-span-full">
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full min-h-16 flex items-center justify-center gap-3 rounded-2xl bg-[#0E5DA8] hover:bg-[#0B3F78] text-white cursor-pointer transition"
            >
              <span style={display} className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Багаа бүртгүүлэх</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Reveal>
        </ul>
      </section>

      {/* Зохион байгуулагчид */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20">
        <div className="grid md:grid-cols-3 gap-4">
          {ORGANIZERS.map((g, i) => {
            const Icon = ORG_ICONS[i] ?? Trophy;
            return (
              <Reveal key={g.role} delay={i * 80}>
                <div className="h-full rounded-2xl p-6 bg-white/90 border border-slate-200 border-t-4 border-t-[#F7C600] shadow-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Icon className="w-5 h-5 text-[#0E5DA8]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{g.role}</h3>
                  </div>
                  <ul className="space-y-2">
                    {g.names.map((n) => (
                      <li key={n} className="font-bold leading-snug text-slate-800">{n}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Холбоо барих */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <Reveal>
          <div id="naadam-contact" className="rounded-2xl bg-[#0E5DA8] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <h3 style={display} className="text-xl sm:text-2xl font-bold uppercase tracking-wide shrink-0">Холбоо барих</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {NAADAM.phones.map((ph) => (
                <a key={ph} href={`tel:+976${ph.replace(/\D/g, '')}`} className="inline-flex items-center gap-2 py-2 font-bold text-lg hover:text-[#F7C600]">
                  <Phone className="w-5 h-5 text-[#F7C600]" />
                  {ph}
                </a>
              ))}
              <a href={`mailto:${NAADAM.email}`} className="inline-flex items-center gap-2 py-2 font-bold text-lg hover:text-[#F7C600]">
                <Mail className="w-5 h-5 text-[#F7C600]" />
                {NAADAM.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Бүртгэл */}
      <section id="register" className="scroll-mt-32 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <Reveal>
          <div className="text-center mb-8">
            <SectionTitle>Бүртгэл</SectionTitle>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Байгууллагаа бүртгүүлж, оролцох төрлүүдээ сонгоно уу.
            </p>
          </div>
        </Reveal>
        <RegistrationForm />
      </section>
    </div>
  );
};

/** Файлын хэмжээг уншихад хялбар болгоно */
const fileSize = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} КБ` : `${(n / 1024 / 1024).toFixed(1)} МБ`;

/** Бүртгэлийн маягт. Төрөл бүр (баг) өөрийн мэдүүлэгтэй. */
const RegistrationForm: React.FC = () => {
  const [org, setOrg] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  /** Төрлийн id → тухайн багийн мэдүүлэг */
  const [files, setFiles] = useState<Record<string, File>>({});
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [doneId, setDoneId] = useState('');

  const formSports = useMemo(() => FORM_SPORT_ORDER.map((id) => sportById(id)!).filter(Boolean), []);
  /** Сонгосон төрлүүд — маягтын дарааллаар */
  const pickedSports = formSports.filter((s) => picked.includes(s.id));

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const setFile = (sportId: string, file?: File) => {
    setFileError('');
    if (!file) return;
    const problem = checkDocument(file);
    if (problem) return setFileError(problem);
    setFiles((prev) => ({ ...prev, [sportId]: file }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (picked.length === 0) return setError('Оролцох дор хаяж нэг төрлийг сонгоно уу.');
    if (phone.replace(/\D/g, '').length < 8) return setError('Утасны дугаараа бүрэн оруулна уу.');
    const missing = pickedSports.filter((s) => !files[s.id]);
    if (missing.length) {
      return setError(`${missing.map((s) => s.label).join(', ')} — багийн мэдүүлгээ хавсаргана уу.`);
    }

    const sportLabels = pickedSports.map((s) => s.label);
    setSending(true);
    const attachments: Attachment[] = [];
    /** Төрөл → details дахь файлын түлхүүр (админ баг тус бүрийн файлыг олоход) */
    const fileMap: Record<string, string> = {};
    try {
      for (const s of pickedSports) {
        const stored = await storeDocument(files[s.id], NAADAM_BUCKET, NAADAM.email);
        const named = { ...stored, name: `${s.label} — ${stored.name}` };
        attachments.push(named);
        fileMap[s.id] = attachmentKey(named.name);
      }
    } catch (err) {
      setSending(false);
      return setError((err as Error).message);
    }
    const result = await submitForm('booking', {
      reference: 'NAADAM',
      contactName: name,
      phone,
      summary: `${NAADAM_TYPE}: ${org} — ${sportLabels.join(', ')}`,
      details: {
        [NK.type]: NAADAM_TYPE,
        [NK.org]: org,
        [NK.name]: name,
        [NK.position]: position,
        [NK.phone]: phone,
        [NK.email]: email,
        [NK.sports]: sportLabels.join(', '),
        [NK.sportIds]: pickedSports.map((s) => s.id).join(','),
        [NK.files]: JSON.stringify(fileMap),
      },
      attachments,
    });
    setSending(false);
    if (result.status === 'failed') return setError(result.message);
    setDoneId(result.id);
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (doneId) {
    return (
      <div id="naadam-success" className="rounded-3xl p-8 sm:p-10 bg-white border border-emerald-300 shadow-xl text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
        <h3 style={display} className="mt-4 text-3xl font-bold uppercase text-[#0E5DA8]">Бүртгэл амжилттай!</h3>
        <p className="mt-2 text-sm text-slate-600">
          <strong className="text-slate-900">{org}</strong>-ийн бүртгэлийг хүлээн авлаа. Зохион байгуулагчид{' '}
          <strong className="text-slate-900">{phone}</strong> дугаарт холбогдоно.
        </p>
        <p className="mt-4 inline-block px-4 py-2 rounded-xl bg-slate-100 font-mono font-bold text-slate-800">{doneId}</p>
        <p className="mt-4 text-xs text-slate-500">
          Лавлах: {NAADAM.phones.join(', ')} · {NAADAM.email}
        </p>
      </div>
    );
  }

  return (
    <form id="naadam-form" onSubmit={submit} className="rounded-3xl p-5 sm:p-8 bg-white/95 border border-slate-200 shadow-xl shadow-sky-900/10 space-y-5">
      <div>
        <label htmlFor="nf-org" className={labelCls}>Байгууллагын нэр *</label>
        <input id="nf-org" required value={org} onChange={(e) => setOrg(e.target.value)} className={field} placeholder="Жишээ: Дельта Лифт ХХК" autoComplete="organization" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nf-name" className={labelCls}>Таны нэр *</label>
          <input id="nf-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Овог, нэр" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="nf-position" className={labelCls}>Албан тушаал *</label>
          <input id="nf-position" required value={position} onChange={(e) => setPosition(e.target.value)} className={field} placeholder="Жишээ: Хүний нөөцийн менежер" autoComplete="organization-title" />
        </div>
        <div>
          <label htmlFor="nf-phone" className={labelCls}>Утасны дугаар *</label>
          <input id="nf-phone" required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} placeholder="9911-XXXX" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="nf-email" className={labelCls}>Имэйл хаяг *</label>
          <input id="nf-email" required type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="name@company.mn" autoComplete="email" />
        </div>
      </div>

      <fieldset>
        <legend className={labelCls}>Оролцох төрлүүдийг сонгоно уу *</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {formSports.map((s) => {
            const on = picked.includes(s.id);
            return (
              <label
                key={s.id}
                className={`relative flex items-center gap-3 min-h-16 pl-3 pr-12 rounded-xl border-2 cursor-pointer select-none transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#0E5DA8]/20 ${
                  on ? 'bg-sky-50 border-[#0E5DA8]' : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <input type="checkbox" name="sports" value={s.id} checked={on} onChange={() => toggle(s.id)} className="sr-only" />
                <span className="w-16 h-10 flex items-center justify-center shrink-0">
                  <img src={s.icon} alt="" className="max-h-10 max-w-16 object-contain" />
                </span>
                <span style={display} className="font-semibold uppercase tracking-wide text-slate-800">{s.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute right-3 w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                    on ? 'bg-[#0E5DA8] border-[#0E5DA8] text-white' : 'bg-white border-slate-300'
                  }`}
                >
                  {on && <Check className="w-4 h-4" strokeWidth={3} />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Багийн мэдүүлэг — бүх төрөлд */}
      <div id="nf-declaration" className="rounded-2xl p-5 bg-sky-50 border border-sky-200 space-y-4">
        <div>
          <h3 style={display} className="text-xl font-bold uppercase text-[#0E5DA8]">Багийн мэдүүлэг *</h3>
          <ol className="mt-2 space-y-1 text-sm text-slate-700 list-decimal list-inside">
            <li>Мэдүүлгийн загварыг татаж авна.</li>
            <li>Баг тус бүрийн тоглогчдын мэдээлэл, зургийг бөглөнө.</li>
            <li>Сонгосон төрөл бүрийн мэдүүлгийг доор хавсаргана.</li>
          </ol>
        </div>
        <a
          id="nf-template"
          href={NAADAM.templateUrl}
          download="Sportyn-naadam-bagiin-medvvleg.docx"
          className="flex items-center gap-3 h-12 px-4 rounded-xl bg-[#0E5DA8] hover:bg-[#0B3F78] text-white font-bold text-sm transition"
        >
          <Download className="w-5 h-5" />
          Мэдүүлгийн загвар татах (Word)
          <span className="ml-auto text-xs font-semibold text-sky-100">.docx</span>
        </a>

        {pickedSports.length === 0 ? (
          <p className="text-sm text-slate-500">Дээрээс оролцох төрлөө сонгоход баг тус бүрийн мэдүүлэг хавсаргах мөр гарна.</p>
        ) : (
          <ul id="nf-files" className="space-y-2">
            {pickedSports.map((s) => {
              const f = files[s.id];
              return (
                <li key={s.id} id={`nf-slot-${s.id}`} className={`flex items-center gap-3 min-h-14 pl-3 pr-2 rounded-xl border-2 bg-white ${f ? 'border-emerald-300' : 'border-dashed border-sky-300'}`}>
                  <img src={s.icon} alt="" className="w-10 h-8 object-contain shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div style={display} className="font-semibold uppercase tracking-wide text-slate-800 leading-tight">{s.label}</div>
                    {f ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 min-w-0">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{f.name}</span>
                        <span className="shrink-0">· {fileSize(f.size)}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">Мэдүүлэг хавсаргаагүй</div>
                    )}
                  </div>
                  {f ? (
                    <button
                      type="button"
                      onClick={() => setFiles((p) => { const n = { ...p }; delete n[s.id]; return n; })}
                      aria-label={`${s.label} мэдүүлгийг хасах`}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <label
                      htmlFor={`nf-file-${s.id}`}
                      className="inline-flex items-center justify-center gap-1.5 h-11 w-11 sm:w-auto sm:h-10 sm:px-3 rounded-lg bg-[#0E5DA8] hover:bg-[#0B3F78] text-white text-xs font-bold cursor-pointer shrink-0 transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only">Хавсаргах</span>
                      <input
                        id={`nf-file-${s.id}`}
                        type="file"
                        accept={DOCUMENT_ACCEPT}
                        onChange={(e) => {
                          setFile(s.id, e.target.files?.[0]);
                          e.target.value = '';
                        }}
                        className="sr-only"
                      />
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-[11px] text-slate-500">Word (.docx, .doc) эсвэл PDF, файл бүр 20 МБ хүртэл.</p>
        {fileError && <p role="alert" className="text-xs font-semibold text-red-600">{fileError}</p>}
      </div>

      {error && (
        <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full h-14 rounded-2xl bg-[#F7C600] hover:bg-[#ffd21f] text-[#0B3F78] font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-60 disabled:cursor-wait transition"
      >
        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
        {sending ? 'Илгээж байна…' : 'Бүртгүүлэх'}
      </button>
    </form>
  );
};

export default SportNaadamPage;
