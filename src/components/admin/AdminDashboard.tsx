import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpDown, ClipboardList, Package, Wrench } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Badge, ELEVATOR_STATUS, PageHead, Panel, SUBMISSION_KIND, SUBMISSION_STATUS } from './adminUi';

const StatCard: React.FC<{
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
  tone?: 'brand' | 'danger' | 'warn';
}> = ({ to, icon: Icon, value, label, tone = 'brand' }) => {
  const color =
    tone === 'danger' ? 'text-red-700 bg-red-50 border-red-200'
    : tone === 'warn' ? 'text-amber-800 bg-amber-50 border-amber-200'
    : 'text-brand bg-sky-50 border-sky-200';
  return (
    <Link to={to} className="block rounded-xl bg-paper border border-line-light p-5 hover:border-brand transition-colors">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="mt-3 text-3xl font-black tabular-nums text-ink-dark">{value}</div>
      <div className="mt-0.5 text-xs text-ink-dark-muted">{label}</div>
    </Link>
  );
};

export const AdminDashboard: React.FC = () => {
  const { submissions, elevators, serviceRecords, products } = useAdminStore();

  const newCount = submissions.filter((s) => s.status === 'new').length;
  const faults = elevators.filter((e) => e.status === 'fault' || e.status === 'offline');
  const lowStock = products.filter((p) => p.stockCount > 0 && p.stockCount <= 5);
  const outOfStock = products.filter((p) => p.stockCount === 0);

  const recentSubs = [...submissions].slice(0, 6);
  const recentRecords = [...serviceRecords].slice(0, 5);

  return (
    <div>
      <PageHead
        title="Хяналтын самбар"
        lead="Шинэ хүсэлт, анхаарал шаардсан тоноглол, нөөцийн байдал."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard to="/admin/submissions" icon={ClipboardList} value={newCount}
          label="Шинэ хүсэлт" tone={newCount ? 'warn' : 'brand'} />
        <StatCard to="/admin/elevators" icon={AlertTriangle} value={faults.length}
          label="Анхаарал шаардсан лифт" tone={faults.length ? 'danger' : 'brand'} />
        <StatCard to="/admin/elevators" icon={ArrowUpDown} value={elevators.length}
          label="Үйлчилгээнд буй лифт" />
        <StatCard to="/admin/products" icon={Package} value={outOfStock.length + lowStock.length}
          label="Нөөц дуусаж буй сэлбэг" tone={outOfStock.length ? 'danger' : lowStock.length ? 'warn' : 'brand'} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Сүүлийн хүсэлтүүд */}
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-line-light">
            <h2 className="text-sm font-bold text-ink-dark">Сүүлийн хүсэлтүүд</h2>
            <Link to="/admin/submissions" className="text-xs font-semibold text-brand hover:underline">
              Бүгдийг харах
            </Link>
          </div>
          <ul className="divide-y divide-line-light">
            {recentSubs.map((s) => (
              <li key={s.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink-dark truncate">{s.summary}</div>
                    <div className="mt-0.5 text-[11px] text-ink-dark-muted">
                      {s.id} · {s.contactName} · {s.createdAt}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge tone={SUBMISSION_KIND[s.kind].tone}>{SUBMISSION_KIND[s.kind].label}</Badge>
                    <Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          {/* Анхаарал шаардсан */}
          <Panel className="overflow-hidden">
            <div className="px-5 py-3.5 border-b border-line-light">
              <h2 className="text-sm font-bold text-ink-dark">Анхаарал шаардсан тоноглол</h2>
            </div>
            {faults.length === 0 ? (
              <p className="px-5 py-6 text-xs text-ink-dark-muted">Бүх лифт хэвийн ажиллаж байна.</p>
            ) : (
              <ul className="divide-y divide-line-light">
                {faults.map((e) => (
                  <li key={e.id} className="px-5 py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ink-dark truncate">{e.building}</div>
                      <div className="mt-0.5 text-[11px] text-ink-dark-muted">
                        {e.code} · {e.address}
                      </div>
                    </div>
                    <Badge tone={ELEVATOR_STATUS[e.status].tone}>{ELEVATOR_STATUS[e.status].label}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Сүүлийн үйлчилгээ */}
          <Panel className="overflow-hidden">
            <div className="px-5 py-3.5 border-b border-line-light flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink-dark">Сүүлд хийсэн үйлчилгээ</h2>
            </div>
            <ul className="divide-y divide-line-light">
              {recentRecords.map((r) => {
                const lift = elevators.find((e) => e.id === r.elevatorId);
                return (
                  <li key={r.id} className="px-5 py-3">
                    <div className="text-xs font-semibold text-ink-dark truncate">
                      {lift?.building ?? r.elevatorId}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-dark-muted">
                      {r.date} · {r.engineer} · {r.durationMin} мин
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
