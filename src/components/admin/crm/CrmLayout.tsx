import React, { useMemo } from 'react';
import { NavLink, Outlet, useMatch } from 'react-router-dom';
import { AlertTriangle, Building2, CalendarCheck, KanbanSquare, Loader2 } from 'lucide-react';
import { useCrm } from '../../../store/crmStore';
import { isOpenDeal, moneyShort } from '../../../lib/crm';
import { Panel } from '../adminUi';

const Kpi: React.FC<{ label: string; value: string | number; hint?: string; tone?: 'warn' | 'danger' | 'ok' }> = ({
  label, value, hint, tone,
}) => (
  <div className="rounded-xl bg-paper border border-line-light px-4 py-3 min-w-0">
    <div className="text-[11px] text-ink-dark-muted truncate">{label}</div>
    <div className={`mt-0.5 text-xl font-black tabular-nums truncate ${
      tone === 'danger' ? 'text-red-700' : tone === 'warn' ? 'text-amber-700' : tone === 'ok' ? 'text-emerald-700' : 'text-ink-dark'
    }`}>{value}</div>
    {hint && <div className="text-[11px] text-ink-dark-subtle truncate">{hint}</div>}
  </div>
);

/** CRM — дээд хэсгийн үзүүлэлт, таб, дэд хуудас */
export const CrmLayout: React.FC = () => {
  const { loading, notInstalled, error, companies, deals, activities } = useCrm();
  // Нэг харилцагчийн хуудсанд нэгдсэн үзүүлэлт шаардлагагүй
  const onCompany = !!useMatch('/admin/crm/c/:id');

  const kpi = useMemo(() => {
    const open = deals.filter(isOpenDeal);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const wonMonth = deals.filter((d) => d.stage === 'won' && d.closedAt && new Date(d.closedAt) >= monthStart);
    const now = Date.now();
    const overdue = activities.filter((a) => a.kind === 'task' && !a.done && a.dueAt && new Date(a.dueAt).getTime() < now).length;
    return {
      customers: companies.filter((c) => c.stage === 'customer').length,
      soh: companies.filter((c) => c.kind === 'soh').length,
      openCount: open.length,
      openSum: open.reduce((s, d) => s + d.amount, 0),
      wonCount: wonMonth.length,
      wonSum: wonMonth.reduce((s, d) => s + d.amount, 0),
      overdue,
    };
  }, [companies, deals, activities]);

  const tab = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 h-10 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
      isActive ? 'bg-brand text-white' : 'text-ink-dark-muted hover:text-brand hover:bg-paper'
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink-dark">CRM</h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-dark-muted">
            СӨХ, хамтрагч байгууллагууд — холбогдох хүн, хүсэлт, лифт, хэлцэл, ажил нэг дор.
          </p>
        </div>
        <nav aria-label="CRM" className="flex gap-1 p-1 rounded-xl bg-paper-3 border border-line-light overflow-x-auto max-w-full">
          <NavLink to="/admin/crm" end className={tab}><Building2 className="w-4 h-4" /> Харилцагчид</NavLink>
          <NavLink to="/admin/crm/deals" className={tab}><KanbanSquare className="w-4 h-4" /> Хэлцэл</NavLink>
          <NavLink to="/admin/crm/tasks" className={tab}>
            <CalendarCheck className="w-4 h-4" /> Ажлууд
            {kpi.overdue > 0 && (
              <span aria-label={`${kpi.overdue} хугацаа хэтэрсэн`} className="min-w-5 h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">{kpi.overdue}</span>
            )}
          </NavLink>
        </nav>
      </div>

      {notInstalled ? (
        <Panel className="p-6">
          <div className="flex items-center gap-2 font-bold text-amber-900"><AlertTriangle className="w-4 h-4" /> CRM-ийн хүснэгт үүсээгүй байна</div>
          <p id="crm-not-installed" className="mt-2 text-sm text-ink-dark-muted">
            Supabase → SQL Editor дээр <code className="font-mono">supabase/crm.sql</code>-ийг ажиллуулна уу.
          </p>
        </Panel>
      ) : error ? (
        <Panel className="p-5 border-red-200 bg-red-50"><p role="alert" className="text-sm text-red-800">{error}</p></Panel>
      ) : loading && companies.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-ink-dark-muted"><Loader2 className="w-4 h-4 animate-spin" /> Ачаалж байна…</div>
      ) : (
        <>
          <div id="crm-kpi" className={`${onCompany ? 'hidden' : 'grid'} grid-cols-2 lg:grid-cols-5 gap-2.5 mb-5`}>
            <Kpi label="Харилцагч" value={companies.length} hint={`${kpi.soh} СӨХ`} />
            <Kpi label="Гэрээт харилцагч" value={kpi.customers} tone="ok" />
            <Kpi label="Нээлттэй хэлцэл" value={kpi.openCount} hint={moneyShort(kpi.openSum)} />
            <Kpi label="Энэ сард амжилттай" value={kpi.wonCount} hint={moneyShort(kpi.wonSum)} tone="ok" />
            <Kpi label="Хугацаа хэтэрсэн ажил" value={kpi.overdue} tone={kpi.overdue ? 'danger' : undefined} />
          </div>
          <Outlet />
        </>
      )}
    </div>
  );
};

export default CrmLayout;
