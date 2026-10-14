import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Phone, Plus, Search, Upload } from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { useAdminStore } from '../../../store/adminStore';
import {
  COMPANY_KIND, COMPANY_STAGE, type CompanyKind, type CompanyStage, csvToCompanies, downloadCsv,
  isOpenDeal, moneyShort, parseCsv, phoneKey, relativeTime,
} from '../../../lib/crm';
import { AdminModal, Panel } from '../adminUi';
import { Avatar, CompanyForm, KindBadge, StageBadge, btnGhost, btnPrimary, field, telHref } from './crmUi';

type Sort = 'name' | 'recent' | 'deals';

/** Харилцагч байгууллагуудын жагсаалт */
export const CrmCompanies: React.FC = () => {
  const { companies, contacts, deals, activities, staff, staffName, importCompanies } = useCrm();
  const { submissions, elevators, user } = useAdminStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<CompanyKind | 'all'>('all');
  const [stage, setStage] = useState<CompanyStage | 'all'>('all');
  const [owner, setOwner] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState<ReturnType<typeof csvToCompanies> | null>(null);
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  /** Байгууллага бүрийн нэгтгэл — жагсаалт, хайлт, эрэмбэлэхэд */
  const stats = useMemo(() => {
    const m = new Map<string, { people: typeof contacts; openSum: number; openCount: number; requests: number; elevators: number; last: string }>();
    for (const c of companies) m.set(c.id, { people: [], openSum: 0, openCount: 0, requests: 0, elevators: 0, last: c.updatedAt });
    for (const p of contacts) if (p.companyId && m.has(p.companyId)) m.get(p.companyId)!.people.push(p);
    for (const d of deals) {
      const x = m.get(d.companyId);
      if (x && isOpenDeal(d)) { x.openSum += d.amount; x.openCount++; }
    }
    for (const s of submissions) if (s.companyId && m.has(s.companyId)) m.get(s.companyId)!.requests++;
    for (const e of elevators) if (e.companyId && m.has(e.companyId)) m.get(e.companyId)!.elevators++;
    for (const a of activities) {
      const x = a.companyId ? m.get(a.companyId) : undefined;
      if (x && a.createdAt > x.last) x.last = a.createdAt;
    }
    return m;
  }, [companies, contacts, deals, submissions, elevators, activities]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const x of companies) c[x.kind] = (c[x.kind] ?? 0) + 1;
    return c;
  }, [companies]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, '');
    const list = companies.filter((c) => {
      if (kind !== 'all' && c.kind !== kind) return false;
      if (stage !== 'all' && c.stage !== stage) return false;
      if (owner === 'me' ? c.ownerId !== user?.id : owner !== 'all' && c.ownerId !== owner) return false;
      if (!q) return true;
      const people = stats.get(c.id)?.people ?? [];
      const hay = [c.name, c.regNo, c.email, c.address, c.district, c.tags.join(' '), ...people.map((p) => `${p.name} ${p.email}`)].join(' ').toLowerCase();
      const phones = [c.phone, ...people.map((p) => p.phone)].map(phoneKey).join(' ');
      return hay.includes(q) || (digits.length >= 4 && phones.includes(digits));
    });
    const by: Record<Sort, (a: typeof list[0], b: typeof list[0]) => number> = {
      name: (a, b) => a.name.localeCompare(b.name, 'mn'),
      recent: (a, b) => (stats.get(b.id)?.last ?? '').localeCompare(stats.get(a.id)?.last ?? ''),
      deals: (a, b) => (stats.get(b.id)?.openSum ?? 0) - (stats.get(a.id)?.openSum ?? 0),
    };
    return [...list].sort(by[sort]);
  }, [companies, kind, stage, owner, query, sort, stats, user]);

  const exportCsv = () => {
    downloadCsv(
      `lift-mn-crm-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Нэр', 'Төрөл', 'Төлөв', 'РД', 'Утас', 'Имэйл', 'Дүүрэг', 'Хаяг', 'Холбогдох хүн', 'Холбогдох утас', 'Хариуцагч', 'Нээлттэй хэлцэл ₮', 'Хүсэлт', 'Лифт', 'Шошго'],
      rows.map((c) => {
        const st = stats.get(c.id)!;
        const main = st.people.find((p) => p.isPrimary) ?? st.people[0];
        return [c.name, COMPANY_KIND[c.kind].label, COMPANY_STAGE[c.stage].label, c.regNo, c.phone, c.email, c.district, c.address,
          main?.name ?? '', main?.phone ?? '', staffName(c.ownerId), st.openSum, st.requests, st.elevators, c.tags.join(', ')];
      })
    );
  };

  const pickImport = async (file: File) => {
    const parsed = csvToCompanies(parseCsv(await file.text()));
    setImportMsg('');
    setImporting(parsed);
  };

  const runImport = async () => {
    if (!importing) return;
    // Нэр давхцсан байгууллагыг алгасна
    const existing = new Set(companies.map((c) => c.name.trim().toLowerCase()));
    const fresh = importing.items.filter((r) => !existing.has(r.company.name.trim().toLowerCase()));
    const { added, error } = await importCompanies(fresh);
    if (error) { setImportMsg(error); return; }
    setImportMsg(`${added} харилцагч нэмэгдлээ${importing.items.length - fresh.length ? `, ${importing.items.length - fresh.length} давхардсан нэрийг алгаслаа` : ''}.`);
    setImporting(null);
  };

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
      active ? 'bg-brand text-white border-brand' : 'bg-paper text-ink-dark-muted border-line-light hover:border-brand hover:text-brand'
    }`;

  return (
    <div>
      <Panel className="p-4 mb-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Нэр, утас, хүн, РД, хаяг, шошгоор хайх" aria-label="Харилцагч хайх" className={`${field} pl-9`} />
          </div>
          <div className="grid grid-cols-3 lg:flex gap-2">
            <select value={stage} onChange={(e) => setStage(e.target.value as CompanyStage | 'all')} aria-label="Төлөв" className={`${field} lg:w-40`}>
              <option value="all">Бүх төлөв</option>
              {(Object.keys(COMPANY_STAGE) as CompanyStage[]).map((s) => <option key={s} value={s}>{COMPANY_STAGE[s].label}</option>)}
            </select>
            <select value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Хариуцагч" className={`${field} lg:w-40`}>
              <option value="all">Бүх хариуцагч</option>
              <option value="me">Миний</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Эрэмбэ" className={`${field} lg:w-40`}>
              <option value="recent">Сүүлд идэвхтэй</option>
              <option value="name">Нэрээр</option>
              <option value="deals">Хэлцлийн дүнгээр</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => setKind('all')} className={chip(kind === 'all')}>Бүгд <span className="opacity-75">{companies.length}</span></button>
          {(Object.keys(COMPANY_KIND) as CompanyKind[]).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={chip(kind === k)} data-kind={k}>
              {COMPANY_KIND[k].short} <span className="opacity-75">{counts[k] ?? 0}</span>
            </button>
          ))}
          <div className="ml-auto flex gap-1.5">
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void pickImport(f); e.target.value = ''; }} />
            <button type="button" onClick={() => fileRef.current?.click()} className={btnGhost} id="crm-import"><Upload className="w-3.5 h-3.5" /> Импорт</button>
            <button type="button" onClick={exportCsv} className={btnGhost} disabled={!rows.length}><Download className="w-3.5 h-3.5" /> Excel</button>
            <button type="button" onClick={() => setAdding(true)} className={btnPrimary} id="crm-add"><Plus className="w-4 h-4" /> Харилцагч</button>
          </div>
        </div>
        {importMsg && <p role="status" className="text-xs text-emerald-800">{importMsg}</p>}
      </Panel>

      <div className="mb-2 text-xs text-ink-dark-muted">{rows.length} харилцагч</div>

      {rows.length === 0 ? (
        <Panel className="p-10 text-center">
          <p className="text-sm text-ink-dark-muted">
            {companies.length ? 'Шүүлтүүрт тохирох харилцагч алга.' : 'Одоогоор харилцагч бүртгээгүй байна. СӨХ, хамтрагч байгууллагуудаа нэмэх эсвэл Excel-ээс импортлоорой.'}
          </p>
        </Panel>
      ) : (
        <Panel className="overflow-hidden">
          <table className="hidden md:table w-full text-left" id="crm-table">
            <thead className="bg-paper-3 text-[11px] uppercase tracking-wider text-ink-dark-muted">
              <tr>
                <th className="px-4 py-2.5 font-bold">Харилцагч</th>
                <th className="px-4 py-2.5 font-bold">Холбогдох хүн</th>
                <th className="px-4 py-2.5 font-bold text-right">Хэлцэл</th>
                <th className="px-4 py-2.5 font-bold text-center">Хүсэлт · Лифт</th>
                <th className="px-4 py-2.5 font-bold">Хариуцагч</th>
                <th className="px-4 py-2.5 font-bold">Идэвх</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-light">
              {rows.map((c) => {
                const st = stats.get(c.id)!;
                const main = st.people.find((p) => p.isPrimary) ?? st.people[0];
                return (
                  <tr key={c.id} data-company={c.name} onClick={() => navigate(`/admin/crm/c/${c.id}`)} className="cursor-pointer hover:bg-paper-2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={c.name} />
                        <div className="min-w-0">
                          <Link to={`/admin/crm/c/${c.id}`} onClick={(e) => e.stopPropagation()} className="block text-sm font-bold text-ink-dark hover:text-brand truncate max-w-[22rem]">{c.name}</Link>
                          <div className="mt-0.5 flex gap-1.5"><KindBadge kind={c.kind} /><StageBadge stage={c.stage} /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {main ? (
                        <>
                          <div className="font-semibold text-ink-dark">{main.name}</div>
                          {main.phone && <a href={telHref(main.phone)} onClick={(e) => e.stopPropagation()} className="font-mono text-ink-dark-muted hover:text-brand">{main.phone}</a>}
                        </>
                      ) : c.phone ? (
                        <a href={telHref(c.phone)} onClick={(e) => e.stopPropagation()} className="font-mono text-ink-dark-muted hover:text-brand">{c.phone}</a>
                      ) : <span className="text-ink-dark-subtle">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {st.openCount ? <><div className="font-bold font-mono text-ink-dark">{moneyShort(st.openSum)}</div><div className="text-ink-dark-subtle">{st.openCount} нээлттэй</div></> : <span className="text-ink-dark-subtle">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-xs tabular-nums text-ink-dark-muted">{st.requests} · {st.elevators}</td>
                    <td className="px-4 py-3 text-xs text-ink-dark-muted">{staffName(c.ownerId) || '—'}</td>
                    <td className="px-4 py-3 text-[11px] text-ink-dark-subtle whitespace-nowrap">{relativeTime(st.last)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <ul className="md:hidden divide-y divide-line-light">
            {rows.map((c) => {
              const st = stats.get(c.id)!;
              const phone = (st.people.find((p) => p.isPrimary) ?? st.people[0])?.phone || c.phone;
              return (
                <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <Link to={`/admin/crm/c/${c.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar name={c.name} />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-ink-dark truncate">{c.name}</div>
                      <div className="mt-0.5 flex flex-wrap gap-1.5 items-center">
                        <KindBadge kind={c.kind} /><StageBadge stage={c.stage} />
                        {st.openCount > 0 && <span className="text-[11px] font-mono text-ink-dark-muted">{moneyShort(st.openSum)}</span>}
                      </div>
                    </div>
                  </Link>
                  {phone && (
                    <a href={telHref(phone)} aria-label={`${c.name} руу залгах`} className="w-10 h-10 rounded-full border border-line-light flex items-center justify-center text-brand shrink-0">
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      {adding && (
        <AdminModal title="Шинэ харилцагч" onClose={() => setAdding(false)} wide>
          <CompanyForm onDone={(id) => { setAdding(false); if (id) navigate(`/admin/crm/c/${id}`); }} />
        </AdminModal>
      )}

      {importing && (
        <AdminModal title="Excel (CSV)-ээс импортлох" onClose={() => setImporting(null)} wide>
          <div className="space-y-3 text-sm">
            {importing.items.length === 0 ? (
              <p className="text-red-700">Файлаас харилцагч олдсонгүй. Эхний мөрөнд "Нэр" багана байх ёстой.</p>
            ) : (
              <>
                <p className="text-ink-dark"><b>{importing.items.length}</b> мөр олдлоо. Эхний 5:</p>
                <ul className="rounded-lg border border-line-light divide-y divide-line-light text-xs">
                  {importing.items.slice(0, 5).map((r, i) => (
                    <li key={i} className="px-3 py-2 flex gap-2 items-center">
                      <KindBadge kind={r.company.kind ?? 'company'} />
                      <span className="font-semibold text-ink-dark truncate">{r.company.name}</span>
                      <span className="ml-auto font-mono text-ink-dark-muted">{r.company.phone ?? r.contact?.phone ?? ''}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {importing.unknownColumns.length > 0 && (
              <p className="text-[11px] text-amber-800">Танигдаагүй багана (алгасна): {importing.unknownColumns.join(', ')}</p>
            )}
            <p className="text-[11px] text-ink-dark-muted">
              Танигдах баганууд: Нэр, Төрөл (СӨХ / Хамтрагч / Байгууллага), Утас, Имэйл, Хаяг, Дүүрэг, РД, Холбогдох хүн, Холбогдох утас, Тэмдэглэл.
              Нэр нь бүртгэлтэй харилцагчтай давхцвал алгасна.
            </p>
            {importMsg && <p role="alert" className="text-xs text-red-700">{importMsg}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => void runImport()} disabled={!importing.items.length} className={btnPrimary} id="crm-import-run">Импортлох</button>
              <button type="button" onClick={() => setImporting(null)} className={btnGhost}>Болих</button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default CrmCompanies;
