import React, { useMemo, useState } from 'react';
import { Download, FileText, Mail, Phone, Search, Sheet } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { attachmentName, downloadDataUrl, isDocumentEntry } from '../../lib/attachments';
import { NK, NAADAM, SPORTS, isNaadamEntry, sportById } from '../../data/naadamData';
import { Badge, PageHead, Panel, SUBMISSION_STATUS } from './adminUi';
import type { Submission } from '../../types';

/** Бүртгэлийн сонгосон төрлүүд (id) */
const sportIdsOf = (s: Submission) => (s.details[NK.sportIds] ?? '').split(',').filter(Boolean);

/** Хавсаргасан баримтууд */
const filesOf = (s: Submission) => Object.entries(s.details).filter(([, v]) => isDocumentEntry(v));

/** Excel-д кирилл зөв харагдахын тулд BOM-той CSV */
function exportCsv(rows: Submission[]) {
  const cols = ['Дугаар', 'Огноо', NK.org, NK.name, NK.position, NK.phone, NK.email, ...SPORTS.map((s) => s.label), 'Мэдүүлэг'];
  const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((s) => {
    const ids = sportIdsOf(s);
    return [
      s.id, s.createdAt, s.details[NK.org], s.details[NK.name], s.details[NK.position], s.details[NK.phone], s.details[NK.email],
      ...SPORTS.map((sp) => (ids.includes(sp.id) ? '✓' : '')),
      filesOf(s).map(([k]) => attachmentName(k)).join('; '),
    ].map(esc).join(',');
  });
  const blob = new Blob(['﻿' + [cols.map(esc).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sportnaadam-2026-burtgel.csv';
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Спортын их наадмын бүртгэлүүд */
export const AdminNaadam: React.FC = () => {
  const { submissions } = useAdminStore();
  const [sport, setSport] = useState<string>('all');
  const [query, setQuery] = useState('');

  const all = useMemo(() => submissions.filter(isNaadamEntry), [submissions]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of all) for (const id of sportIdsOf(s)) c[id] = (c[id] ?? 0) + 1;
    return c;
  }, [all]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((s) => {
      if (sport !== 'all' && !sportIdsOf(s).includes(sport)) return false;
      if (!q) return true;
      return [s.id, s.details[NK.org], s.details[NK.name], s.phone, s.details[NK.email]].join(' ').toLowerCase().includes(q);
    });
  }, [all, sport, query]);

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-bold cursor-pointer transition ${
      active ? 'bg-brand text-white border-brand' : 'bg-paper text-ink-dark-muted border-line-light hover:border-brand hover:text-brand'
    }`;

  return (
    <div>
      <PageHead
        title="Спортын наадам"
        lead={`${NAADAM.edition} ${NAADAM.title.toLowerCase()} · ${NAADAM.dateLabel} · /sportnaadam хуудсаар ирсэн бүртгэл`}
        right={
          <div className="flex gap-2">
            <a
              href="/sportnaadam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-10 px-4 rounded-lg border border-line-light text-xs font-bold text-ink-dark hover:border-brand hover:text-brand"
            >
              Хуудсыг нээх ↗
            </a>
            <button
              id="naadam-csv"
              type="button"
              disabled={!shown.length}
              onClick={() => exportCsv(shown)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-brand text-white text-xs font-bold hover:bg-brand-hover disabled:opacity-50 cursor-pointer"
            >
              <Sheet className="w-4 h-4" />
              Excel (CSV) татах
            </button>
          </div>
        }
      />

      <Panel className="p-4 mb-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setSport('all')} className={chip(sport === 'all')}>
            Бүгд <span className="tabular-nums opacity-80">{all.length}</span>
          </button>
          {SPORTS.map((s) => (
            <button key={s.id} type="button" onClick={() => setSport(s.id)} className={chip(sport === s.id)}>
              <span aria-hidden="true">{s.emoji}</span>
              {s.label}
              <span className="tabular-nums opacity-80">{counts[s.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Байгууллага, нэр, утас, имэйлээр хайх"
            aria-label="Наадмын бүртгэлээс хайх"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none"
          />
        </div>
      </Panel>

      {shown.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-ink-dark-muted">
          {all.length ? 'Шүүлтүүрт тохирох бүртгэл алга.' : 'Одоогоор бүртгэл ирээгүй байна.'}
        </Panel>
      ) : (
        <ul id="naadam-list" className="grid gap-3 lg:grid-cols-2">
          {shown.map((s) => (
            <li key={s.id}>
              <Panel className="p-4 h-full flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-black text-ink-dark truncate">{s.details[NK.org]}</div>
                    <div className="text-xs text-ink-dark-muted">
                      {s.details[NK.name]}
                      {s.details[NK.position] ? ` · ${s.details[NK.position]}` : ''}
                    </div>
                  </div>
                  <Badge tone={SUBMISSION_STATUS[s.status]?.tone ?? 'slate'}>{SUBMISSION_STATUS[s.status]?.label ?? s.status}</Badge>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sportIdsOf(s).map((id) => {
                    const sp = sportById(id);
                    return (
                      <span key={id} className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-paper-3 border border-line-light text-[11px] font-bold text-ink-dark">
                        <span aria-hidden="true">{sp?.emoji}</span>
                        {sp?.label ?? id}
                      </span>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <a href={`tel:${s.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-1.5 py-1 font-mono font-semibold text-ink-dark hover:text-brand">
                    <Phone className="w-3.5 h-3.5" /> {s.phone}
                  </a>
                  {s.details[NK.email] && (
                    <a href={`mailto:${s.details[NK.email]}`} className="inline-flex items-center gap-1.5 py-1 text-ink-dark hover:text-brand break-all">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {s.details[NK.email]}
                    </a>
                  )}
                </div>

                {filesOf(s).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => void downloadDataUrl(v, attachmentName(k))}
                    className="flex items-center gap-2 h-10 px-3 rounded-lg border border-line-light hover:border-brand text-xs font-semibold text-ink-dark cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-brand shrink-0" />
                    <span className="truncate">CS2 мэдүүлэг: {attachmentName(k)}</span>
                    <Download className="w-4 h-4 ml-auto text-brand shrink-0" />
                  </button>
                ))}

                <div className="mt-auto text-[11px] text-ink-dark-subtle font-mono">
                  {s.id} · {s.createdAt}
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNaadam;
