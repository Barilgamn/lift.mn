import { friendlyError, getSupabase } from './supabase';
import { normalizePerms, type Perm } from './permissions';

/**
 * Админы хэрэглэгч удирдах — supabase/admin-users.sql-ийн функцүүд.
 *
 * Хөтчөөс service_role түлхүүргүйгээр, нэвтэрсэн хэрэглэгчийн эрхээр
 * дуудагдана. Функц бүр дуудагч "users" эрхтэй эсэхийг өөрөө шалгадаг.
 */

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: Perm[];
  createdAt: string;
  lastSignInAt: string | null;
}

export const MIN_PASSWORD = 8;

/** Функц үүсгэгдээгүй (SQL ажиллуулаагүй) үед ойлгомжтой мессеж */
function rpcError(e: { message?: string; code?: string } | null): string | null {
  if (!e) return null;
  if (e.code === 'PGRST202' || /Could not find the function/i.test(e.message ?? '')) {
    return 'Хэрэглэгч удирдах SQL (supabase/admin-users.sql) ажиллуулаагүй байна.';
  }
  return friendlyError(e);
}

type Result<T = null> = { data: T; error: null } | { data: null; error: string };

export async function listUsers(): Promise<Result<ManagedUser[]>> {
  const sb = await getSupabase();
  const { data, error } = await sb.rpc('admin_list_users');
  if (error) return { data: null, error: rpcError(error)! };
  const rows = (data ?? []) as Record<string, unknown>[];
  return {
    data: rows.map((r) => ({
      id: String(r.id),
      email: String(r.email ?? ''),
      name: String(r.name ?? ''),
      role: String(r.role ?? 'viewer'),
      permissions: r.role === 'admin' ? normalizePerms(r.permissions) : [],
      createdAt: String(r.created_at ?? ''),
      lastSignInAt: r.last_sign_in_at ? String(r.last_sign_in_at) : null,
    })),
    error: null,
  };
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  permissions: Perm[];
}): Promise<string | null> {
  const sb = await getSupabase();
  const { error } = await sb.rpc('admin_create_user', {
    p_email: input.email.trim(),
    p_password: input.password,
    p_name: input.name.trim(),
    p_permissions: input.permissions,
  });
  return rpcError(error);
}

export async function updateUser(id: string, name: string, permissions: Perm[]): Promise<string | null> {
  const sb = await getSupabase();
  const { error } = await sb.rpc('admin_update_user', { p_id: id, p_name: name.trim(), p_permissions: permissions });
  return rpcError(error);
}

export async function setUserPassword(id: string, password: string): Promise<string | null> {
  const sb = await getSupabase();
  const { error } = await sb.rpc('admin_set_password', { p_id: id, p_password: password });
  return rpcError(error);
}

export async function deleteUser(id: string): Promise<string | null> {
  const sb = await getSupabase();
  const { error } = await sb.rpc('admin_delete_user', { p_id: id });
  return rpcError(error);
}

/** Нууц үгийн шалгалт — SQL-ийн check_new_password-тэй ижил */
export function passwordProblem(password: string, confirm?: string): string | null {
  if (password.length < MIN_PASSWORD) return `Нууц үг хамгийн багадаа ${MIN_PASSWORD} тэмдэгт байна`;
  if (new TextEncoder().encode(password).length > 72) return 'Нууц үг хэт урт байна';
  if (confirm !== undefined && confirm !== password) return 'Нууц үг таарахгүй байна';
  return null;
}
