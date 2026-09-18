import React, { useState } from 'react';
import { AlertTriangle, Loader2, Lock } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { DeltaLiftsLogo } from '../DeltaLiftsLogo';

/** Нэвтрэх дэлгэц */
export const AdminLogin: React.FC = () => {
  const { login, needsSetup, loadError } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await login(email, password);
    setBusy(false);
    if (err) setError(err);
  };

  const field =
    'w-full h-11 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark ' +
    'placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none transition-colors';
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';

  return (
    <div className="theme-light min-h-dvh bg-surface-2 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <DeltaLiftsLogo size="lg" showText />
        </div>

        <div className="rounded-xl bg-paper border border-line-light p-6">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-brand" />
            <h1 className="text-base font-black text-ink-dark">Удирдлагын хэсэг</h1>
          </div>
          <p className="text-xs text-ink-dark-muted mb-5">
            Үргэлжлүүлэхийн тулд нэвтэрнэ үү.
          </p>

          {needsSetup ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold mb-1.5">
                <AlertTriangle className="w-4 h-4" />
                Админ бүртгэл үүсээгүй байна
              </div>
              <p className="mb-2">Серверийн терминал дээр дараах тушаалыг ажиллуулж админ үүсгэнэ:</p>
              <code className="block p-2 rounded bg-amber-100 font-mono text-[11px] break-all">
                npm run create-admin
              </code>
            </div>
          ) : (
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

              {error && (
                <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
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
          )}

          {loadError && !needsSetup && (
            <p className="mt-4 text-[11px] text-ink-dark-subtle">{loadError}</p>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-ink-dark-subtle">
          Нууц үгээ мартсан бол серверийн администратортой холбогдоно уу.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
