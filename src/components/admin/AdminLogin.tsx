import React, { useState } from 'react';
import { AlertTriangle, Loader2, Lock, ShieldOff } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { DeltaLiftsLogo } from '../DeltaLiftsLogo';

const field =
  'w-full h-11 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark ' +
  'placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none transition-colors';
const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="theme-light min-h-dvh bg-surface-2 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <DeltaLiftsLogo size="lg" showText />
      </div>
      <div className="rounded-xl bg-paper border border-line-light p-6">{children}</div>
    </div>
  </div>
);

export const AdminLogin: React.FC = () => {
  const { login, notConfigured, status, user, logout, loadError } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Түлхүүр бөглөгдөөгүй
  if (notConfigured) {
    return (
      <Shell>
        <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
          <AlertTriangle className="w-4 h-4" />
          Supabase тохируулагдаагүй
        </div>
        <p className="text-xs text-ink-dark-muted mb-3">
          Төслийн үндсэн хавтсанд <code className="font-mono">.env</code> файл үүсгэж,
          Supabase төслийн түлхүүрээ бөглөнө үү:
        </p>
        <pre className="p-3 rounded-lg bg-paper-3 border border-line-light text-[11px] font-mono overflow-x-auto text-ink-dark">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...`}
        </pre>
        <p className="mt-3 text-[11px] text-ink-dark-subtle">
          Түлхүүрийг Supabase Dashboard → Project Settings → API хэсгээс авна.
          Дараа нь <code className="font-mono">npm run dev</code>-ээ дахин асаана.
        </p>
      </Shell>
    );
  }

  // 2. Нэвтэрсэн ч админ эрхгүй
  if (status === 'unauthorized') {
    return (
      <Shell>
        <div className="flex items-center gap-2 font-bold text-ink-dark mb-2">
          <ShieldOff className="w-4 h-4 text-red-700" />
          Эрх хүрэхгүй байна
        </div>
        <p className="text-xs text-ink-dark-muted">
          <span className="font-semibold text-ink-dark">{user?.email}</span> хаягаар нэвтэрсэн
          боловч энэ бүртгэлд админ эрх олгогдоогүй байна. Байгууллагын администратортай
          холбогдож эрх хүсэх эсвэл өөр бүртгэлээр нэвтэрнэ үү.
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-4 w-full h-10 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors"
        >
          Гарах
        </button>
      </Shell>
    );
  }

  // 3. Нэвтрэх
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await login(email, password);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <Shell>
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-4 h-4 text-brand" />
        <h1 className="text-base font-black text-ink-dark">Удирдлагын хэсэг</h1>
      </div>
      <p className="text-xs text-ink-dark-muted mb-5">Үргэлжлүүлэхийн тулд нэвтэрнэ үү.</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={label} htmlFor="login-email">Имэйл</label>
          <input
            id="login-email" type="email" autoComplete="username" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lift.mn" className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="login-password">Нууц үг</label>
          <input
            id="login-password" type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" className={field}
          />
        </div>

        {(error || loadError) && (
          <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error || loadError}
          </p>
        )}

        <button
          type="submit" disabled={busy}
          className="w-full h-11 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Шалгаж байна…' : 'Нэвтрэх'}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] text-ink-dark-subtle">
        Нууц үгээ мартсан бол администратортай холбогдоно уу.
      </p>
    </Shell>
  );
};

export default AdminLogin;
