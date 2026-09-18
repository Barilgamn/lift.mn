import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpDown,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  LogOut,
  Map as MapIcon,
  Package,
} from 'lucide-react';
import { AdminStoreProvider, useAdminStore } from '../../store/adminStore';
import { DeltaLiftsLogo } from '../DeltaLiftsLogo';
import { AdminLogin } from './AdminLogin';

export const ADMIN_NAV = [
  { to: '/admin', end: true, label: 'Хяналтын самбар', icon: LayoutDashboard },
  { to: '/admin/submissions', label: 'Бүртгэлүүд', icon: ClipboardList },
  { to: '/admin/map', label: 'Газрын зураг', icon: MapIcon },
  { to: '/admin/elevators', label: 'Лифтүүд', icon: ArrowUpDown },
  { to: '/admin/products', label: 'Бүтээгдэхүүн', icon: Package },
];

const AdminChrome: React.FC = () => {
  const { user, logout, loadError } = useAdminStore();

  return (
    <div className="theme-light min-h-dvh bg-surface-2 text-ink flex flex-col">
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

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:block text-right mr-1">
              <span className="block text-xs font-bold text-ink-dark leading-tight">{user?.name}</span>
              <span className="block text-[11px] text-ink-dark-muted leading-tight">{user?.email}</span>
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Сайт</span>
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted hover:text-red-700 hover:border-red-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Гарах</span>
            </button>
          </div>
        </div>

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
      </header>

      {loadError && (
        <p role="alert" className="px-4 sm:px-6 py-2 bg-red-50 border-b border-red-200 text-xs text-red-800">
          {loadError}
        </p>
      )}

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

/** Нэвтрэлтийн байдлаас хамаарч нэвтрэх дэлгэц эсвэл админыг харуулна */
const AdminGate: React.FC = () => {
  const { status } = useAdminStore();

  if (status === 'loading') {
    return (
      <div className="theme-light min-h-dvh bg-surface-2 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-ink-dark-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          Ачаалж байна…
        </div>
      </div>
    );
  }

  return status === 'authenticated' ? <AdminChrome /> : <AdminLogin />;
};

export const AdminLayout: React.FC = () => (
  <AdminStoreProvider>
    <AdminGate />
  </AdminStoreProvider>
);

export default AdminLayout;
