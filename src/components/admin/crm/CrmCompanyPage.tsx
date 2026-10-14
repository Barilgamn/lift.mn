import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpDown, Building2, ClipboardList, Link2, Mail, MapPin, Pencil, Phone, Plus, Star, Trash2, Unlink, UserRound,
} from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { useAdminStore } from '../../../store/adminStore';
import {
  COMPANY_KIND, DEAL_KIND, type Contact, type Deal, companyNameFromDetails, dealStage, isOpenDeal, money, phoneKey,
} from '../../../lib/crm';
import { isNaadamEntry } from '../../../data/naadamData';
import { AdminModal, Badge, ELEVATOR_STATUS, Panel, SUBMISSION_KIND, SUBMISSION_STATUS } from '../adminUi';
import {
  ActivityComposer, ActivityItem, Avatar, CompanyForm, ContactForm, DealForm, KindBadge, StageBadge,
  btnDanger, btnGhost, field, telHref,
} from './crmUi';

const Card: React.FC<{ title: string; icon: React.ComponentType<{ className?: string }>; right?: React.ReactNode; children: React.ReactNode; id?: string }> = ({
  title, icon: Icon, right, children, id,
}) => (
  <Panel className="overflow-hidden">
    <div id={id} className="flex items-center justify-between gap-2 px-4 py-3 border-b border-line-light">
      <h2 className="flex items-center gap-2 text-sm font-bold text-ink-dark"><Icon className="w-4 h-4 text-brand" /> {title}</h2>
      {right}
    </div>
    <div className="px-4 py-3">{children}</div>
  </Panel>
);

const Info: React.FC<{ k: string; v?: React.ReactNode }> = ({ k, v }) =>
  v ? (
    <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5 text-xs">
      <dt className="text-ink-dark-muted">{k}</dt>
      <dd className="text-ink-dark font-medium break-words">{v}</dd>
    </div>
  ) : null;

