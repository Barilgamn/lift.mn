import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  LayoutDashboard,
  Map as MapIcon,
  Package,
  RotateCcw,
  ArrowUpDown,
} from 'lucide-react';
import { AdminStoreProvider, useAdminStore } from '../../store/adminStore';
import { DeltaLiftsLogo } from '../DeltaLiftsLogo';

export const ADMIN_NAV = [
  { to: '/admin', end: true, label: 'Хяналтын самбар', icon: LayoutDashboard },
  { to: '/admin/submissions', label: 'Бүртгэлүүд', icon: ClipboardList },
  { to: '/admin/map', label: 'Газрын зураг', icon: MapIcon },
  { to: '/admin/elevators', label: 'Лифтүүд', icon: ArrowUpDown },
  { to: '/admin/products', label: 'Бүтээгдэхүүн', icon: Package },
];

/** Прототип гэдгийг тодорхой хэлэх анхааруулга */
const PrototypeNotice: React.FC = () => {
  const { resetAll } = useAdminStore();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 sm:px-6 py-2 bg-amber-50 border-b border-amber-200 text-[11px] sm:text-xs text-amber-900">
      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
      <span className="font-semibold">Прототип:</span>
      <span>
        нэвтрэлт байхгүй, өгөгдөл зөвхөн энэ хөтөчид хадгалагдана. Бодит ашиглалтад
        сервер, нэвтрэлт шаардлагатай.
      </span>
      <button
        type="button"
        onClick={() => {
          if (confirm('Бүх өөрчлөлтийг устгаж, жишээ өгөгдөл рүү буцаах уу?')) resetAll();
        }}
        className="ml-auto inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-amber-300 hover:bg-amber-100 font-semibold cursor-pointer transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Жишээ өгөгдөл сэргээх
      </button>
    </div>
  );
};

const AdminChrome: React.FC = () => (
  <div className="theme-light min-h-dvh bg-surface-2 text-ink flex flex-col">
    {/* Дээд мөр */}
    <header className="sticky top-0 z-30 bg-paper border-b border-line-light">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <DeltaLiftsLogo size="sm" showText={false} className="shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-black tracking-tight text-ink-dark truncate">
              Удирдлагын хэсэг
            </div>
            <div className="text-[11px] text-ink-dark-muted truncate">LIFT.MN · DELTA LIFT</div>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-semibold transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Сайт руу буцах</span>
        </Link>
      </div>

      {/* Хэсгүүдийн цэс — нарийн дэлгэцэд хажуу тийш гүйнэ */}
      <nav className="px-2 sm:px-4 border-t border-line-light overflow-x-auto">
        <ul className="flex items-center gap-1 min-w-max">
          {ADMIN_NAV.map(({ to, end, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 h-11 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-brand text-brand'
                      : 'border-transparent text-ink-dark-muted hover:text-brand'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <PrototypeNotice />
    </header>

    <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
);

export const AdminLayout: React.FC = () => (
  <AdminStoreProvider>
    <AdminChrome />
  </AdminStoreProvider>
);

export default AdminLayout;
