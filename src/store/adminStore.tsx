import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Elevator, ServiceRecord, SparePart, Submission, SubmissionStatus } from '../types';
import { friendlyError, getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { storageRefs } from '../lib/attachments';
import { PRODUCT_BUCKET, storedImagePaths } from '../lib/productImages';
import { ALL_PERMS, normalizePerms, type Perm } from '../lib/permissions';
import {
  elevatorToRow, productToRow, recordToRow,
  rowToElevator, rowToProduct, rowToRecord, rowToSubmission,
} from '../lib/mappers';

/**
 * Админ хэсгийн өгөгдөл — Supabase-тэй шууд ажиллана.
 *
 * Тусдаа сервер ажиллуулах шаардлагагүй. Нэвтрэлтийг Supabase Auth,
 * эрхийн хяналтыг өгөгдлийн сан дээрх Row Level Security хийнэ. Өөрөөр
 * хэлбэл хэн юуг харах, засахыг сервер биш, өгөгдлийн сан өөрөө шийднэ.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  /** Админы хэсэгт хүрэх эрхүүд (supabase/admin-users.sql) */
  permissions: Perm[];
}

type Status = 'loading' | 'anonymous' | 'unauthorized' | 'authenticated';

interface AdminStore {
  status: Status;
  user: AdminUser | null;
  /** .env дэх түлхүүр бөглөгдөөгүй */
  notConfigured: boolean;
  loadError: string | null;

  /** Одоогийн хэрэглэгч тухайн эрхтэй эсэх */
  can: (perm: Perm) => boolean;

  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;

  elevators: Elevator[];
  serviceRecords: ServiceRecord[];
  submissions: Submission[];
  products: SparePart[];

  setSubmissionStatus: (id: string, status: SubmissionStatus) => Promise<string | null>;
  /**
   * Хүсэлтийн details-д талбар нэмж/шинэчилж, хүсвэл төлөвийг нь солино.
   * Үнийн саналд админы тогтоосон үнэ, тэмдэглэлийг хадгалахад ашиглана.
   */
  updateSubmission: (
    id: string,
    patch: { details?: Record<string, string>; status?: SubmissionStatus }
  ) => Promise<string | null>;
  /** Хүсэлтийг устгана — Storage-д хавсаргасан файлуудтай нь хамт */
  deleteSubmission: (id: string) => Promise<string | null>;
  addServiceRecord: (record: Omit<ServiceRecord, 'id'> & { id?: string }) => Promise<string | null>;
  addElevator: (elevator: Omit<Elevator, 'id'> & { id?: string }) => Promise<string | null>;
  updateElevator: (id: string, patch: Partial<Elevator>) => Promise<string | null>;
  saveProduct: (product: SparePart) => Promise<string | null>;
  deleteProduct: (id: string) => Promise<string | null>;
}

/**
 * Шинэ лифтний дугаар. Одоо байгаа `lift-001` хэлбэрийн дугааруудын
 * хамгийн томыг нь олоод нэгээр нэмнэ. Өөр хэлбэрийн id байвал тоохгүй.
 */
