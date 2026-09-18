import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Elevator, ElevatorStatus, ServiceKind, ServiceRecord } from '../../types';
import { Badge, ELEVATOR_STATUS, OUTCOME, PageHead, Panel, SERVICE_KIND } from './adminUi';

const STATUS_LIST = Object.keys(ELEVATOR_STATUS) as ElevatorStatus[];
const KIND_LIST = Object.keys(SERVICE_KIND) as ServiceKind[];

/** Шинэ засварын бүртгэл нэмэх маягт */
const AddRecordForm: React.FC<{ elevator: Elevator; onDone: () => void }> = ({ elevator, onDone }) => {
  const { addServiceRecord } = useAdminStore();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [engineer, setEngineer] = useState('');
  const [kind, setKind] = useState<ServiceKind>('routine');
  const [issue, setIssue] = useState('');
  const [resolution, setResolution] = useState('');
  const [parts, setParts] = useState('');
  const [duration, setDuration] = useState(60);
  const [outcome, setOutcome] = useState<ServiceRecord['outcome']>('resolved');
  const [error, setError] = useState('');

  const field = 'w-full h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none';
  const area = 'w-full px-3 py-2 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none';
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';

  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!engineer.trim() || !issue.trim()) {
      setError('Инженерийн нэр болон илэрсэн асуудлыг бөглөнө үү.');
      return;
    }
    setBusy(true);
    const err = await addServiceRecord({
      elevatorId: elevator.id,
      date, engineer: engineer.trim(), kind,
      issue: issue.trim(), resolution: resolution.trim(),
      partsUsed: parts.split(',').map((p) => p.trim()).filter(Boolean),
      durationMin: duration, outcome,
    });
    setBusy(false);
    if (err) { setError(err); return; }
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className={label} htmlFor="sr-date">Огноо</label>
          <input id="sr-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="sr-eng">Инженер</label>
          <input id="sr-eng" value={engineer} onChange={(e) => setEngineer(e.target.value)}
            placeholder="Жишээ: Э. Баттулга" className={field} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className={label} htmlFor="sr-kind">Төрөл</label>
          <select id="sr-kind" value={kind} onChange={(e) => setKind(e.target.value as ServiceKind)} className={field}>
            {KIND_LIST.map((k) => <option key={k} value={k}>{SERVICE_KIND[k].label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="sr-dur">Үргэлжилсэн (мин)</label>
          <input id="sr-dur" type="number" min={5} max={600} value={duration}
            onChange={(e) => setDuration(Number(e.target.value))} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="sr-out">Үр дүн</label>
          <select id="sr-out" value={outcome} onChange={(e) => setOutcome(e.target.value as ServiceRecord['outcome'])} className={field}>
            <option value="resolved">Шийдэгдсэн</option>
            <option value="awaiting-parts">Сэлбэг хүлээж буй</option>
            <option value="monitoring">Хяналтад</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="sr-issue">Илэрсэн асуудал</label>
        <textarea id="sr-issue" rows={2} value={issue} onChange={(e) => setIssue(e.target.value)}
          placeholder="Юу болсон, хэрхэн илэрсэн" className={area} />
      </div>
      <div>
        <label className={label} htmlFor="sr-res">Хэрхэн шийдсэн</label>
        <textarea id="sr-res" rows={3} value={resolution} onChange={(e) => setResolution(e.target.value)}
          placeholder="Хийсэн ажил, тохируулга, солив сэлбэг" className={area} />
      </div>
      <div>
        <label className={label} htmlFor="sr-parts">Ашигласан сэлбэг (таслалаар)</label>
        <input id="sr-parts" value={parts} onChange={(e) => setParts(e.target.value)}
          placeholder="Хаалганы серво мотор, Хөтөчийн тос 1л" className={field} />
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy}
          className="h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-xs font-bold cursor-pointer transition-colors">
          {busy ? 'Хадгалж байна…' : 'Бүртгэл хадгалах'}
        </button>
        <button type="button" onClick={onDone} className="h-10 px-4 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors">
          Болих
        </button>
      </div>
    </form>
  );
};

