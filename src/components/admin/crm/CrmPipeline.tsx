import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Plus } from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { useAdminStore } from '../../../store/adminStore';
import { DEAL_KIND, DEAL_STAGES, type Deal, type DealKind, type DealStage, money, moneyShort } from '../../../lib/crm';
import { AdminModal, Panel } from '../adminUi';
import { DealForm, btnPrimary, fieldBase } from './crmUi';

const STAGE_BAR: Record<DealStage, string> = {
  new: 'bg-slate-400', qualified: 'bg-sky-400', proposal: 'bg-sky-600',
  negotiation: 'bg-amber-500', won: 'bg-emerald-600', lost: 'bg-red-500',
};

/** Хэлцлийн самбар — үе шатаар, чирж шилжүүлнэ */
export const CrmPipeline: React.FC = () => {
  const { deals, companies, moveDeal, staff, staffName } = useCrm();
  const { user } = useAdminStore();
  const [owner, setOwner] = useState('all');
  const [kind, setKind] = useState<DealKind | 'all'>('all');
  const [editing, setEditing] = useState<Partial<Deal> | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<DealStage | null>(null);
  const [error, setError] = useState('');

  const companyName = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [companies]);

  const columns = useMemo(() => {
    const list = deals.filter((d) => {
      if (kind !== 'all' && d.kind !== kind) return false;
      if (owner === 'me') return d.ownerId === user?.id;
      return owner === 'all' || d.ownerId === owner;
    });
    return DEAL_STAGES.map((s) => {
      const items = list.filter((d) => d.stage === s.id)
        .sort((a, b) => (a.expectedClose ?? '9999').localeCompare(b.expectedClose ?? '9999'));
      return { ...s, items, sum: items.reduce((t, d) => t + d.amount, 0) };
    });
  }, [deals, owner, kind, user]);

  const drop = async (stage: DealStage) => {
    setOver(null);
    if (!dragId) return;
    const err = await moveDeal(dragId, stage);
    setDragId(null);
    setError(err ?? '');
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <Panel className="p-3 mb-3 flex flex-wrap items-center gap-2">
        <select value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Хариуцагч" className={`${fieldBase} flex-1 min-w-0 sm:flex-none sm:w-52`}>
          <option value="all">Бүх хариуцагч</option>
          <option value="me">Миний хэлцэл</option>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value as DealKind | 'all')} aria-label="Төрөл" className={`${fieldBase} flex-1 min-w-0 sm:flex-none sm:w-56`}>
          <option value="all">Бүх төрөл</option>
          {(Object.keys(DEAL_KIND) as DealKind[]).map((k) => <option key={k} value={k}>{DEAL_KIND[k]}</option>)}
        </select>
        <span className="hidden sm:inline text-[11px] text-ink-dark-subtle">Картыг чирж үе шатыг солино</span>
        <button type="button" onClick={() => setEditing({ stage: 'new' })} className={`${btnPrimary} ml-auto`} id="pipeline-add">
          <Plus className="w-4 h-4" /> Хэлцэл
        </button>
      </Panel>
      {error && <p role="alert" className="mb-2 text-xs text-red-700">{error}</p>}

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x" id="pipeline">
        {columns.map((col) => (
          <section
            key={col.id}
            data-stage={col.id}
            aria-label={col.label}
            onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
            onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
            onDrop={(e) => { e.preventDefault(); void drop(col.id); }}
            className={`snap-start shrink-0 w-[78vw] sm:w-64 xl:w-auto xl:flex-1 xl:min-w-0 xl:shrink rounded-xl border bg-paper-3/70 flex flex-col max-h-[70vh] transition-colors ${
              over === col.id ? 'border-brand bg-sky-50' : 'border-line-light'
            }`}
          >
            <header className="px-3 pt-3 pb-2">
              <div className={`h-1 rounded-full mb-2 ${STAGE_BAR[col.id]}`} />
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-xs font-black text-ink-dark truncate">{col.label}</h3>
                <span className="text-[11px] font-bold text-ink-dark-muted tabular-nums">{col.items.length}</span>
              </div>
              <div className="text-[11px] font-mono text-ink-dark-muted">{moneyShort(col.sum)}</div>
            </header>
            <ul className="px-2 pb-2 space-y-2 overflow-y-auto">
              {col.items.map((d) => {
                const late = d.expectedClose && d.expectedClose < today && col.id !== 'won' && col.id !== 'lost';
                return (
                  <li
                    key={d.id}
                    draggable
                    onDragStart={(e) => { setDragId(d.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', d.id); }}
                    onDragEnd={() => { setDragId(null); setOver(null); }}
                    data-deal={d.title}
                    className={`rounded-lg bg-paper border border-line-light p-2.5 shadow-sm cursor-grab active:cursor-grabbing hover:border-brand ${dragId === d.id ? 'opacity-50' : ''}`}
                  >
                    <button type="button" onClick={() => setEditing(d)} className="block w-full text-left cursor-pointer">
                      <div className="text-xs font-bold text-ink-dark leading-snug">{d.title}</div>
                      <div className="mt-1 text-sm font-black font-mono text-ink-dark">{money(d.amount)}</div>
                    </button>
                    <Link to={`/admin/crm/c/${d.companyId}`} className="mt-1 block text-[11px] text-brand hover:underline truncate">{companyName.get(d.companyId)}</Link>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-dark-subtle">
                      {d.expectedClose && (
                        <span className={`inline-flex items-center gap-1 ${late ? 'text-red-700 font-bold' : ''}`}><CalendarDays className="w-3 h-3" />{d.expectedClose}</span>
                      )}
                      {staffName(d.ownerId) && <span className="ml-auto truncate">{staffName(d.ownerId)}</span>}
                    </div>
                    {/* Гар утсанд чирэх боломжгүй — үе шат сонгоно */}
                    <select
                      value={d.stage}
                      onChange={(e) => void moveDeal(d.id, e.target.value as DealStage).then((err) => setError(err ?? ''))}
                      aria-label={`${d.title} үе шат`}
                      className="mt-2 w-full h-8 px-2 rounded-md bg-paper-2 border border-line-light text-[11px] text-ink-dark sm:hidden"
                    >
                      {DEAL_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </li>
                );
              })}
              {col.items.length === 0 && <li className="px-2 py-6 text-center text-[11px] text-ink-dark-subtle">Хоосон</li>}
            </ul>
          </section>
        ))}
      </div>

      {editing && (
        <AdminModal title={editing.id ? 'Хэлцэл засах' : 'Шинэ хэлцэл'} onClose={() => setEditing(null)} wide>
          <DealForm initial={editing} pickCompany={!editing.id} onDone={() => setEditing(null)} />
        </AdminModal>
      )}
    </div>
  );
};

export default CrmPipeline;
