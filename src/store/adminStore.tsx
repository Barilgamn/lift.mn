import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Elevator, ServiceRecord, SparePart, Submission, SubmissionStatus } from '../types';
import { friendlyError, getSupabase, isSupabaseConfigured } from '../lib/supabase';
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
}

type Status = 'loading' | 'anonymous' | 'unauthorized' | 'authenticated';

interface AdminStore {
  status: Status;
  user: AdminUser | null;
  /** .env дэх түлхүүр бөглөгдөөгүй */
  notConfigured: boolean;
  loadError: string | null;

  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;

  elevators: Elevator[];
  serviceRecords: ServiceRecord[];
  submissions: Submission[];
  products: SparePart[];

  setSubmissionStatus: (id: string, status: SubmissionStatus) => Promise<string | null>;
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
    const { data, error } = await sb
      .from('profiles')
      .select('id, email, name, role')
      .eq('id', session.user.id)
      .maybeSingle();
    if (error) { setLoadError(friendlyError(error)); return null; }
    if (!data) return null;
    return { id: data.id, email: data.email, name: data.name || data.email, role: data.role };
  }, []);

  const loadData = useCallback(async () => {
    const sb = await getSupabase();
    const [el, rec, sub, prod] = await Promise.all([
      sb.from('elevators').select('*').order('building'),
      sb.from('service_records').select('*').order('date', { ascending: false }),
      sb.from('submissions').select('*').order('created_at', { ascending: false }),
      sb.from('products').select('*').order('name'),
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
    if (!profile || profile.role !== 'admin') {
      // Нэвтэрсэн ч эрх нь хүрэхгүй — өгөгдөл татахгүй
      setUser(profile);
      setStatus('unauthorized');
      clearData();
      return;
    }
    setUser(profile);
    setStatus('authenticated');
    await loadData();
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
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) return friendlyError(error);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return null;
  }, []);

  const value = useMemo<AdminStore>(() => ({
    status, user, notConfigured: !isSupabaseConfigured, loadError,
    login, logout,
    elevators, serviceRecords, submissions, products,
    setSubmissionStatus, addServiceRecord, addElevator, updateElevator, saveProduct, deleteProduct,
  }), [status, user, loadError, login, logout, elevators, serviceRecords, submissions, products,
       setSubmissionStatus, addServiceRecord, addElevator, updateElevator, saveProduct, deleteProduct]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAdminStore(): AdminStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminStore-г AdminStoreProvider дотор ашиглана');
  return ctx;
}
