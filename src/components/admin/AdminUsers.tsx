import React, { useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, Pencil, RefreshCw, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { PERMS, PERM_PRESETS, permLabel, type Perm } from '../../lib/permissions';
import {
  createUser, deleteUser, listUsers, passwordProblem, setUserPassword, updateUser,
  type ManagedUser,
} from '../../lib/adminUsers';
import { AdminModal, Badge, PageHead, Panel } from './adminUi';

const field =
  'w-full h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark ' +
  'placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none';
const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';
const btnGhost =
  'inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted ' +
  'hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors disabled:opacity-50';
const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover text-white ' +
  'text-xs font-bold cursor-pointer transition-colors disabled:opacity-60';

/** Уншихад хялбар санамсаргүй нууц үг (0/O, 1/l мэт андуурагдах тэмдэгтгүй) */
function randomPassword(length = 12): string {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (n) => chars[n % chars.length]).join('');
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

/** Нууц үг + давтах талбар, харуулах/нуух, санамсаргүй үүсгэх */
const PasswordFields: React.FC<{
  value: string;
  confirm: string;
  onChange: (value: string, confirm: string) => void;
  generator?: boolean;
  autoFocus?: boolean;
}> = ({ value, confirm, onChange, generator = false, autoFocus = false }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-3">
      <div>
        <label className={label} htmlFor="pw-new">Шинэ нууц үг</label>
        <div className="relative">
          <input
            id="pw-new"
            type={show ? 'text' : 'password'}
            value={value}
            autoFocus={autoFocus}
            autoComplete="new-password"
            onChange={(e) => onChange(e.target.value, confirm)}
            placeholder="Хамгийн багадаа 8 тэмдэгт"
            className={`${field} pr-10 font-mono`}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? 'Нууц үгийг нуух' : 'Нууц үгийг харуулах'}
            className="absolute right-1 top-1 w-8 h-8 rounded-md flex items-center justify-center text-ink-dark-muted hover:text-brand cursor-pointer"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="pw-confirm">Нууц үг давтах</label>
        <input
          id="pw-confirm"
          type={show ? 'text' : 'password'}
          value={confirm}
          autoComplete="new-password"
          onChange={(e) => onChange(value, e.target.value)}
          className={`${field} font-mono`}
        />
      </div>
      {generator && (
        <button
          type="button"
          onClick={() => { const p = randomPassword(); setShow(true); onChange(p, p); }}
          className={btnGhost}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Санамсаргүй нууц үг үүсгэх
        </button>
      )}
    </div>
  );
};

/** Нууц үг солих цонх — өөрийнхөө эсвэл бусдын */
export const PasswordDialog: React.FC<{ target: { id: string; email: string }; self: boolean; onClose: () => void }> = ({
  target, self, onClose,
}) => {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(pw, confirm);
    if (problem) { setError(problem); return; }
    setBusy(true);
    setError('');
    const err = await setUserPassword(target.id, pw);
    setBusy(false);
    if (err) { setError(err); return; }
    setDone(true);
  };

  return (
    <AdminModal title={self ? 'Миний нууц үг солих' : 'Нууц үг солих'} onClose={onClose}>
      {done ? (
        <div id="pw-done" className="space-y-4">
          <p className="text-sm text-ink-dark">
            <span className="font-bold">{target.email}</span> хэрэглэгчийн нууц үг солигдлоо.
            {!self && ' Шинэ нууц үгийг хэрэглэгчид өөрт нь найдвартай замаар дамжуулна уу.'}
          </p>
          <button type="button" onClick={onClose} className={btnPrimary}>Хаах</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-xs text-ink-dark-muted">
            {self ? 'Таны бүртгэл: ' : 'Хэрэглэгч: '}
            <span className="font-semibold text-ink-dark">{target.email}</span>
            {!self && ' — нээлттэй байгаа нэвтрэлтүүд нь хаагдана.'}
          </p>
          <PasswordFields value={pw} confirm={confirm} onChange={(a, b) => { setPw(a); setConfirm(b); }} generator={!self} autoFocus />
          {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnPrimary}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Нууц үг солих
            </button>
            <button type="button" onClick={onClose} className={btnGhost}>Болих</button>
          </div>
        </form>
      )}
    </AdminModal>
  );
};