function nextElevatorId(existing: Elevator[]): string {
  let max = 0;
  for (const e of existing) {
    const m = /^lift-(\d+)$/.exec(e.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `lift-${String(max + 1).padStart(3, '0')}`;
}

const Ctx = createContext<AdminStore | null>(null);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? 'loading' : 'anonymous');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [products, setProducts] = useState<SparePart[]>([]);

  const clearData = () => {
    setElevators([]); setServiceRecords([]); setSubmissions([]); setProducts([]);
  };

  /** Нэвтэрсэн хэрэглэгчийн профайлыг уншиж, админ эсэхийг шалгана */
  const loadProfile = useCallback(async (session: Session): Promise<AdminUser | null> => {
    const sb = await getSupabase();
    const query = (cols: string) => sb.from('profiles').select(cols).eq('id', session.user.id).maybeSingle();
    let { data, error } = await query('id, email, name, role, permissions');
    // admin-users.sql ажиллуулаагүй (permissions багана алга) — админ бүх эрхтэй
    const legacy = !!error && /permissions/.test(error.message);
    if (legacy) ({ data, error } = await query('id, email, name, role'));
    if (error) { setLoadError(friendlyError(error)); return null; }
    if (!data) return null;
    const row = data as unknown as { id: string; email: string; name: string; role: string; permissions?: unknown };
    return {
      id: row.id,
      email: row.email,
      name: row.name || row.email,
      role: row.role,
      // Багана алга (хуучин бүтэц) бол админ бүх эрхтэй — жинхэнэ хяналтыг RLS хийнэ
      permissions: row.role !== 'admin' ? [] : legacy || row.permissions === undefined ? [...ALL_PERMS] : normalizePerms(row.permissions),
    };
  }, []);

  const loadData = useCallback(async (perms: Perm[]) => {
    const sb = await getSupabase();
    const has = (p: Perm) => perms.includes(p);
    const none = Promise.resolve({ data: [], error: null });
    // Эрхгүй хүснэгтийг татахгүй — RLS ч гэсэн хоосон буцаана
    const [el, rec, sub, prod] = await Promise.all([
      has('elevators') ? sb.from('elevators').select('*').order('building') : none,
      has('elevators') ? sb.from('service_records').select('*').order('date', { ascending: false }) : none,
      has('requests') || has('quotes') || has('naadam')
        ? sb.from('submissions').select('*').order('created_at', { ascending: false })
        : none,
      has('products') ? sb.from('products').select('*').order('name') : none,
    ]);
    const firstError = el.error || rec.error || sub.error || prod.error;
    if (firstError) { setLoadError(friendlyError(firstError)); return; }
    setLoadError(null);
    setElevators((el.data ?? []).map(rowToElevator));
    setServiceRecords((rec.data ?? []).map(rowToRecord));
    setSubmissions((sub.data ?? []).map(rowToSubmission));
    setProducts((prod.data ?? []).map(rowToProduct));
  }, []);

  /** Нэвтрэлтийн төлөв солигдох бүрд дуудагдана */
  const applySession = useCallback(async (session: Session | null) => {
    if (!session) { setUser(null); setStatus('anonymous'); clearData(); return; }
    const profile = await loadProfile(session);
    if (!profile || profile.role !== 'admin' || profile.permissions.length === 0) {
      // Нэвтэрсэн ч эрх нь хүрэхгүй — өгөгдөл татахгүй
      setUser(profile);
      setStatus('unauthorized');
      clearData();
      return;
    }
    setUser(profile);
    setStatus('authenticated');
    await loadData(profile.permissions);
  }, [loadProfile, loadData]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let alive = true;
    let unsubscribe: (() => void) | undefined;

    void getSupabase().then(async (sb) => {
      if (!alive) return;
      const { data } = await sb.auth.getSession();
      if (!alive) return;
      await applySession(data.session);
      const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
        if (alive) void applySession(session);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    }).catch((e) => {
      if (alive) { setLoadError(friendlyError(e)); setStatus('anonymous'); }
    });

    return () => { alive = false; unsubscribe?.(); };
  }, [applySession]);

  const can = useCallback((perm: Perm) => !!user?.permissions.includes(perm), [user]);

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) return 'Supabase тохируулагдаагүй байна';
    try {
      const sb = await getSupabase();
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      return error ? friendlyError(error) : null;
    } catch (e) {
      return friendlyError(e);
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      await sb.auth.signOut();
    }
    setUser(null);
    setStatus('anonymous');
    clearData();
  }, []);

  const setSubmissionStatus = useCallback(async (id: string, s: SubmissionStatus) => {
    const sb = await getSupabase();
    const { error } = await sb.from('submissions').update({ status: s }).eq('id', id);
    if (error) return friendlyError(error);
    setSubmissions((prev) => prev.map((x) => (x.id === id ? { ...x, status: s } : x)));
    return null;
  }, []);

  const updateSubmission = useCallback(async (
    id: string,
    patch: { details?: Record<string, string>; status?: SubmissionStatus }
  ) => {
    const current = submissions.find((x) => x.id === id);
    if (!current) return 'Хүсэлт олдсонгүй';
    // details нь jsonb — хэрэглэгчийн бөглөсөн талбаруудыг хадгалж,
    // админы талбаруудыг дээр нь нэмнэ
    const details = { ...current.details, ...(patch.details ?? {}) };
    const row: Record<string, unknown> = { details };
    if (patch.status) row.status = patch.status;
    const sb = await getSupabase();
    const { error } = await sb.from('submissions').update(row).eq('id', id);
    if (error) return friendlyError(error);
    setSubmissions((prev) =>
      prev.map((x) => (x.id === id ? { ...x, details, status: patch.status ?? x.status } : x))
    );
    return null;
  }, [submissions]);

  const deleteSubmission = useCallback(async (id: string) => {
    const current = submissions.find((x) => x.id === id);
    if (!current) return 'Хүсэлт олдсонгүй';
    const sb = await getSupabase();
    // Эхлээд хавсаргасан файлууд — эс бөгөөс эзэнгүй файл Storage-д үлдэнэ
    for (const [bucket, paths] of Object.entries(storageRefs(current.details))) {
      const { error } = await sb.storage.from(bucket).remove(paths);
      if (error) return `Файлыг устгаж чадсангүй: ${friendlyError(error)}`;
    }
    // RLS хаасан үед алдаа өгөхгүй, 0 мөр устгадаг — тоолж шалгана
    const { data, error } = await sb.from('submissions').delete().eq('id', id).select('id');
    if (error) return friendlyError(error);
    if (!data?.length) return 'Устгах эрх алга эсвэл бүртгэл аль хэдийн устсан байна';
    setSubmissions((prev) => prev.filter((x) => x.id !== id));
    return null;
  }, [submissions]);

  const addServiceRecord = useCallback(async (record: Omit<ServiceRecord, 'id'> & { id?: string }) => {
    const sb = await getSupabase();
    const { data, error } = await sb.from('service_records').insert(recordToRow(record)).select().single();
    if (error) return friendlyError(error);
    setServiceRecords((prev) => [rowToRecord(data), ...prev]);
    // Лифтний "сүүлд үйлчилсэн" огноог өгөгдлийн сан дээрх trigger шинэчилдэг
    setElevators((prev) =>
      prev.map((e) => (e.id === record.elevatorId ? { ...e, lastServiceAt: record.date } : e))
    );
    return null;
  }, []);

  const addElevator = useCallback(async (elevator: Omit<Elevator, 'id'> & { id?: string }) => {
    const sb = await getSupabase();
    // id нь өгөгдлийн санд text primary key — хөтчөөс өгнө. Одоо байгаа
    // `lift-NNN` дугааруудын араас үргэлжлүүлж, давхцвал санд алдаа өгнө.
    const id = elevator.id?.trim() || nextElevatorId(elevators);
    const { data, error } = await sb
      .from('elevators')
      .insert(elevatorToRow({ ...elevator, id }))
      .select()
      .single();
    if (error) return friendlyError(error);
    const saved = rowToElevator(data);
    setElevators((prev) => [...prev, saved].sort((a, b) => a.building.localeCompare(b.building, 'mn')));
    return null;
  }, [elevators]);

  const updateElevator = useCallback(async (id: string, patch: Partial<Elevator>) => {
    const sb = await getSupabase();
    const { error } = await sb.from('elevators').update(elevatorToRow(patch)).eq('id', id);
    if (error) return friendlyError(error);
    setElevators((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    return null;
  }, []);

  const saveProduct = useCallback(async (product: SparePart) => {
    const sb = await getSupabase();
    const { data, error } = await sb.from('products').upsert(productToRow(product)).select().single();
    if (error) return friendlyError(error);
    const saved = rowToProduct(data);
    setProducts((prev) =>
      prev.some((x) => x.id === saved.id)
        ? prev.map((x) => (x.id === saved.id ? saved : x))
        : [saved, ...prev]
    );
    return null;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const sb = await getSupabase();
    // Устгахаас өмнө зургуудын холбоосыг авна — сангаас цэвэрлэхэд
    const { data: row } = await sb.from('products').select('image, variants').eq('id', id).maybeSingle();
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) return friendlyError(error);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Зургийн сан дахь файлуудыг цэвэрлэнэ — бүтэлгүйтсэн ч бараа устсан хэвээр
    const variants: { image?: string }[] = Array.isArray(row?.variants) ? row.variants : [];
    const paths = storedImagePaths([row?.image, ...variants.map((v) => v.image)]);
    if (paths.length) {
      const { error: rmError } = await sb.storage.from(PRODUCT_BUCKET).remove(paths);
      if (rmError) console.warn('Барааны зургийг сангаас устгаж чадсангүй:', rmError.message);
    }
    return null;
  }, []);

  const value = useMemo<AdminStore>(() => ({
    status, user, notConfigured: !isSupabaseConfigured, loadError,
    can, login, logout,
    elevators, serviceRecords, submissions, products,
    setSubmissionStatus, updateSubmission, deleteSubmission, addServiceRecord, addElevator, updateElevator,
    saveProduct, deleteProduct,
  }), [status, user, loadError, can, login, logout, elevators, serviceRecords, submissions, products,
       setSubmissionStatus, updateSubmission, deleteSubmission, addServiceRecord, addElevator, updateElevator,
       saveProduct, deleteProduct]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAdminStore(): AdminStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminStore-г AdminStoreProvider дотор ашиглана');
  return ctx;
}
