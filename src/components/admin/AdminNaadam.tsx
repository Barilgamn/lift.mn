import React, { useMemo, useState } from 'react';
import { Download, FileText, Loader2, Mail, Phone, Search, Sheet, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { attachmentName, downloadAttachment, isDocumentEntry } from '../../lib/attachments';
import { NK, NAADAM, SPORTS, isNaadamEntry, sportById } from '../../data/naadamData';
import { Badge, PageHead, Panel, SUBMISSION_STATUS } from './adminUi';
import type { Submission } from '../../types';

/** Бүртгэлийн сонгосон төрлүүд (id) */
const sportIdsOf = (s: Submission) => (s.details[NK.sportIds] ?? '').split(',').filter(Boolean);

/** Хавсаргасан бүх баримт */
const filesOf = (s: Submission) => Object.entries(s.details).filter(([, v]) => isDocumentEntry(v));

/**
 * Тухайн багийн (төрлийн) мэдүүлэг. Шинэ бүртгэлд төрөл → файл холбоос
 * (`_files`) хадгалагддаг. Түүнээс өмнөх бүртгэлд холбоос байхгүй тул
 * бүх файлыг харуулна.
 */
function teamFiles(s: Submission, sportId: string): [string, string][] {
  let map: Record<string, string> = {};
  try {
    map = JSON.parse(s.details[NK.files] || '{}');
  } catch {
    map = {};
  }
  const key = map[sportId];
  if (key && s.details[key]) return [[key, s.details[key]]];
  return Object.keys(map).length ? [] : filesOf(s);
}

/** Нэг баг = нэг байгууллага × нэг төрөл */
interface Team {
  key: string;
  sub: Submission;
  sportId: string;
}

/** Excel-д кирилл зөв харагдахын тулд BOM-той CSV — баг тус бүр нэг мөр */
function exportCsv(rows: Team[]) {
  const cols = ['Дугаар', 'Огноо', 'Төрөл', NK.org, NK.name, NK.position, NK.phone, NK.email, 'Мэдүүлэг'];
  const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map(({ sub: s, sportId }) =>
    [
      s.id, s.createdAt, sportById(sportId)?.label ?? sportId,
      s.details[NK.org], s.details[NK.name], s.details[NK.position], s.details[NK.phone], s.details[NK.email],
      teamFiles(s, sportId).map(([k]) => attachmentName(k)).join('; '),
    ].map(esc).join(',')
  );
  const blob = new Blob(['﻿' + [cols.map(esc).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sportnaadam-2026-baguud.csv';
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Спортын их наадмын бүртгэлүүд — баг тус бүрээр */
export const AdminNaadam: React.FC = () => {
  const { submissions, deleteSubmission } = useAdminStore();
  const [sport, setSport] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  /** Байгууллагын бүртгэлийг (бүх баг, мэдүүлэгтэй нь) устгана */
  const remove = async (s: Submission) => {
    const labels = sportIdsOf(s).map((id) => sportById(id)?.label ?? id);
    const ok = window.confirm(
      `"${s.details[NK.org] ?? s.contactName}" байгууллагын бүртгэлийг устгах уу?\n\n` +
        `${labels.length} баг (${labels.join(', ')}) болон хавсаргасан мэдүүлгүүд бүгд устна. Буцаах боломжгүй.`
    );
    if (!ok) return;
    setDeleting(s.id);
    const err = await deleteSubmission(s.id);
    setDeleting(null);
    if (err) window.alert(err);
  };
  const [query, setQuery] = useState('');

  const all = useMemo(() => submissions.filter(isNaadamEntry), [submissions]);
  const teams = useMemo<Team[]>(
    () => all.flatMap((sub) => sportIdsOf(sub).map((sportId) => ({ key: `${sub.id}:${sportId}`, sub, sportId }))),
    [all]
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of teams) c[t.sportId] = (c[t.sportId] ?? 0) + 1;
    return c;
  }, [teams]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter(({ sub: s, sportId }) => {
      if (sport !== 'all' && sportId !== sport) return false;
      if (!q) return true;
      return [s.id, s.details[NK.org], s.details[NK.name], s.phone, s.details[NK.email]].join(' ').toLowerCase().includes(q);
    });
  }, [teams, sport, query]);

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-bold cursor-pointer transition ${
      active ? 'bg-brand text-white border-brand' : 'bg-paper text-ink-dark-muted border-line-light hover:border-brand hover:text-brand'
    }`;

  return (
    <div>
      <PageHead
        title="Спортын наадам"
        lead={`${NAADAM.edition} ${NAADAM.title.toLowerCase()} · ${NAADAM.dateLabel} · ${all.length} байгууллага, ${teams.length} баг бүртгүүлсэн`}
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
            Бүх баг <span className="tabular-nums opacity-80">{teams.length}</span>
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
          {teams.length ? 'Шүүлтүүрт тохирох баг алга.' : 'Одоогоор бүртгэл ирээгүй байна.'}
        </Panel>
      ) : (
        <ul id="naadam-list" className="grid gap-3 lg:grid-cols-2">
          {shown.map(({ key, sub: s, sportId }) => {
            const sp = sportById(sportId);
            const files = teamFiles(s, sportId);
            const others = sportIdsOf(s).filter((id) => id !== sportId).map((id) => sportById(id)?.label ?? id);
            return (
              <li key={key} data-team={key}>
                <Panel className="p-4 h-full flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    {sp && <img src={sp.icon} alt="" className="w-11 h-10 object-contain shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-brand">{sp?.label ?? sportId}</div>
                      <div className="font-black text-ink-dark truncate">{s.details[NK.org]}</div>
                      <div className="text-xs text-ink-dark-muted">
                        {s.details[NK.name]}
                        {s.details[NK.position] ? ` · ${s.details[NK.position]}` : ''}
                      </div>
                    </div>
                    <Badge tone={SUBMISSION_STATUS[s.status]?.tone ?? 'slate'}>{SUBMISSION_STATUS[s.status]?.label ?? s.status}</Badge>
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

                  {files.length ? (
                    files.map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => void downloadAttachment(v, attachmentName(k))}
                        className="flex items-center gap-2 h-10 px-3 rounded-lg border border-line-light hover:border-brand text-xs font-semibold text-ink-dark cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-brand shrink-0" />
                        <span className="truncate">Мэдүүлэг: {attachmentName(k)}</span>
                        <Download className="w-4 h-4 ml-auto text-brand shrink-0" />
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-amber-700">Мэдүүлэг хавсаргаагүй</p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-dark-subtle">
                    <span>{s.createdAt}</span>
                    {others.length > 0 && <span>Мөн: {others.join(', ')}</span>}
                    <button
                      type="button"
                      onClick={() => void remove(s)}
                      disabled={deleting === s.id}
                      aria-label={`${s.details[NK.org] ?? ''} бүртгэлийг устгах`}
                      className="ml-auto inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-red-600 hover:bg-red-50 font-bold cursor-pointer disabled:opacity-50"
                    >
                      {deleting === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Устгах
                    </button>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminNaadam;