/** Эрх сонгох — багц болон тус бүрээр */
const PermPicker: React.FC<{ value: Perm[]; onChange: (v: Perm[]) => void; lockUsers?: boolean }> = ({
  value, onChange, lockUsers = false,
}) => {
  const toggle = (p: Perm) => onChange(value.includes(p) ? value.filter((x) => x !== p) : [...value, p]);
  const same = (a: Perm[]) => a.length === value.length && a.every((p) => value.includes(p));
  return (
    <div>
      <span className={label}>Эрх</span>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PERM_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(lockUsers && !preset.perms.includes('users') ? [...preset.perms, 'users'] : preset.perms)}
            className={`h-8 px-2.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
              same(preset.perms) ? 'bg-brand text-white border-brand' : 'border-line-light text-ink-dark-muted hover:border-brand hover:text-brand'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <ul className="grid gap-1.5">
        {PERMS.map((p) => {
          const locked = lockUsers && p.id === 'users';
          return (
            <li key={p.id}>
              <label
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                  value.includes(p.id) ? 'border-brand bg-sky-50/60' : 'border-line-light'
                } ${locked ? 'opacity-70' : 'cursor-pointer hover:border-brand'}`}
              >
                <input
                  type="checkbox"
                  checked={value.includes(p.id)}
                  disabled={locked}
                  onChange={() => toggle(p.id)}
                  data-perm={p.id}
                  className="mt-0.5 w-4 h-4 accent-[var(--color-brand)]"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-ink-dark">{p.label}</span>
                  <span className="block text-[11px] text-ink-dark-muted">
                    {locked ? 'Өөрийн энэ эрхийг хасах боломжгүй' : p.hint}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {value.length === 0 && (
        <p className="mt-2 text-[11px] text-amber-800">Эрхгүй хэрэглэгч админ хэсэгт нэвтэрч чадахгүй.</p>
      )}
    </div>
  );
};

/** Шинэ хэрэглэгч эсвэл эрх засах */
const UserForm: React.FC<{ user: ManagedUser | null; self: boolean; onDone: (changed: boolean) => void }> = ({
  user, self, onDone,
}) => {
  const [email, setEmail] = useState(user?.email ?? '');
  const [name, setName] = useState(user?.name ?? '');
  const [perms, setPerms] = useState<Perm[]>(user ? user.permissions : []);
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setError('Имэйл хаяг буруу байна'); return; }
      const problem = passwordProblem(pw, confirm);
      if (problem) { setError(problem); return; }
    }
    setBusy(true);
    const err = user
      ? await updateUser(user.id, name, perms)
      : await createUser({ email, password: pw, name, permissions: perms });
    setBusy(false);
    if (err) { setError(err); return; }
    if (user) onDone(true);
    else setCreated({ email: email.trim().toLowerCase(), password: pw });
  };

  if (created) {
    return (
      <div id="user-created" className="space-y-4">
        <p className="text-sm text-ink-dark">Хэрэглэгч үүслээ. Нэвтрэх мэдээллийг хэрэглэгчид өөрт нь дамжуулна уу:</p>
        <dl className="rounded-lg bg-paper-3 border border-line-light p-3 text-sm space-y-1">
          <div className="flex gap-2"><dt className="text-ink-dark-muted w-24 shrink-0">Хаяг</dt><dd className="font-mono">{window.location.origin}/admin</dd></div>
          <div className="flex gap-2"><dt className="text-ink-dark-muted w-24 shrink-0">Имэйл</dt><dd className="font-mono break-all">{created.email}</dd></div>
          <div className="flex gap-2"><dt className="text-ink-dark-muted w-24 shrink-0">Нууц үг</dt><dd className="font-mono break-all">{created.password}</dd></div>
        </dl>
        <p className="text-[11px] text-ink-dark-muted">Энэ цонхыг хаасны дараа нууц үг дахин харагдахгүй.</p>
        <button type="button" onClick={() => onDone(true)} className={btnPrimary}>Болсон</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {user ? (
        <p className="text-xs text-ink-dark-muted">
          Имэйл: <span className="font-semibold text-ink-dark">{user.email}</span>
        </p>
      ) : (
        <div>
          <label className={label} htmlFor="u-email">Имэйл</label>
          <input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="off" placeholder="ner@lift.mn" className={field} autoFocus />
        </div>
      )}
      <div>
        <label className={label} htmlFor="u-name">Нэр</label>
        <input id="u-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Жишээ: Б. Баатархүү" className={field} />
      </div>
      {!user && (
        <PasswordFields value={pw} confirm={confirm} onChange={(a, b) => { setPw(a); setConfirm(b); }} generator />
      )}
      <PermPicker value={perms} onChange={setPerms} lockUsers={self} />
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {user ? 'Хадгалах' : 'Хэрэглэгч үүсгэх'}
        </button>
        <button type="button" onClick={() => onDone(false)} className={btnGhost}>Болих</button>
      </div>
    </form>
  );
};

