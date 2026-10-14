import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { useAdminStore } from '../../../store/adminStore';
import type { Activity } from '../../../lib/crm';
import { AdminModal, Panel } from '../adminUi';
import { ActivityComposer, ActivityItem, CompanyPicker, btnPrimary, fieldBase, label } from './crmUi';

/** Ажлууд — хугацаагаар бүлэглэсэн */
export const CrmTasks: React.FC = () => {
  const { activities, staff } = useCrm();
  const { user } = useAdminStore();
  const [who, setWho] = useState('me');
  const [showDone, setShowDone] = useState(false);
  const [adding, setAdding] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const groups = useMemo(() => {
    const tasks = activities.filter((a) => a.kind === 'task').filter((a) =>
      who === 'all' ? true : who === 'me' ? a.assigneeId === user?.id || (!a.assigneeId && a.createdBy === user?.id) : a.assigneeId === who
    );
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    const week = new Date(start); week.setDate(week.getDate() + 7);
    const due = (a: Activity) => (a.dueAt ? new Date(a.dueAt).getTime() : Infinity);
    const open = tasks.filter((a) => !a.done).sort((a, b) => due(a) - due(b));
    return [
      { id: 'overdue', title: 'Хугацаа хэтэрсэн', tone: 'text-red-700', items: open.filter((a) => due(a) < start.getTime()) },
      { id: 'today', title: 'Өнөөдөр', tone: 'text-amber-700', items: open.filter((a) => due(a) >= start.getTime() && due(a) < end.getTime()) },
      { id: 'week', title: '7 хоногт', tone: 'text-ink-dark', items: open.filter((a) => due(a) >= end.getTime() && due(a) < week.getTime()) },
      { id: 'later', title: 'Дараа', tone: 'text-ink-dark-muted', items: open.filter((a) => due(a) >= week.getTime()) },
      ...(showDone ? [{ id: 'done', title: 'Дууссан', tone: 'text-emerald-700', items: tasks.filter((a) => a.done).slice(0, 50) }] : []),
    ];
  }, [activities, who, showDone, user]);

  const total = groups.filter((g) => g.id !== 'done').reduce((s, g) => s + g.items.length, 0);

  return (
    <div>
      <Panel className="p-3 mb-3 flex flex-wrap items-center gap-2">
        <select value={who} onChange={(e) => setWho(e.target.value)} aria-label="Хэний ажил" className={`${fieldBase} sm:w-52`}>
          <option value="me">Миний ажил</option>
          <option value="all">Бүх ажил</option>
          {staff.filter((s) => s.id !== user?.id).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-dark-muted cursor-pointer">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="w-4 h-4" /> Дууссаныг харуулах
        </label>
        <button type="button" onClick={() => setAdding(true)} className={`${btnPrimary} ml-auto`} id="task-add"><Plus className="w-4 h-4" /> Ажил</button>
      </Panel>

      {total === 0 && !showDone ? (
        <Panel className="p-10 text-center text-sm text-ink-dark-muted">Хийх ажил алга. 🎉</Panel>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2" id="task-groups">
          {groups.filter((g) => g.items.length).map((g) => (
            <Panel key={g.id} className="px-4 pt-3" >
              <h3 className={`text-xs font-black uppercase tracking-wider ${g.tone}`} data-group={g.id}>{g.title} · {g.items.length}</h3>
              <ul className="divide-y divide-line-light">{g.items.map((a) => <ActivityItem key={a.id} a={a} showCompany />)}</ul>
            </Panel>
          ))}
        </div>
      )}

      {adding && (
        <AdminModal title="Шинэ ажил" onClose={() => setAdding(false)}>
          <div className="space-y-4">
            <div>
              <span className={label}>Харилцагч (заавал биш)</span>
              <CompanyPicker value={companyId} onChange={setCompanyId} />
            </div>
            <ActivityComposer companyId={companyId} initialKind="task" onAdded={() => setAdding(false)} />
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default CrmTasks;
