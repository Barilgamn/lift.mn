import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, Circle, Loader2, Mail, MessageSquare, Phone, Search, StickyNote, Trash2, Users, Zap,
} from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { useAdminStore } from '../../../store/adminStore';
import {
  ACTIVITY_KIND, COMPANY_KIND, COMPANY_STAGE, DEAL_KIND, DEAL_STAGES, DISTRICTS,
  type Activity, type ActivityKind, type Company, type CompanyKind, type CompanyStage, type Contact,
  type Deal, type DealKind, type DealStage, formatDateTime, relativeTime,
} from '../../../lib/crm';
import { Badge } from '../adminUi';

/** Сонголтын талбар — өргөнийг дуудагч тогтооно */
export const fieldBase =
  'h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none';
export const field =
  'w-full h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark ' +
  'placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none';
export const area =
  'w-full px-3 py-2 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark ' +
  'placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none';
export const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';
export const btnGhost =
  'inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted ' +
  'hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors disabled:opacity-50';
export const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover text-white ' +
  'text-xs font-bold cursor-pointer transition-colors disabled:opacity-60';
export const btnDanger =
  'inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-red-700 hover:bg-red-50 text-xs font-bold cursor-pointer disabled:opacity-50';

export const KindBadge: React.FC<{ kind: CompanyKind }> = ({ kind }) => (
  <Badge tone={COMPANY_KIND[kind]?.tone ?? 'slate'}>{COMPANY_KIND[kind]?.short ?? kind}</Badge>
);
export const StageBadge: React.FC<{ stage: CompanyStage }> = ({ stage }) => (
  <Badge tone={COMPANY_STAGE[stage]?.tone ?? 'slate'}>{COMPANY_STAGE[stage]?.label ?? stage}</Badge>
);

export const Avatar: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-9 h-9 text-sm' }) => (
  <span className={`rounded-full bg-sky-50 border border-sky-200 text-brand font-black flex items-center justify-center shrink-0 uppercase ${className}`}>
    {(name.trim() || '?').slice(0, 1)}
  </span>
);