/** Нэг харилцагчийн бүрэн мэдээлэл */
export const CrmCompanyPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const crm = useCrm();
  const { submissions, elevators, linkSubmissionCompany, linkElevatorCompany } = useAdminStore();
  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState<Partial<Contact> | null>(null);
  const [deal, setDeal] = useState<Partial<Deal> | null>(null);
  const [linkLift, setLinkLift] = useState('');
  const [error, setError] = useState('');

  const company = crm.companies.find((c) => c.id === id);
  const people = crm.contacts.filter((c) => c.companyId === id).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const deals = crm.deals.filter((d) => d.companyId === id);
  const timeline = crm.activities.filter((a) => a.companyId === id);
  const openTasks = timeline.filter((a) => a.kind === 'task' && !a.done);
  const linked = submissions.filter((s) => s.companyId === id);
  const lifts = elevators.filter((e) => e.companyId === id);

  /** Утас эсвэл нэр таарсан, холбоогүй хүсэлтүүд */
  const suggestions = useMemo(() => {
    if (!company) return [];
    const phones = new Set([company.phone, ...people.map((p) => p.phone)].map(phoneKey).filter((p) => p.length >= 6));
    const name = company.name.trim().toLowerCase();
    return submissions.filter((s) => {
      if (s.companyId || isNaadamEntry(s)) return false;
      if (phones.has(phoneKey(s.phone))) return true;
      const n = companyNameFromDetails(s.details).toLowerCase();
      return n.length >= 4 && (n.includes(name) || name.includes(n));
    }).slice(0, 10);
  }, [company, people, submissions]);

  if (!company) {
    return (
      <Panel className="p-8 text-center">
        <p className="text-sm text-ink-dark-muted">Харилцагч олдсонгүй.</p>
        <Link to="/admin/crm" className="mt-3 inline-block text-xs font-bold text-brand hover:underline">← Жагсаалт руу</Link>
      </Panel>
    );
  }

  const run = async (p: Promise<string | null>) => { const err = await p; setError(err ?? ''); };
  const openSum = deals.filter(isOpenDeal).reduce((s, d) => s + d.amount, 0);
  const wonSum = deals.filter((d) => d.stage === 'won').reduce((s, d) => s + d.amount, 0);
  const freeLifts = elevators.filter((e) => !e.companyId);

  return (
    <div id="crm-company">
      <Link to="/admin/crm" className="inline-flex items-center gap-1.5 text-xs text-ink-dark-muted hover:text-brand mb-3">
        <ArrowLeft className="w-3.5 h-3.5" /> Бүх харилцагч
      </Link>

      <Panel className="p-4 sm:p-5 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={company.name} className="w-12 h-12 text-lg" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-black text-ink-dark break-words">{company.name}</h2>
            <div className="mt-1 flex flex-wrap gap-1.5 items-center">
              <KindBadge kind={company.kind} /><StageBadge stage={company.stage} />
              {company.tags.map((t) => <Badge key={t} tone="slate">#{t}</Badge>)}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-dark-muted">
              <span>Нээлттэй хэлцэл: <b className="text-ink-dark font-mono">{money(openSum)}</b></span>
              <span>Амжилттай: <b className="text-emerald-700 font-mono">{money(wonSum)}</b></span>
              {crm.staffName(company.ownerId) && <span>Хариуцагч: <b className="text-ink-dark">{crm.staffName(company.ownerId)}</b></span>}
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-wrap gap-1.5">
            {(people[0]?.phone || company.phone) && (
              <a href={telHref(people[0]?.phone || company.phone)} className={btnGhost}><Phone className="w-3.5 h-3.5" /> Залгах</a>
            )}
            {(people[0]?.email || company.email) && (
              <a href={`mailto:${people[0]?.email || company.email}`} className={btnGhost}><Mail className="w-3.5 h-3.5" /> Имэйл</a>
            )}
            <button type="button" onClick={() => setEditing(true)} className={btnGhost} id="company-edit"><Pencil className="w-3.5 h-3.5" /> Засах</button>
            <button
              type="button"
              className={btnDanger}
              onClick={() => {
                if (!window.confirm(`"${company.name}"-ийг устгах уу?\n\nХолбогдох хүн, хэлцэл, тэмдэглэлүүд хамт устна. Хүсэлт, лифт устахгүй — зөвхөн холбоос нь салгагдана.`)) return;
                void crm.deleteCompany(company.id).then((err) => (err ? setError(err) : navigate('/admin/crm')));
              }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Устгах
            </button>
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* Зүүн багана */}
        <div className="space-y-4 min-w-0">
          <Card title="Мэдээлэл" icon={Building2}>
            <dl>
              <Info k="Төрөл" v={COMPANY_KIND[company.kind].label} />
              <Info k="Утас" v={company.phone && <a href={telHref(company.phone)} className="font-mono hover:text-brand">{company.phone}</a>} />
              <Info k="Имэйл" v={company.email && <a href={`mailto:${company.email}`} className="hover:text-brand">{company.email}</a>} />
              <Info k="РД" v={company.regNo && <span className="font-mono">{company.regNo}</span>} />
              <Info k="Дүүрэг" v={company.district} />
              <Info k="Хаяг" v={company.address && (
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${company.address} ${company.district} Улаанбаатар`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1 hover:text-brand">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-px" /> {company.address}
                </a>
              )} />
              <Info k="Вэб" v={company.website} />
              <Info k="Бүртгэсэн" v={company.createdAt.slice(0, 10)} />
            </dl>
            {company.notes && <p className="mt-2 p-2.5 rounded-lg bg-paper-3 text-xs text-ink-dark whitespace-pre-line">{company.notes}</p>}
          </Card>

          <Card
            title={`Холбогдох хүмүүс (${people.length})`}
            icon={UserRound}
            right={<button type="button" onClick={() => setContact({ companyId: company.id, isPrimary: people.length === 0 })} className={btnGhost} id="contact-add"><Plus className="w-3.5 h-3.5" /> Нэмэх</button>}
          >
            {people.length === 0 ? <p className="text-xs text-ink-dark-muted">СӨХ-ийн дарга, нягтлан, барилгын менежер гэх мэт хүмүүсээ нэмээрэй.</p> : (
              <ul className="divide-y divide-line-light -my-1">
                {people.map((p) => (
                  <li key={p.id} className="py-2.5 flex items-start gap-2.5" data-contact={p.name}>
                    <Avatar name={p.name} className="w-8 h-8 text-xs" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-ink-dark">
                        {p.name}{p.isPrimary && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" aria-label="Үндсэн" />}
                      </div>
                      {p.position && <div className="text-[11px] text-ink-dark-muted">{p.position}</div>}
                      <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs">
                        {p.phone && <a href={telHref(p.phone)} className="font-mono text-ink-dark hover:text-brand">{p.phone}</a>}
                        {p.email && <a href={`mailto:${p.email}`} className="text-ink-dark-muted hover:text-brand break-all">{p.email}</a>}
                      </div>
                    </div>
                    <button type="button" onClick={() => setContact(p)} aria-label={`${p.name} засах`} className="p-1.5 text-ink-dark-subtle hover:text-brand cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                    <button type="button" aria-label={`${p.name} устгах`} className="p-1.5 text-ink-dark-subtle hover:text-red-700 cursor-pointer"
                      onClick={() => { if (window.confirm(`${p.name}-ийг устгах уу?`)) void run(crm.deleteContact(p.id)); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={`Лифтүүд (${lifts.length})`} icon={ArrowUpDown}>
            {lifts.length > 0 && (
              <ul className="divide-y divide-line-light -mt-1 mb-2">
                {lifts.map((e) => (
                  <li key={e.id} className="py-2 flex items-center gap-2 text-xs" data-lift={e.code}>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-ink-dark truncate">{e.building} · <span className="font-mono">{e.code}</span></div>
                      <div className="text-ink-dark-muted">{e.brand} {e.model} · {e.floors} давхар</div>
                    </div>
                    <Badge tone={ELEVATOR_STATUS[e.status].tone}>{ELEVATOR_STATUS[e.status].label}</Badge>
                    <button type="button" aria-label="Салгах" title="Салгах" onClick={() => void run(linkElevatorCompany(e.id, null))} className="p-1.5 text-ink-dark-subtle hover:text-red-700 cursor-pointer"><Unlink className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
            {freeLifts.length > 0 ? (
              <div className="flex gap-2">
                <select value={linkLift} onChange={(e) => setLinkLift(e.target.value)} aria-label="Холбох лифт" className={field}>
                  <option value="">Лифт холбох…</option>
                  {freeLifts.map((e) => <option key={e.id} value={e.id}>{e.building} · {e.code}</option>)}
                </select>
                <button type="button" disabled={!linkLift} className={btnGhost}
                  onClick={() => { void run(linkElevatorCompany(linkLift, company.id)); setLinkLift(''); }}>
                  <Link2 className="w-3.5 h-3.5" /> Холбох
                </button>
              </div>
            ) : lifts.length === 0 && <p className="text-xs text-ink-dark-muted">Холбох лифт алга. "Лифтүүд" хэсэгт лифт бүртгэнэ.</p>}
          </Card>
        </div>

        {/* Баруун багана */}
        <div className="space-y-4 min-w-0">
          <Card
            title={`Хэлцэл (${deals.length})`}
            icon={ClipboardList}
            right={<button type="button" onClick={() => setDeal({ companyId: company.id, contactId: people[0]?.id ?? null })} className={btnGhost} id="deal-add"><Plus className="w-3.5 h-3.5" /> Хэлцэл</button>}
          >
            {deals.length === 0 ? <p className="text-xs text-ink-dark-muted">Гэрээ, засвар, сэлбэгийн борлуулалтаа хэлцэл болгон хянаарай.</p> : (
              <ul className="divide-y divide-line-light -my-1">
                {deals.map((d) => (
                  <li key={d.id}>
                    <button type="button" onClick={() => setDeal(d)} className="w-full py-2.5 flex items-center gap-3 text-left cursor-pointer group" data-deal={d.title}>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-ink-dark group-hover:text-brand truncate">{d.title}</div>
                        <div className="text-[11px] text-ink-dark-muted">{DEAL_KIND[d.kind]}{d.expectedClose ? ` · ${d.expectedClose}` : ''}{crm.staffName(d.ownerId) ? ` · ${crm.staffName(d.ownerId)}` : ''}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-ink-dark">{money(d.amount)}</span>
                      <Badge tone={dealStage(d.stage).tone}>{dealStage(d.stage).label}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Үйл ажиллагаа" icon={Star}>
            <ActivityComposer companyId={company.id} />
            {openTasks.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 px-3">
                <ul className="divide-y divide-amber-100">{openTasks.map((a) => <ActivityItem key={a.id} a={a} />)}</ul>
              </div>
            )}
            <ul id="timeline" className="mt-3 divide-y divide-line-light">
              {timeline.filter((a) => !(a.kind === 'task' && !a.done)).map((a) => <ActivityItem key={a.id} a={a} />)}
            </ul>
          </Card>

          <Card title={`Хүсэлтүүд (${linked.length})`} icon={ClipboardList} id="company-requests">
            {linked.length === 0 && suggestions.length === 0 && (
              <p className="text-xs text-ink-dark-muted">Сайтаар ирсэн засвар, үнийн санал, захиалгыг энд холбоно. "Хүсэлтүүд" хэсгээс ч холбож болно.</p>
            )}
            {linked.length > 0 && (
              <ul className="divide-y divide-line-light -mt-1">
                {linked.map((s) => (
                  <li key={s.id} className="py-2 flex items-center gap-2" data-linked={s.id}>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-ink-dark truncate">{s.summary}</div>
                      <div className="text-[11px] text-ink-dark-muted"><span className="font-mono">{s.id}</span> · {s.contactName} · {s.createdAt}</div>
                    </div>
                    <Badge tone={SUBMISSION_KIND[s.kind].tone}>{SUBMISSION_KIND[s.kind].label}</Badge>
                    <Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge>
                    <button type="button" aria-label={`${s.id} салгах`} title="Салгах" onClick={() => void run(linkSubmissionCompany(s.id, null))} className="p-1.5 text-ink-dark-subtle hover:text-red-700 cursor-pointer"><Unlink className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
            {suggestions.length > 0 && (
              <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50/60 p-3" id="suggestions">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand mb-1.5">Утас, нэр таарсан хүсэлт</div>
                <ul className="divide-y divide-sky-100">
                  {suggestions.map((s) => (
                    <li key={s.id} className="py-2 flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-ink-dark truncate">{s.summary}</div>
                        <div className="text-[11px] text-ink-dark-muted"><span className="font-mono">{s.id}</span> · {s.contactName} · <span className="font-mono">{s.phone}</span></div>
                      </div>
                      <button type="button" onClick={() => void run(linkSubmissionCompany(s.id, company.id))} className={btnGhost} aria-label={`${s.id} холбох`}>
                        <Link2 className="w-3.5 h-3.5" /> Холбох
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>

      {editing && (
        <AdminModal title="Харилцагч засах" onClose={() => setEditing(false)} wide>
          <CompanyForm initial={company} onDone={() => setEditing(false)} />
        </AdminModal>
      )}
      {contact && (
        <AdminModal title={contact.id ? 'Холбогдох хүн засах' : 'Холбогдох хүн нэмэх'} onClose={() => setContact(null)}>
          <ContactForm initial={contact} onDone={() => setContact(null)} />
        </AdminModal>
      )}
      {deal && (
        <AdminModal title={deal.id ? 'Хэлцэл засах' : 'Шинэ хэлцэл'} onClose={() => setDeal(null)} wide>
          <DealForm initial={deal} onDone={() => setDeal(null)} />
        </AdminModal>
      )}
    </div>
  );
};

export default CrmCompanyPage;
