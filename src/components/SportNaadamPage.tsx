import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Handshake,
  Loader2,
  MapPin,
  Trophy,
  Upload,
  X,
} from 'lucide-react';
// Постерын гарчгийн нарийн бүдүүн үсэг — кирилл (Ө, Ү) бүрэн. Зөвхөн энэ хуудсанд ачаална.
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import { Reveal } from './Reveal';
import { submitForm, HOTLINE } from '../lib/submitForm';
import { DOCUMENT_ACCEPT, readDocument, type Attachment } from '../lib/attachments';
import { CONTACT_EMAIL } from '../config';
import {
  FORM_SPORT_ORDER,
  NAADAM,
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

      {/* Постер */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <Reveal>
          <h1 className="sr-only">
            {NAADAM.sector} {NAADAM.edition} {NAADAM.title.toLowerCase()} — {NAADAM.dateLabel}, {NAADAM.venue}
          </h1>
          <img
            id="naadam-poster"
            src={NAADAM.poster}
            srcSet={`${NAADAM.posterSmall} 1000w, ${NAADAM.poster} 2000w`}
            sizes="(min-width: 1152px) 1104px, calc(100vw - 2rem)"
            width={2000}
            height={1023}
            alt={`${NAADAM.edition} спортын их наадам — ${NAADAM.dateLabel}, ${NAADAM.venue}. Зохион байгуулагч DELTA LIFTS, LIFT.MN`}
            className="w-full h-auto rounded-2xl sm:rounded-3xl shadow-2xl shadow-sky-900/15 ring-1 ring-slate-200"
          />
        </Reveal>

        {/* Огноо, байршил, тоолуур, бүртгүүлэх */}
        <Reveal delay={80}>
          <div className="relative mt-4 sm:mt-6 rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-xl shadow-sky-900/10 p-4 sm:p-6 grid gap-4 lg:grid-cols-[1fr_auto_auto] items-center">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2" style={display}>
                <CalendarDays className="w-5 h-5 text-[#0E5DA8]" />
                <span className="text-2xl font-bold text-[#0E5DA8]">{NAADAM.dateLabel}</span>
              </span>
              <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                <MapPin className="w-5 h-5 text-[#0E5DA8]" />
                {NAADAM.venue}
              </span>
            </div>

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
        </Reveal>
      </section>

      {/* Урилга */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 text-center">
        <Reveal>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">{NAADAM.sector}</p>
          <p style={display} className="mt-2 text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#0E5DA8] leading-none">
            {NAADAM.edition} {NAADAM.title}
          </p>
          <p className="mt-6 text-base sm:text-xl leading-relaxed text-slate-700">
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

/** Бүртгэлийн маягт */
const RegistrationForm: React.FC = () => {
  const [org, setOrg] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [teamFile, setTeamFile] = useState<Attachment | null>(null);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [doneId, setDoneId] = useState('');

  const formSports = useMemo(() => FORM_SPORT_ORDER.map((id) => sportById(id)!).filter(Boolean), []);
  const needsTeamForm = picked.some((id) => sportById(id)?.needsTeamForm);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const onFile = async (file?: File) => {
    setFileError('');
    if (!file) return;
    try {
      setTeamFile(await readDocument(file));
    } catch (e) {
      setTeamFile(null);
      setFileError((e as Error).message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (picked.length === 0) return setError('Оролцох дор хаяж нэг төрлийг сонгоно уу.');
    if (phone.replace(/\D/g, '').length < 8) return setError('Утасны дугаараа бүрэн оруулна уу.');
    if (needsTeamForm && !teamFile) return setError('E-sport · CS2-т оролцох бол багийн мэдүүлгийг хавсаргана уу.');

    const sportLabels = picked.map((id) => sportById(id)?.label ?? id);
    setSending(true);
    const result = await submitForm('booking', {
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
        [NK.sportIds]: picked.join(','),
      },
      attachments: needsTeamForm && teamFile ? [teamFile] : [],
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
        <p className="mt-4 text-xs text-slate-500">Лавлах: {HOTLINE} · {CONTACT_EMAIL}</p>
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

      {/* CS2 — багийн мэдүүлэг */}
      {needsTeamForm && (
        <div id="nf-cs2" className="rounded-2xl p-5 bg-sky-50 border border-sky-200 space-y-4">
          <div className="flex items-start gap-3">
            <img src="/images/sportnaadam/cs2.png" alt="" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <h3 style={display} className="text-lg font-bold uppercase text-[#0E5DA8]">E-sport · CS2 багийн мэдүүлэг</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                1) Загварыг татаж авна. 2) Багийн гишүүдийн мэдээллийг бөглөнө. 3) Бөглөсөн файлаа доор хавсаргана.
              </p>
            </div>
          </div>
          <a
            id="nf-template"
            href={NAADAM.templateUrl}
            download="CS2-bagiin-medvvleg.docx"
            className="flex items-center gap-3 h-12 px-4 rounded-xl bg-[#0E5DA8] hover:bg-[#0B3F78] text-white font-bold text-sm transition"
          >
            <Download className="w-5 h-5" />
            Мэдүүлгийн загвар татах (Word)
            <span className="ml-auto text-xs font-semibold text-sky-100">.docx</span>
          </a>

          {teamFile ? (
            <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-sm text-emerald-900">
              <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="truncate font-semibold">{teamFile.name}</span>
              <button
                type="button"
                onClick={() => setTeamFile(null)}
                aria-label="Хавсралтыг устгах"
                className="ml-auto w-10 h-10 -mr-2 flex items-center justify-center rounded-lg hover:bg-emerald-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="nf-file"
              className="flex items-center justify-center gap-2 min-h-14 px-4 rounded-xl border-2 border-dashed border-sky-300 bg-white hover:border-[#0E5DA8] text-sm font-bold text-[#0B3F78] cursor-pointer transition"
            >
              <Upload className="w-5 h-5 text-[#0E5DA8]" />
              Бөглөсөн мэдүүлгээ хавсаргах
              <input
                id="nf-file"
                type="file"
                accept={DOCUMENT_ACCEPT}
                onChange={(e) => {
                  void onFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
                className="sr-only"
              />
            </label>
          )}
          <p className="text-[11px] text-slate-500">Word (.docx, .doc) эсвэл PDF, 1.5 МБ хүртэл.</p>
          {fileError && <p role="alert" className="text-xs font-semibold text-red-600">{fileError}</p>}
        </div>
      )}

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
