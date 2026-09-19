import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Submission, SubmissionKind, SubmissionStatus } from '../../types';
import { Badge, PageHead, Panel, SUBMISSION_KIND, SUBMISSION_STATUS } from './adminUi';

const KIND_FILTERS: Array<{ value: SubmissionKind | 'all'; label: string }> = [
  { value: 'all', label: 'Бүгд' },
  { value: 'service-ticket', label: 'Засварын хүсэлт' },
  { value: 'emergency', label: 'Яаралтай' },
  { value: 'booking', label: 'Цаг захиалга' },
  { value: 'quote', label: 'Үнийн санал' },
  { value: 'sourcing', label: 'Сэлбэг хайх' },
  { value: 'order', label: 'Захиалга' },
];

const STATUS_ORDER: SubmissionStatus[] = ['new', 'in-progress', 'done'];

export const AdminSubmissions: React.FC = () => {
  const { submissions, setSubmissionStatus } = useAdminStore();
  const [kind, setKind] = useState<SubmissionKind | 'all'>('all');
  const [status, setStatus] = useState<SubmissionStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Submission | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (kind !== 'all' && s.kind !== kind) return false;
      if (status !== 'all' && s.status !== status) return false;
      if (!q) return true;
      return [s.id, s.contactName, s.phone, s.summary].join(' ').toLowerCase().includes(q);
    });
  }, [submissions, kind, status, query]);

  // Хавсаргасан зургийг (data: угтвартай) текст талбаруудаас салгана —
  // эс бөгөөс base64 мөр нь дэлгэрэнгүй цонхыг дүүргэнэ.
  const [textDetails, photoDetails] = useMemo(() => {
    const entries = Object.entries(open?.details ?? {});
    return [
      entries.filter(([, v]) => !String(v).startsWith('data:image/')),
      entries.filter(([, v]) => String(v).startsWith('data:image/')),
    ];
  }, [open]);

  return (
    <div>
      <PageHead
        title="Бүртгэлүүд"
        lead="Сайтаар ирсэн бүх маягтын хүсэлт — засвар, яаралтай дуудлага, цаг захиалга, үнийн санал, сэлбэг хайх, захиалга."
      />

      {/* Шүүлтүүр */}
      <Panel className="p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Дугаар, нэр, утас, утгаар хайх"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SubmissionStatus | 'all')}
            className="h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none"
          >
            <option value="all">Бүх төлөв</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{SUBMISSION_STATUS[s].label}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setKind(f.value)}
              className={`h-8 px-3 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                kind === f.value
                  ? 'bg-brand border-brand text-white'
                  : 'bg-paper border-line-light text-ink-dark-muted hover:border-brand hover:text-brand'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="mb-3 text-xs text-ink-dark-muted">
        {rows.length} бүртгэл
        {rows.length !== submissions.length && ` (нийт ${submissions.length}-аас)`}
      </div>

      {/* Жагсаалт */}
      <Panel className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-dark-muted">
            Шүүлтүүрт тохирох бүртгэл олдсонгүй.
          </p>
        ) : (
          <>
            {/* Дэлгэц дээр хүснэгт */}
            <table className="hidden md:table w-full text-left">
              <thead className="bg-paper-3 text-[11px] uppercase tracking-wider text-ink-dark-muted">
                <tr>
                  <th className="px-5 py-2.5 font-bold">Дугаар</th>
                  <th className="px-5 py-2.5 font-bold">Төрөл</th>
                  <th className="px-5 py-2.5 font-bold">Утга</th>
                  <th className="px-5 py-2.5 font-bold">Холбоо барих</th>
                  <th className="px-5 py-2.5 font-bold">Огноо</th>
                  <th className="px-5 py-2.5 font-bold">Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-light">
                {rows.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setOpen(s)}
                    className="cursor-pointer hover:bg-paper-2 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs font-mono font-semibold text-ink-dark">{s.id}</td>
                    <td className="px-5 py-3"><Badge tone={SUBMISSION_KIND[s.kind].tone}>{SUBMISSION_KIND[s.kind].label}</Badge></td>
                    <td className="px-5 py-3 text-xs text-ink-dark max-w-xs truncate">{s.summary}</td>
                    <td className="px-5 py-3 text-xs text-ink-dark-muted whitespace-nowrap">
                      {s.contactName}<br /><span className="font-mono">{s.phone}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-dark-muted whitespace-nowrap">{s.createdAt}</td>
                    <td className="px-5 py-3"><Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Гар утсанд карт */}
            <ul className="md:hidden divide-y divide-line-light">
              {rows.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(s)}
                    className="w-full text-left px-4 py-3 hover:bg-paper-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-semibold text-ink-dark">{s.id}</span>
                      <Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge>
                    </div>
                    <div className="mt-1.5 text-xs font-semibold text-ink-dark">{s.summary}</div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <Badge tone={SUBMISSION_KIND[s.kind].tone}>{SUBMISSION_KIND[s.kind].label}</Badge>
                      <span className="text-[11px] text-ink-dark-muted">{s.contactName} · {s.createdAt}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {/* Дэлгэрэнгүй */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setOpen(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Бүртгэл ${open.id}`}
            onClick={(e) => e.stopPropagation()}
            className="theme-light w-full sm:max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-paper border border-line-light"
          >
            <div className="sticky top-0 bg-paper border-b border-line-light px-5 py-3.5 flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono font-bold text-ink-dark">{open.id}</div>
                <div className="mt-1"><Badge tone={SUBMISSION_KIND[open.kind].tone}>{SUBMISSION_KIND[open.kind].label}</Badge></div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Хаах"
                className="p-1.5 rounded-lg hover:bg-paper-3 text-ink-dark-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-ink-dark">{open.summary}</p>
              <p className="mt-1 text-xs text-ink-dark-muted">
                {open.contactName} · <a href={`tel:${open.phone.replace(/\D/g, '')}`} className="font-mono hover:text-brand">{open.phone}</a> · {open.createdAt}
              </p>

              <dl className="mt-4 space-y-2">
                {textDetails.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[minmax(0,9rem)_1fr] gap-3 text-xs">
                    <dt className="text-ink-dark-muted">{k}</dt>
                    <dd className="text-ink-dark font-medium whitespace-pre-line">{v}</dd>
                  </div>
                ))}
              </dl>

              {photoDetails.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-2">
                    Хавсаргасан зураг ({photoDetails.length})
                  </div>
                  <ul className="flex flex-wrap gap-2.5">
                    {photoDetails.map(([k, src]) => (
                      <li key={k}>
                        {/* Шинэ цонхонд нээж бүтэн хэмжээгээр нь хардаг */}
                        <a href={src} target="_blank" rel="noopener noreferrer" title={`${k} — бүтэн хэмжээгээр нээх`}>
                          <img
                            src={src}
                            alt={k}
                            className="w-28 h-28 object-cover rounded-xl border border-line-light hover:border-brand transition-colors"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-line-light">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-2">
                  Төлөв өөрчлөх
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_ORDER.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        void setSubmissionStatus(open.id, st).then((err) => {
                          if (err) alert(err);
                          else setOpen({ ...open, status: st });
                        });
                      }}
                      className={`h-9 px-3.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        open.status === st
                          ? 'bg-brand border-brand text-white'
                          : 'bg-paper border-line-light text-ink-dark-muted hover:border-brand hover:text-brand'
                      }`}
                    >
                      {SUBMISSION_STATUS[st].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