/** Хэрэглэгчид — нэмэх, эрх засах, нууц үг солих, устгах */
export const AdminUsers: React.FC = () => {
  const { user: me } = useAdminStore();
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState<ManagedUser | 'new' | null>(null);
  const [pwFor, setPwFor] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const { data, error } = await listUsers();
    if (error) { setLoadError(error); return; }
    setLoadError('');
    setUsers(data);
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const remove = async (u: ManagedUser) => {
    if (!window.confirm(`"${u.email}" хэрэглэгчийг устгах уу?\n\nНэвтрэх эрх нь бүрмөсөн хаагдана. Буцаах боломжгүй.`)) return;
    setDeleting(u.id);
    const err = await deleteUser(u.id);
    setDeleting(null);
    if (err) { window.alert(err); return; }
    setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? prev);
  };

  const admins = users?.filter((u) => u.permissions.length > 0) ?? [];
  const others = users?.filter((u) => u.permissions.length === 0) ?? [];

  const row = (u: ManagedUser) => {
    const self = u.id === me?.id;
    return (
      <li key={u.id} data-user={u.email}>
        <Panel className="p-4 h-full flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 text-brand font-black flex items-center justify-center shrink-0 uppercase">
              {(u.name || u.email).slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-ink-dark truncate">{u.name || u.email.split('@')[0]}</span>
                {self && <Badge tone="blue">Та</Badge>}
              </div>
              <div className="text-xs text-ink-dark-muted break-all">{u.email}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {u.permissions.length === 0 ? (
              <Badge tone="amber">Эрхгүй — админ руу нэвтрэхгүй</Badge>
            ) : u.permissions.length === PERMS.length ? (
              <Badge tone="green"><ShieldCheck className="w-3 h-3 mr-1" />Бүрэн эрхтэй</Badge>
            ) : (
              u.permissions.map((p) => <Badge key={p} tone="slate">{permLabel(p)}</Badge>)
            )}
          </div>

          <div className="mt-auto text-[11px] text-ink-dark-subtle">Сүүлд нэвтэрсэн: {formatDate(u.lastSignInAt)}</div>

          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setEditing(u)} className={btnGhost} aria-label={`${u.email} эрх засах`}>
              <Pencil className="w-3.5 h-3.5" /> Эрх
            </button>
            <button type="button" onClick={() => setPwFor(u)} className={btnGhost} aria-label={`${u.email} нууц үг солих`}>
              <KeyRound className="w-3.5 h-3.5" /> Нууц үг
            </button>
            {!self && (
              <button
                type="button"
                onClick={() => void remove(u)}
                disabled={deleting === u.id}
                aria-label={`${u.email} устгах`}
                className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-red-700 hover:bg-red-50 text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {deleting === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Устгах
              </button>
            )}
          </div>
        </Panel>
      </li>
    );
  };

  return (
    <div>
      <PageHead
        title="Хэрэглэгчид"
        lead="Админ хэсэгт нэвтрэх хүмүүс, тэдний эрх. Хэрэглэгч бүр зөвхөн өөрт олгосон хэсгийг харна."
        right={
          <button id="user-add" type="button" onClick={() => setEditing('new')} className={btnPrimary}>
            <UserPlus className="w-4 h-4" /> Хэрэглэгч нэмэх
          </button>
        }
      />

      {loadError && (
        <Panel className="p-4 mb-5 border-red-200 bg-red-50">
          <p role="alert" className="text-sm text-red-800">{loadError}</p>
        </Panel>
      )}

      {!users && !loadError ? (
        <div className="flex items-center gap-2 text-sm text-ink-dark-muted"><Loader2 className="w-4 h-4 animate-spin" /> Ачаалж байна…</div>
      ) : users && (
        <>
          <ul id="user-list" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{admins.map(row)}</ul>
          {others.length > 0 && (
            <>
              <h2 className="mt-8 mb-1 text-sm font-bold text-ink-dark">Эрх олгоогүй бүртгэлүүд</h2>
              <p className="mb-3 text-xs text-ink-dark-muted">
                Supabase дээр үүссэн боловч админ эрхгүй. "Эрх" товчоор эрх олгоно.
              </p>
              <ul id="user-list-noaccess" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{others.map(row)}</ul>
            </>
          )}
        </>
      )}

      {editing && (
        <AdminModal title={editing === 'new' ? 'Шинэ хэрэглэгч' : 'Эрх засах'} onClose={() => setEditing(null)}>
          <UserForm
            user={editing === 'new' ? null : editing}
            self={editing !== 'new' && editing.id === me?.id}
            onDone={(changed) => {
              setEditing(null);
              if (!changed) return;
              void reload();
              // Өөрийн эрхийг сольсон бол цэс шинэчлэгдэнэ
              if (editing !== 'new' && editing.id === me?.id) window.location.reload();
            }}
          />
        </AdminModal>
      )}

      {pwFor && <PasswordDialog target={pwFor} self={pwFor.id === me?.id} onClose={() => setPwFor(null)} />}
    </div>
  );
};

export default AdminUsers;