export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`;

/** Хариуцагч сонгох */
export const StaffSelect: React.FC<{
  value: string | null; onChange: (v: string | null) => void; id?: string; allowEmpty?: string;
}> = ({ value, onChange, id, allowEmpty = 'Хариуцагчгүй' }) => {
  const { staff } = useCrm();
  return (
    <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} className={field}>
      <option value="">{allowEmpty}</option>
      {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  );
};

const FormError: React.FC<{ error: string }> = ({ error }) =>
  error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null;

// ------------------------------------------------------------ байгууллага

export const CompanyForm: React.FC<{
  initial?: Partial<Company>;
  onDone: (id: string | null) => void;
  contactSeed?: { name: string; phone: string };
}> = ({ initial, onDone, contactSeed }) => {
  const { saveCompany, saveContact } = useCrm();
  const { user } = useAdminStore();
  const [c, setC] = useState<Partial<Company>>({
    kind: 'soh', stage: 'lead', tags: [], ownerId: initial?.id ? initial.ownerId ?? null : user?.id ?? null, ...initial,
  });
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = <K extends keyof Company>(k: K, v: Company[K]) => setC((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { id, error: err } = await saveCompany({
      ...c,
      name: c.name ?? '',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    if (!err && id && contactSeed?.name && !initial?.id) {
      await saveContact({ companyId: id, name: contactSeed.name, phone: contactSeed.phone, isPrimary: true });
    }
    setBusy(false);
    if (err) { setError(err); return; }
    onDone(id);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={label} htmlFor="co-name">Нэр</label>
        <input id="co-name" value={c.name ?? ''} onChange={(e) => set('name', e.target.value)} autoFocus
          placeholder="Жишээ: Нарантуул хотхон СӨХ" className={field} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="co-kind">Төрөл</label>
          <select id="co-kind" value={c.kind} onChange={(e) => set('kind', e.target.value as CompanyKind)} className={field}>
            {(Object.keys(COMPANY_KIND) as CompanyKind[]).map((k) => <option key={k} value={k}>{COMPANY_KIND[k].label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="co-stage">Төлөв</label>
          <select id="co-stage" value={c.stage} onChange={(e) => set('stage', e.target.value as CompanyStage)} className={field}>
            {(Object.keys(COMPANY_STAGE) as CompanyStage[]).map((k) => <option key={k} value={k}>{COMPANY_STAGE[k].label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="co-phone">Утас</label>
          <input id="co-phone" value={c.phone ?? ''} onChange={(e) => set('phone', e.target.value)} inputMode="tel" placeholder="9911-2233" className={`${field} font-mono`} />
        </div>
        <div>
          <label className={label} htmlFor="co-email">Имэйл</label>
          <input id="co-email" type="email" value={c.email ?? ''} onChange={(e) => set('email', e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="co-reg">Регистрийн дугаар</label>
          <input id="co-reg" value={c.regNo ?? ''} onChange={(e) => set('regNo', e.target.value)} className={`${field} font-mono`} />
        </div>
        <div>
          <label className={label} htmlFor="co-district">Дүүрэг</label>
          <select id="co-district" value={c.district ?? ''} onChange={(e) => set('district', e.target.value)} className={field}>
            <option value="">—</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="co-address">Хаяг</label>
        <input id="co-address" value={c.address ?? ''} onChange={(e) => set('address', e.target.value)} placeholder="Хороо, гудамж, байр" className={field} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="co-owner">Хариуцагч</label>
          <StaffSelect id="co-owner" value={c.ownerId ?? null} onChange={(v) => set('ownerId', v)} />
        </div>
        <div>
          <label className={label} htmlFor="co-tags">Шошго</label>
          <input id="co-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="VIP, 2 лифт, OTIS" className={field} />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="co-notes">Тэмдэглэл</label>
        <textarea id="co-notes" rows={3} value={c.notes ?? ''} onChange={(e) => set('notes', e.target.value)} className={area} />
      </div>
      <FormError error={error} />
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Хадгалах
        </button>
        <button type="button" onClick={() => onDone(null)} className={btnGhost}>Болих</button>
      </div>
    </form>
  );
};

// ------------------------------------------------------------ холбогдох хүн

export const ContactForm: React.FC<{ initial: Partial<Contact>; onDone: () => void }> = ({ initial, onDone }) => {
  const { saveContact } = useCrm();
  const [c, setC] = useState<Partial<Contact>>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = <K extends keyof Contact>(k: K, v: Contact[K]) => setC((p) => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await saveContact({ ...c, name: c.name ?? '' });
    setBusy(false);
    if (err) { setError(err); return; }
    onDone();
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="ct-name">Нэр</label>
          <input id="ct-name" value={c.name ?? ''} onChange={(e) => set('name', e.target.value)} autoFocus className={field} />
        </div>
        <div>
          <label className={label} htmlFor="ct-pos">Албан тушаал</label>
          <input id="ct-pos" value={c.position ?? ''} onChange={(e) => set('position', e.target.value)} placeholder="СӨХ-ийн дарга" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="ct-phone">Утас</label>
          <input id="ct-phone" value={c.phone ?? ''} onChange={(e) => set('phone', e.target.value)} inputMode="tel" className={`${field} font-mono`} />
        </div>
        <div>
          <label className={label} htmlFor="ct-email">Имэйл</label>
          <input id="ct-email" type="email" value={c.email ?? ''} onChange={(e) => set('email', e.target.value)} className={field} />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="ct-notes">Тэмдэглэл</label>
        <input id="ct-notes" value={c.notes ?? ''} onChange={(e) => set('notes', e.target.value)} className={field} />
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold text-ink-dark cursor-pointer">
        <input type="checkbox" checked={!!c.isPrimary} onChange={(e) => set('isPrimary', e.target.checked)} className="w-4 h-4" />
        Үндсэн холбогдох хүн
      </label>
      <FormError error={error} />
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={btnPrimary}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} Хадгалах</button>
        <button type="button" onClick={onDone} className={btnGhost}>Болих</button>
      </div>
    </form>
  );
};

// ------------------------------------------------------------ хэлцэл

export const DealForm: React.FC<{
  initial: Partial<Deal>;
  onDone: () => void;
  /** Байгууллага сонгуулах (pipeline-аас шинээр нээхэд) */
  pickCompany?: boolean;
}> = ({ initial, onDone, pickCompany = false }) => {
  const { saveDeal, deleteDeal, contacts, companies } = useCrm();
  const { user } = useAdminStore();
  const [d, setD] = useState<Partial<Deal>>({
    kind: 'service-contract', stage: 'new', amount: 0, ownerId: initial.id ? initial.ownerId ?? null : user?.id ?? null, ...initial,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = <K extends keyof Deal>(k: K, v: Deal[K]) => setD((p) => ({ ...p, [k]: v }));
  const people = contacts.filter((c) => c.companyId === d.companyId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.companyId) { setError('Харилцагчийг сонгоно уу'); return; }
    setBusy(true);
    const { error: err } = await saveDeal({ ...d, title: d.title ?? '', companyId: d.companyId });
    setBusy(false);
    if (err) { setError(err); return; }
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {pickCompany && (
        <div>
          <span className={label}>Харилцагч</span>
          <CompanyPicker value={d.companyId ?? null} onChange={(id) => setD((p) => ({ ...p, companyId: id ?? undefined, contactId: null }))} />
        </div>
      )}
      <div>
        <label className={label} htmlFor="dl-title">Хэлцэл</label>
        <input id="dl-title" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} autoFocus={!pickCompany}
          placeholder="Жишээ: 2 лифтний жилийн засвар үйлчилгээ" className={field} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="dl-kind">Төрөл</label>
          <select id="dl-kind" value={d.kind} onChange={(e) => set('kind', e.target.value as DealKind)} className={field}>
            {(Object.keys(DEAL_KIND) as DealKind[]).map((k) => <option key={k} value={k}>{DEAL_KIND[k]}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="dl-stage">Үе шат</label>
          <select id="dl-stage" value={d.stage} onChange={(e) => set('stage', e.target.value as DealStage)} className={field}>
            {DEAL_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="dl-amount">Дүн (₮)</label>
          <input id="dl-amount" type="number" min={0} step={1000} value={d.amount ?? 0}
            onChange={(e) => set('amount', Number(e.target.value))} className={`${field} font-mono`} />
        </div>
        <div>
          <label className={label} htmlFor="dl-close">Хаах хугацаа</label>
          <input id="dl-close" type="date" value={d.expectedClose ?? ''} onChange={(e) => set('expectedClose', e.target.value || null)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="dl-contact">Холбогдох хүн</label>
          <select id="dl-contact" value={d.contactId ?? ''} onChange={(e) => set('contactId', e.target.value || null)} className={field}>
            <option value="">—</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="dl-owner">Хариуцагч</label>
          <StaffSelect id="dl-owner" value={d.ownerId ?? null} onChange={(v) => set('ownerId', v)} />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="dl-notes">Тэмдэглэл</label>
        <textarea id="dl-notes" rows={3} value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} className={area} />
      </div>
      {!pickCompany && d.companyId && (
        <p className="text-[11px] text-ink-dark-muted">Харилцагч: {companies.find((c) => c.id === d.companyId)?.name}</p>
      )}
      <FormError error={error} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={btnPrimary}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} Хадгалах</button>
        <button type="button" onClick={onDone} className={btnGhost}>Болих</button>
        {d.id && (
          <button
            type="button"
            className={`${btnDanger} ml-auto`}
            onClick={() => {
              if (!window.confirm(`"${d.title}" хэлцлийг устгах уу?`)) return;
              void deleteDeal(d.id!).then((err) => (err ? setError(err) : onDone()));
            }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Устгах
          </button>
        )}
      </div>
    </form>
  );
};

// ------------------------------------------------------------ байгууллага сонгогч

export const CompanyPicker: React.FC<{
  value: string | null;
  onChange: (id: string | null) => void;
  exclude?: string[];
}> = ({ value, onChange, exclude = [] }) => {
  const { companies, contacts } = useCrm();
  const [q, setQ] = useState('');
  const selected = companies.find((c) => c.id === value);
  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return companies.filter((c) => !exclude.includes(c.id)).slice(0, 8);
    const digits = s.replace(/\D/g, '');
    return companies.filter((c) => {
      if (exclude.includes(c.id)) return false;
      const people = contacts.filter((p) => p.companyId === c.id);
      const hay = [c.name, c.regNo, c.email, c.address, ...people.map((p) => p.name)].join(' ').toLowerCase();
      const phones = [c.phone, ...people.map((p) => p.phone)].join(' ').replace(/\D/g, '');
      return hay.includes(s) || (digits.length >= 4 && phones.includes(digits));
    }).slice(0, 8);
  }, [q, companies, contacts, exclude]);

  if (selected) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg border border-brand bg-sky-50/60">
        <Avatar name={selected.name} className="w-8 h-8 text-xs" />
        <span className="min-w-0 flex-1 text-sm font-bold text-ink-dark truncate">{selected.name}</span>
        <button type="button" onClick={() => onChange(null)} className="text-xs font-bold text-brand hover:underline cursor-pointer">Солих</button>
      </div>
    );
  }
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, утас, РД-ээр хайх"
          aria-label="Харилцагч хайх" className={`${field} pl-9`} />
      </div>
      <ul className="mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-line-light divide-y divide-line-light">
        {matches.length === 0 ? (
          <li className="px-3 py-2.5 text-xs text-ink-dark-muted">Олдсонгүй</li>
        ) : matches.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => onChange(c.id)} data-pick={c.name}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-paper-2 cursor-pointer">
              <KindBadge kind={c.kind} />
              <span className="text-sm text-ink-dark truncate">{c.name}</span>
              {c.phone && <span className="ml-auto text-[11px] font-mono text-ink-dark-muted shrink-0">{c.phone}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ------------------------------------------------------------ үйл ажиллагаа

const ACTIVITY_ICON: Record<ActivityKind, React.ComponentType<{ className?: string }>> = {
  note: StickyNote, call: Phone, meeting: Users, email: Mail, task: Calendar, system: Zap,
};

/** Тэмдэглэл, дуудлага, уулзалт, ажил нэмэх */
export const ActivityComposer: React.FC<{
  companyId?: string | null; dealId?: string | null; compact?: boolean;
  initialKind?: ActivityKind; onAdded?: () => void;
}> = ({ companyId = null, dealId = null, compact = false, initialKind = 'note', onAdded }) => {
  const { addActivity } = useCrm();
  const { user } = useAdminStore();
  const [kind, setKind] = useState<ActivityKind>(initialKind);
  const [body, setBody] = useState('');
  const [due, setDue] = useState('');
  const [assignee, setAssignee] = useState<string | null>(user?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kind === 'task' && !due) { setError('Ажлын хугацааг сонгоно уу'); return; }
    setBusy(true);
    const err = await addActivity({
      companyId, dealId, kind, body: body.trim(),
      dueAt: kind === 'task' && due ? new Date(due).toISOString() : null,
      assigneeId: kind === 'task' ? assignee : null,
    });
    setBusy(false);
    if (err) { setError(err); return; }
    setBody(''); setDue(''); setError('');
    onAdded?.();
  };

  const kinds: ActivityKind[] = ['note', 'call', 'meeting', 'email', 'task'];
  return (
    <form onSubmit={submit} className={compact ? 'space-y-2' : 'space-y-3'} id="activity-composer">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Төрөл">
        {kinds.map((k) => {
          const Icon = ACTIVITY_ICON[k];
          return (
            <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
              className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
                kind === k ? 'bg-brand text-white border-brand' : 'border-line-light text-ink-dark-muted hover:border-brand hover:text-brand'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {ACTIVITY_KIND[k].label}
            </button>
          );
        })}
      </div>
      <textarea
        rows={compact ? 2 : 3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={
          kind === 'call' ? 'Юу ярилцсан бэ?' : kind === 'meeting' ? 'Уулзалтын үр дүн' : kind === 'task' ? 'Хийх ажил — жишээ нь: Гэрээний төсөл илгээх' : 'Тэмдэглэл'
        }
        aria-label="Агуулга"
        className={area}
      />
      {kind === 'task' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className={label} htmlFor="act-due">Хугацаа</label>
            <input id="act-due" type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="act-assignee">Хариуцагч</label>
            <StaffSelect id="act-assignee" value={assignee} onChange={setAssignee} />
          </div>
        </div>
      )}
      <FormError error={error} />
      <button type="submit" disabled={busy || !body.trim()} className={btnPrimary}>
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />} Нэмэх
      </button>
    </form>
  );
};

/** Үйл ажиллагааны нэг мөр — ажил бол чагтлах товчтой */
export const ActivityItem: React.FC<{ a: Activity; showCompany?: boolean }> = ({ a, showCompany = false }) => {
  const { updateActivity, deleteActivity, staffName, companies } = useCrm();
  const Icon = ACTIVITY_ICON[a.kind] ?? StickyNote;
  const overdue = a.kind === 'task' && !a.done && a.dueAt && new Date(a.dueAt).getTime() < Date.now();
  const company = showCompany && a.companyId ? companies.find((c) => c.id === a.companyId) : undefined;
  return (
    <li className="flex gap-3 py-3" data-activity={a.kind}>
      {a.kind === 'task' ? (
        <button type="button" onClick={() => void updateActivity(a.id, { done: !a.done })}
          aria-label={a.done ? 'Дуусаагүй болгох' : 'Дууссан болгох'}
          className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${a.done ? 'text-emerald-600' : overdue ? 'text-red-600' : 'text-ink-dark-subtle hover:text-brand'}`}>
          {a.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
      ) : (
        <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${a.kind === 'system' ? 'bg-paper-3 text-ink-dark-subtle' : 'bg-sky-50 text-brand'}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {company && <Link to={`/admin/crm/c/${company.id}`} className="block text-[11px] font-bold text-brand hover:underline truncate">{company.name}</Link>}
        <p className={`text-sm whitespace-pre-line break-words ${a.done ? 'line-through text-ink-dark-subtle' : a.kind === 'system' ? 'text-ink-dark-muted' : 'text-ink-dark'}`}>{a.body}</p>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[11px] text-ink-dark-subtle">
          {a.kind !== 'system' && <span>{ACTIVITY_KIND[a.kind].label}</span>}
          {a.kind === 'task' && a.dueAt && (
            <span className={overdue ? 'text-red-700 font-bold' : ''}>Хугацаа: {formatDateTime(a.dueAt)}</span>
          )}
          {a.kind === 'task' && a.assigneeId && <span>→ {staffName(a.assigneeId)}</span>}
          <span title={a.createdAt}>{staffName(a.createdBy) || ''} · {relativeTime(a.createdAt)}</span>
        </div>
      </div>
      {a.kind !== 'system' && (
        <button type="button" aria-label="Устгах"
          onClick={() => { if (window.confirm('Устгах уу?')) void deleteActivity(a.id); }}
          className="self-start p-1.5 rounded-md text-ink-dark-subtle hover:text-red-700 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </li>
  );
};
