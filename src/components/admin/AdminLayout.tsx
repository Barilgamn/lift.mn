import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpDown,
  Briefcase,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Map as MapIcon,
  Package,
  ShieldOff,
  Tag,
  Trophy,
  Users,
} from 'lucide-react';
import type { Perm } from '../../lib/permissions';
import { isPriceQuote } from '../../lib/priceQuote';
import { isNaadamEntry } from '../../data/naadamData';
import { AdminStoreProvider, useAdminStore } from '../../store/adminStore';
import { LiftMnLogo } from '../LiftMnLogo';
import { AdminLogin } from './AdminLogin';
import { PasswordDialog } from './AdminUsers';
import { CrmProvider } from '../../store/crmStore';

/** Цэс — `perm` байхгүй бол бүх эрхтэй хэрэглэгчид харагдана */
export const ADMIN_NAV: {
  to: string; end?: boolean; label: string; icon: React.ComponentType<{ className?: string }>;
  badge?: 'quotes' | 'naadam'; perm?: Perm;
}[] = [
  { to: '/admin', end: true, label: 'Хяналтын самбар', icon: LayoutDashboard },
  { to: '/admin/crm', label: 'CRM', icon: Briefcase, perm: 'crm' },
  { to: '/admin/submissions', label: 'Хүсэлтүүд', icon: ClipboardList, perm: 'requests' },
  { to: '/admin/quotes', label: 'Үнийн санал', icon: Tag, badge: 'quotes', perm: 'quotes' },
  { to: '/admin/naadam', label: 'Спортын наадам', icon: Trophy, badge: 'naadam', perm: 'naadam' },
  { to: '/admin/map', label: 'Газрын зураг', icon: MapIcon, perm: 'elevators' },
  { to: '/admin/elevators', label: 'Лифтүүд', icon: ArrowUpDown, perm: 'elevators' },
  { to: '/admin/products', label: 'Бүтээгдэхүүн', icon: Package, perm: 'products' },
  { to: '/admin/users', label: 'Хэрэглэгчид', icon: Users, perm: 'users' },
];

/** Эрхгүй хуудсыг шууд хаягаар нээсэн үед */
export const RequirePerm: React.FC<{ perm: Perm; children: React.ReactNode }> = ({ perm, children }) => {
  const { can } = useAdminStore();
  if (can(perm)) return <>{children}</>;
  return (
    <div id="no-perm" className="rounded-xl bg-paper border border-line-light p-8 text-center">
      <ShieldOff className="w-6 h-6 mx-auto text-red-700" />
      <p className="mt-3 text-sm font-bold text-ink-dark">Энэ хэсэгт хандах эрх алга</p>
      <p className="mt-1 text-xs text-ink-dark-muted">Эрх хэрэгтэй бол хэрэглэгч удирдах эрхтэй админд хандана уу.</p>
      <Link to="/admin" className="mt-4 inline-flex text-xs font-bold text-brand hover:underline">Хяналтын самбар руу</Link>
    </div>
  );
};

const AdminChrome: React.FC = () => {
  const { user, logout, loadError, submissions, can } = useAdminStore();
  const [pwOpen, setPwOpen] = useState(false);
  const { pathname } = useLocation();
  // Эрхгүй хэсгийг шууд хаягаар нээвэл — RLS өгөгдлийг хаасан ч ойлгомжтой мессеж
  const section = ADMIN_NAV.find((n) => n.perm && (pathname === n.to || pathname.startsWith(`${n.to}/`)));
  /** Хариулаагүй үнийн саналын тоо — цэсэн дээр тэмдэглэгээ болно */
  const openQuotes = submissions.filter((s) => isPriceQuote(s) && s.status === 'new').length;
  const newNaadam = submissions.filter((s) => isNaadamEntry(s) && s.status === 'new').length;

  return (
    <CrmProvider enabled={can('crm')}>
    {/* Админ хэсэг Google орчуулгад өртөхгүй (маягтын утга эвдэрнэ) */}
    <div translate="no" className="notranslate theme-light min-h-dvh bg-surface-2 text-ink flex flex-col">
      <header className="sticky top-0 z-30 bg-paper border-b border-line-light">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <LiftMnLogo className="h-5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-black tracking-tight text-ink-dark truncate">
                Удирдлагын хэсэг
              </div>
              <div className="text-[11px] text-ink-dark-muted truncate">LIFT.MN</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:block text-right mr-1">
              <span className="block text-xs font-bold text-ink-dark leading-tight">{user?.name}</span>
              <span className="block text-[11px] text-ink-dark-muted leading-tight">{user?.email}</span>
            </span>
            <button
              id="my-password"
              type="button"
              onClick={() => setPwOpen(true)}
              title="Нууц үг солих"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-semibold cursor-pointer transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Нууц үг</span>
            </button>
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
            {ADMIN_NAV.filter((n) => !n.perm || can(n.perm)).map(({ to, end, label, icon: Icon, badge }) => (
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
                  {badge === 'quotes' && openQuotes > 0 && (
                    <span
                      id="nav-quotes-badge"
                      aria-label={`${openQuotes} хариулаагүй`}
                      className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black tabular-nums"
                    >
                      {openQuotes}
                    </span>
                  )}
                  {badge === 'naadam' && newNaadam > 0 && (
                    <span
                      id="nav-naadam-badge"
                      aria-label={`${newNaadam} шинэ бүртгэл`}
                      className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tabular-nums"
                    >
                      {newNaadam}
                    </span>
                  )}
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

      {pwOpen && user && <PasswordDialog target={user} self onClose={() => setPwOpen(false)} />}

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {section?.perm && !can(section.perm) ? <RequirePerm perm={section.perm}>{null}</RequirePerm> : <Outlet />}
        </div>
      </main>
    </div>
    </CrmProvider>
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

  // anonymous, unauthorized, тохируулагдаагүй — бүгд нэвтрэх дэлгэц рүү
  return status === 'authenticated' ? <AdminChrome /> : <AdminLogin />;
};

export const AdminLayout: React.FC = () => (
  <AdminStoreProvider>
    <AdminGate />
  </AdminStoreProvider>
);

export default AdminLayout;
