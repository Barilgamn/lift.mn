import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Handshake,
  Loader2,
  MapPin,
  PlayCircle,
  Trophy,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { LiftMnLogo } from './LiftMnLogo';
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
  'w-full h-12 px-4 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 ' +
  'focus:border-[#F7B919] focus:bg-white/[0.09] focus:outline-none transition-colors';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-white/70 mb-2';

export const SportNaadamPage: React.FC = () => {
  const countdown = useCountdown(NAADAM.startsAt);

  useEffect(() => {
    document.title = `${NAADAM.edition} ${NAADAM.title} 2026 — бүртгэл | LIFT.MN`;
  }, []);

  const scrollToForm = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-dvh bg-[#030B1A] text-white font-sans overflow-x-hidden">
      {/* Толгой */}
      <header className="sticky top-0 z-40 bg-[#030B1A]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" aria-label="LIFT.MN нүүр хуудас" className="py-3 -my-3 shrink-0">
            <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1.5">
              <LiftMnLogo className="h-5 sm:h-6" />
            </span>
          </Link>
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-xl bg-[#F7B919] hover:bg-[#ffc935] text-[#0B2545] font-extrabold text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition"
          >
            Бүртгүүлэх
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Нүүр хэсэг */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(2,90,156,0.55),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(247,185,25,0.18),transparent_55%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7B919]/15 border border-[#F7B919]/40 text-[#F7B919] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 shrink-0" />
                <span>Барилгын салбарын 100 жилийн ой</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-5 text-sm sm:text-base font-semibold text-sky-300/90">{NAADAM.sector}</p>
              <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] uppercase">
                <span className="text-[#F7B919]">{NAADAM.edition}</span> {NAADAM.title.split(' ')[0]}
                <span className="block">{NAADAM.title.split(' ').slice(1).join(' ')}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 text-sm sm:text-lg text-white/75 leading-relaxed max-w-xl">
                {NAADAM.jubilee}н хүрээнд {NAADAM.dateLong} зохион байгуулагдана.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                <li className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-sm font-bold">
                  <CalendarDays className="w-4 h-4 text-[#F7B919]" />
                  {NAADAM.dateLabel}
                </li>
                <li className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/[0.07] border border-white/15 text-sm font-bold">
                  <MapPin className="w-4 h-4 text-[#F7B919]" />
                  {NAADAM.venue}
                </li>
              </ul>
            </Reveal>

            {/* Тоолуур */}
            <Reveal delay={240}>
              {countdown.done ? (
                <p className="mt-7 text-lg font-black text-[#F7B919]">Наадам эхэллээ! 🏆</p>
              ) : (
                <div id="naadam-countdown" className="mt-7 flex items-stretch gap-2.5 sm:gap-3" aria-label="Наадам эхлэх хүртэл">
                  {[
                    [countdown.days, 'өдөр'],
                    [countdown.hours, 'цаг'],
                    [countdown.minutes, 'минут'],
                  ].map(([n, l]) => (
                    <div key={l} className="w-20 sm:w-24 py-3 rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.04] border border-white/15 text-center">
                      <div className="text-3xl sm:text-4xl font-black tabular-nums">{String(n).padStart(2, '0')}</div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            <Reveal delay={300}>
              <button
                type="button"
                onClick={scrollToForm}
                className="mt-8 inline-flex items-center gap-2.5 h-14 px-7 rounded-2xl bg-[#025A9C] hover:bg-[#0670bd] border border-sky-300/40 font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-sky-900/40 cursor-pointer transition"
              >
                Байгууллагаа бүртгүүлэх
                <ArrowRight className="w-5 h-5" />
              </button>
            </Reveal>
          </div>

          {/* Видео */}
          <Reveal delay={120} className="justify-self-center w-full max-w-[340px]">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#025A9C]/60 to-[#F7B919]/40 blur-2xl opacity-60" aria-hidden="true" />
              <div className="relative rounded-[2rem] p-2 bg-gradient-to-br from-white/25 to-white/5 border border-white/20 shadow-2xl">
                <div className="relative aspect-[9/16] rounded-[1.6rem] overflow-hidden bg-black">
                  <iframe
                    id="naadam-video"
                    title="Спортын их наадам — видео"
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(NAADAM.videoUrl)}&show_text=false&width=320`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <a
                href={NAADAM.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white/70 hover:text-white"
              >
                <PlayCircle className="w-4 h-4" />
                Facebook дээр үзэх
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Урилга */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <Users className="w-9 h-9 mx-auto text-[#F7B919]" />
          <p className="mt-5 text-lg sm:text-2xl font-semibold leading-relaxed text-white/90">{NAADAM.intro}</p>
          <p className="mt-5 text-xl sm:text-3xl font-black text-[#F7B919]">{NAADAM.slogan}</p>
        </Reveal>
      </section>

      {/* Тэмцээний төрлүүд */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-[#F7B919]" />
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Тэмцээний төрлүүд</h2>
          </div>
        </Reveal>
        <ul id="naadam-sports" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {SPORTS.map((s, i) => (
            <Reveal key={s.id} as="li" delay={i * 60}>
              <div className="group h-full flex flex-col items-center justify-center text-center gap-3 py-7 px-3 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-[#F7B919]/60 hover:-translate-y-1 transition-all duration-300">
                <span className="text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  {s.emoji}
                </span>
                <span className="text-sm sm:text-base font-extrabold">{s.label}</span>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={SPORTS.length * 60} className="col-span-2 sm:col-span-3 lg:col-span-1">
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full h-full min-h-28 flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#025A9C] hover:bg-[#0670bd] border border-sky-300/40 font-extrabold cursor-pointer transition"
            >
              <span>Багаа бүртгүүлэх</span>
              <ArrowDown className="w-5 h-5" />
            </button>
          </Reveal>
        </ul>
      </section>

      {/* Зохион байгуулагчид */}
      <section className="bg-white/[0.03] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid md:grid-cols-3 gap-4 sm:gap-5">
          {ORGANIZERS.map((g, i) => {
            const Icon = ORG_ICONS[i] ?? Building2;
            return (
              <Reveal key={g.role} delay={i * 80}>
                <div className="h-full rounded-2xl p-6 bg-[#06152F] border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#F7B919]/15 border border-[#F7B919]/40 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#F7B919]" />
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">{g.role}</h3>
                  </div>
                  <ul className="space-y-2">
                    {g.names.map((n) => (
                      <li key={n} className="text-sm sm:text-base font-bold leading-snug">{n}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Бүртгэл */}
      <section id="register" className="scroll-mt-20 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Бүртгэл</h2>
            <p className="mt-3 text-sm sm:text-base text-white/70">
              Байгууллагаа бүртгүүлж, оролцох төрлүүдээ сонгоно уу.
            </p>
          </div>
        </Reveal>
        <RegistrationForm />
      </section>

      {/* Хөл */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <span>© 2026 LIFT.MN · DELTA LIFT</span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href={`tel:+976${HOTLINE.replace(/\D/g, '')}`} className="py-2 -my-2 hover:text-white">Лавлах: {HOTLINE}</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="py-2 -my-2 hover:text-white">{CONTACT_EMAIL}</a>
          </span>
        </div>
      </footer>
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
      <div id="naadam-success" className="rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-emerald-500/15 to-white/[0.03] border border-emerald-400/40 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-400" />
        <h3 className="mt-4 text-2xl font-black">Бүртгэл амжилттай!</h3>
        <p className="mt-2 text-sm text-white/75">
          <strong className="text-white">{org}</strong>-ийн бүртгэлийг хүлээн авлаа. Зохион байгуулагчид{' '}
          <strong className="text-white">{phone}</strong> дугаарт холбогдоно.
        </p>
        <p className="mt-4 inline-block px-4 py-2 rounded-xl bg-white/10 font-mono font-bold">{doneId}</p>
        <p className="mt-4 text-xs text-white/60">Лавлах: {HOTLINE} · {CONTACT_EMAIL}</p>
      </div>
    );
  }

  return (
    <form id="naadam-form" onSubmit={submit} noValidate={false} className="rounded-3xl p-5 sm:p-8 bg-white/[0.04] border border-white/12 space-y-5">
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
                className={`flex items-center gap-3 min-h-14 px-4 rounded-xl border cursor-pointer select-none transition ${
                  on ? 'bg-[#F7B919]/15 border-[#F7B919] text-white' : 'bg-white/[0.04] border-white/15 text-white/85 hover:border-white/35'
                }`}
              >
                <input type="checkbox" name="sports" value={s.id} checked={on} onChange={() => toggle(s.id)} className="w-5 h-5 accent-[#F7B919] shrink-0" />
                <span className="text-2xl" aria-hidden="true">{s.emoji}</span>
                <span className="font-bold text-sm sm:text-base">{s.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* CS2 — багийн мэдүүлэг */}
      {needsTeamForm && (
        <div id="nf-cs2" className="rounded-2xl p-5 bg-[#025A9C]/20 border border-sky-400/40 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">🎮</span>
            <div>
              <h3 className="font-black">E-sport · CS2 багийн мэдүүлэг</h3>
              <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
                1) Загварыг татаж авна. 2) Багийн гишүүдийн мэдээллийг бөглөнө. 3) Бөглөсөн файлаа доор хавсаргана.
              </p>
            </div>
          </div>
          <a
            id="nf-template"
            href={NAADAM.templateUrl}
            download="CS2-bagiin-medvvleg.docx"
            className="flex items-center gap-3 h-12 px-4 rounded-xl bg-white text-[#0B2545] font-bold text-sm hover:bg-sky-50 transition"
          >
            <Download className="w-5 h-5 text-[#025A9C]" />
            Мэдүүлгийн загвар татах (Word)
            <span className="ml-auto text-xs font-semibold text-[#5B6B80]">.docx</span>
          </a>

          {teamFile ? (
            <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-sm">
              <FileText className="w-5 h-5 text-emerald-300 shrink-0" />
              <span className="truncate font-semibold">{teamFile.name}</span>
              <button
                type="button"
                onClick={() => setTeamFile(null)}
                aria-label="Хавсралтыг устгах"
                className="ml-auto w-10 h-10 -mr-2 flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="nf-file"
              className="flex items-center justify-center gap-2 min-h-14 px-4 rounded-xl border-2 border-dashed border-white/30 hover:border-[#F7B919] text-sm font-bold cursor-pointer transition"
            >
              <Upload className="w-5 h-5 text-[#F7B919]" />
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
          <p className="text-[11px] text-white/55">Word (.docx, .doc) эсвэл PDF, 1.5 МБ хүртэл.</p>
          {fileError && <p role="alert" className="text-xs font-semibold text-red-300">{fileError}</p>}
        </div>
      )}

      {error && (
        <p role="alert" className="p-3 rounded-xl bg-red-500/15 border border-red-400/40 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full h-14 rounded-2xl bg-[#F7B919] hover:bg-[#ffc935] text-[#0B2545] font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait transition"
      >
        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
        {sending ? 'Илгээж байна…' : 'Бүртгүүлэх'}
      </button>
    </form>
  );
};

export default SportNaadamPage;