export const AdminElevators: React.FC = () => {
  const { elevators, serviceRecords, updateElevator } = useAdminStore();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ElevatorStatus | 'all'>('all');
  const [adding, setAdding] = useState(false);

  const selectedId = params.get('id');
  const selected = elevators.find((e) => e.id === selectedId) ?? null;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return elevators.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (!q) return true;
      return [e.code, e.building, e.district, e.address, e.brand].join(' ').toLowerCase().includes(q);
    });
  }, [elevators, query, statusFilter]);

  const history = useMemo(
    () => (selected ? serviceRecords.filter((r) => r.elevatorId === selected.id) : []),
    [serviceRecords, selected]
  );

  const close = () => { setParams({}); setAdding(false); };

  return (
    <div>
      <PageHead
        title="Лифтүүд"
        lead="Үйлчилгээнд буй тоноглол, төлөв, засварын түүх. Мөр дээр дарж дэлгэрэнгүйг харна."
      />

      <Panel className="p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
            <input
              type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Дугаар, барилга, дүүргээр хайх"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none"
            />
          </div>
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ElevatorStatus | 'all')}
            className="h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none"
          >
            <option value="all">Бүх төлөв</option>
            {STATUS_LIST.map((s) => <option key={s} value={s}>{ELEVATOR_STATUS[s].label}</option>)}
          </select>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <ul className="divide-y divide-line-light">
          {rows.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setParams({ id: e.id })}
                className="w-full text-left px-4 sm:px-5 py-3.5 hover:bg-paper-2 transition-colors cursor-pointer flex items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-ink-dark">{e.building}</span>
                    <Badge tone={ELEVATOR_STATUS[e.status].tone}>{ELEVATOR_STATUS[e.status].label}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-ink-dark-muted">
                    <span className="font-mono">{e.code}</span> · {e.district} · {e.address}
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-dark-subtle">
                    Сүүлд үйлчилсэн: {e.lastServiceAt} · Дараагийн үзлэг: {e.nextServiceAt}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-dark-subtle shrink-0" />
              </button>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-ink-dark-muted">Тохирох тоноглол олдсонгүй.</li>
          )}
        </ul>
      </Panel>

      {/* Дэлгэрэнгүй */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-6"
             onClick={close} role="presentation">
          <div
            role="dialog" aria-modal="true" aria-label={selected.building}
            onClick={(ev) => ev.stopPropagation()}
            className="theme-light w-full sm:max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-paper border border-line-light"
          >
            <div className="sticky top-0 bg-paper border-b border-line-light px-5 py-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-black text-ink-dark truncate">{selected.building}</h2>
                <p className="mt-0.5 text-[11px] text-ink-dark-muted">
                  <span className="font-mono">{selected.code}</span> · {selected.district}
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Хаах"
                className="p-1.5 rounded-lg hover:bg-paper-3 text-ink-dark-muted cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              {/* Төлөв солих */}
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-2">Төлөв</div>
              <div className="flex flex-wrap gap-2">
                {STATUS_LIST.map((s) => (
                  <button key={s} type="button"
                    onClick={() => { void updateElevator(selected.id, { status: s }).then((err) => { if (err) alert(err); }); }}
                    className={`h-9 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      selected.status === s
                        ? 'bg-brand border-brand text-white'
                        : 'bg-paper border-line-light text-ink-dark-muted hover:border-brand hover:text-brand'
                    }`}>
                    {ELEVATOR_STATUS[s].label}
                  </button>
                ))}
              </div>

              {/* Үзүүлэлт */}
              <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs">
                {[
                  ['Тоноглол', `${selected.brand} ${selected.model}`],
                  ['Давхар', String(selected.floors)],
                  ['Даац', selected.capacityKg ? `${selected.capacityKg} кг` : '—'],
                  ['Суурилуулсан', selected.installedAt],
                  ['Гэрээ', selected.contractType === 'monthly' ? 'Сар бүрийн гэрээт' : 'Дуудлагаар'],
                  ['Дараагийн үзлэг', selected.nextServiceAt],
                  ['Хариуцагч', selected.contactName],
                  ['Утас', selected.contactPhone],
                  ['Хаяг', selected.address],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-ink-dark-muted">{k}</dt>
                    <dd className="mt-0.5 font-semibold text-ink-dark">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Засварын түүх */}
              <div className="mt-6 pt-5 border-t border-line-light">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-sm font-bold text-ink-dark">
                    Засварын түүх <span className="text-ink-dark-subtle font-normal">({history.length})</span>
                  </h3>
                  {!adding && (
                    <button type="button" onClick={() => setAdding(true)}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-bold cursor-pointer transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Бүртгэл нэмэх
                    </button>
                  )}
                </div>

                {adding && (
                  <div className="mb-5 p-4 rounded-xl bg-paper-2 border border-line-light">
                    <AddRecordForm elevator={selected} onDone={() => setAdding(false)} />
                  </div>
                )}

                {history.length === 0 ? (
                  <p className="text-xs text-ink-dark-muted">Энэ тоноглолд бүртгэгдсэн үйлчилгээ алга.</p>
                ) : (
                  <ol className="space-y-3">
                    {history.map((r) => (
                      <li key={r.id} className="p-4 rounded-xl bg-paper-2 border border-line-light">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Badge tone={SERVICE_KIND[r.kind].tone}>{SERVICE_KIND[r.kind].label}</Badge>
                            <Badge tone={OUTCOME[r.outcome].tone}>{OUTCOME[r.outcome].label}</Badge>
                          </div>
                          <span className="text-[11px] text-ink-dark-muted">
                            {r.date} · {r.engineer} · {r.durationMin} мин
                          </span>
                        </div>
                        <div className="mt-2.5 text-xs">
                          <div className="text-ink-dark-muted">Илэрсэн асуудал</div>
                          <p className="mt-0.5 text-ink-dark">{r.issue}</p>
                        </div>
                        {r.resolution && (
                          <div className="mt-2 text-xs">
                            <div className="text-ink-dark-muted">Хэрхэн шийдсэн</div>
                            <p className="mt-0.5 text-ink-dark">{r.resolution}</p>
                          </div>
                        )}
                        {r.partsUsed.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {r.partsUsed.map((p) => (
                              <span key={p} className="inline-flex items-center h-6 px-2 rounded-md bg-paper border border-line-light text-[11px] text-ink-dark-muted">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminElevators;
