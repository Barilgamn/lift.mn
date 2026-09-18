import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Elevator, ServiceRecord, SparePart, Submission, SubmissionStatus } from '../types';

/**
 * Админ хэсгийн өгөгдөл — сервертэй ажиллана.
 *
 * Нэвтрэлт нь httpOnly cookie-д суурилдаг тул JavaScript токен барьж
 * авах шаардлагагүй, хүсэлт бүрт автоматаар явна. `credentials: 'include'`
 * нь тэр cookie-г хавсаргана.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

type Status = 'loading' | 'anonymous' | 'authenticated';

interface AdminStore {
  status: Status;
  user: AdminUser | null;
  /** Сервер дээр админ бүртгэл огт байхгүй */
  needsSetup: boolean;
  loadError: string | null;

  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;

  elevators: Elevator[];
  serviceRecords: ServiceRecord[];
  submissions: Submission[];
  products: SparePart[];

  setSubmissionStatus: (id: string, status: SubmissionStatus) => Promise<string | null>;
  addServiceRecord: (record: Omit<ServiceRecord, 'id'> & { id?: string }) => Promise<string | null>;
  updateElevator: (id: string, patch: Partial<Elevator>) => Promise<string | null>;
  saveProduct: (product: SparePart) => Promise<string | null>;
  deleteProduct: (id: string) => Promise<string | null>;
}

const Ctx = createContext<AdminStore | null>(null);

interface ApiResult<T> {
  data?: T;
  error?: string;
}

/** Сервер рүү хүсэлт илгээх нийтлэг функц */
async function api<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      credentials: 'include',
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
      ...init,
    });
    const body = (await res.json().catch(() => ({}))) as ApiResult<T>;
    if (!res.ok) return { error: body.error || `Алдаа гарлаа (${res.status})` };
    return { data: body.data as T };
  } catch {
    return { error: 'Сервертэй холбогдож чадсангүй. Сервер ажиллаж байгаа эсэхийг шалгана уу.' };
  }
}

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [products, setProducts] = useState<SparePart[]>([]);

  const loadData = useCallback(async () => {
    const r = await api<{
      elevators: Elevator[]; serviceRecords: ServiceRecord[];
      submissions: Submission[]; products: SparePart[];
    }>('/admin/bootstrap');
    if (r.error) { setLoadError(r.error); return; }
    setLoadError(null);
    setElevators(r.data!.elevators);
    setServiceRecords(r.data!.serviceRecords);
    setSubmissions(r.data!.submissions);
    setProducts(r.data!.products);
  }, []);

  const refreshSession = useCallback(async () => {
    const r = await api<{ user: AdminUser | null; needsSetup: boolean }>('/auth/me');
    if (r.error) { setStatus('anonymous'); setLoadError(r.error); return; }
    setNeedsSetup(r.data!.needsSetup);
    if (r.data!.user) {
      setUser(r.data!.user);
      setStatus('authenticated');
      await loadData();
    } else {
      setUser(null);
      setStatus('anonymous');
    }
  }, [loadData]);

  useEffect(() => { void refreshSession(); }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await api<{ user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (r.error) return r.error;
    setUser(r.data!.user);
    setStatus('authenticated');
    await loadData();
    return null;
  }, [loadData]);

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
    setStatus('anonymous');
    setElevators([]); setServiceRecords([]); setSubmissions([]); setProducts([]);
  }, []);

  const setSubmissionStatus = useCallback(async (id: string, s: SubmissionStatus) => {
    const r = await api(`/admin/submissions/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: JSON.stringify({ status: s }),
    });
    if (r.error) return r.error;
    setSubmissions((prev) => prev.map((x) => (x.id === id ? { ...x, status: s } : x)));
    return null;
  }, []);

  const addServiceRecord = useCallback(async (record: Omit<ServiceRecord, 'id'> & { id?: string }) => {
    const r = await api<{ serviceRecords: ServiceRecord[]; elevators: Elevator[] }>('/admin/service-records', {
      method: 'POST', body: JSON.stringify(record),
    });
    if (r.error) return r.error;
    setServiceRecords(r.data!.serviceRecords);
    setElevators(r.data!.elevators);
    return null;
  }, []);

  const updateElevator = useCallback(async (id: string, patch: Partial<Elevator>) => {
    const r = await api(`/admin/elevators/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: JSON.stringify(patch),
    });
    if (r.error) return r.error;
    setElevators((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    return null;
  }, []);

  const saveProduct = useCallback(async (product: SparePart) => {
    const r = await api<SparePart>(`/admin/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT', body: JSON.stringify(product),
    });
    if (r.error) return r.error;
    const saved = r.data!;
    setProducts((prev) =>
      prev.some((x) => x.id === saved.id)
        ? prev.map((x) => (x.id === saved.id ? saved : x))
        : [saved, ...prev]
    );
    return null;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const r = await api(`/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (r.error) return r.error;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return null;
  }, []);

  const value = useMemo<AdminStore>(() => ({
    status, user, needsSetup, loadError,
    login, logout, reload: refreshSession,
    elevators, serviceRecords, submissions, products,
    setSubmissionStatus, addServiceRecord, updateElevator, saveProduct, deleteProduct,
  }), [status, user, needsSetup, loadError, login, logout, refreshSession,
       elevators, serviceRecords, submissions, products,
       setSubmissionStatus, addServiceRecord, updateElevator, saveProduct, deleteProduct]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAdminStore(): AdminStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminStore-г AdminStoreProvider дотор ашиглана');
  return ctx;
}
