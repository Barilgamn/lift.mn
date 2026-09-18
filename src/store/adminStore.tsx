import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Elevator, ServiceRecord, SparePart, Submission, SubmissionStatus } from '../types';
import { SEED_ELEVATORS, SEED_SERVICE_RECORDS, SEED_SUBMISSIONS } from '../data/adminData';
import { SPARE_PARTS } from '../data/mockData';

/**
 * Админ хэсгийн өгөгдлийн сан.
 *
 * ЭНЭ БОЛ ТҮР ШИЙДЭЛ. Backend байхгүй тул бүх өгөгдөл тухайн хөтчийн
 * localStorage-д хадгалагдана. Үүний үр дагавар:
 *   - Өөр компьютер, өөр хөтчөөс орвол өөрчлөлт харагдахгүй.
 *   - Хөтчийн санах ойг цэвэрлэвэл өгөгдөл устана.
 *   - Хэрэглэгч хөтчийн консолоор өгөгдлийг өөрчилж чадна.
 * Жинхэнэ ашиглалтад орохын өмнө сервер талын API, өгөгдлийн сан,
 * нэвтрэлт шаардлагатай.
 */

const KEY = (name: string) => `lift_admin_${name}`;

function load<T>(name: string, seed: T): T {
  try {
    const raw = localStorage.getItem(KEY(name));
    return raw ? (JSON.parse(raw) as T) : seed;
  } catch {
    return seed;
  }
}

function save<T>(name: string, value: T) {
  try {
    localStorage.setItem(KEY(name), JSON.stringify(value));
  } catch (e) {
    console.error('Админ өгөгдөл хадгалахад алдаа гарлаа:', e);
  }
}

interface AdminStore {
  elevators: Elevator[];
  serviceRecords: ServiceRecord[];
  submissions: Submission[];
  products: SparePart[];

  setSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  addServiceRecord: (record: ServiceRecord) => void;
  updateElevator: (id: string, patch: Partial<Elevator>) => void;
  saveProduct: (product: SparePart) => void;
  deleteProduct: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<AdminStore | null>(null);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elevators, setElevators] = useState<Elevator[]>(() => load('elevators', SEED_ELEVATORS));
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(() =>
    load('records', SEED_SERVICE_RECORDS)
  );
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    load('submissions', SEED_SUBMISSIONS)
  );
  const [products, setProducts] = useState<SparePart[]>(() => load('products', SPARE_PARTS));

  useEffect(() => save('elevators', elevators), [elevators]);
  useEffect(() => save('records', serviceRecords), [serviceRecords]);
  useEffect(() => save('submissions', submissions), [submissions]);
  useEffect(() => save('products', products), [products]);

  const setSubmissionStatus = useCallback((id: string, status: SubmissionStatus) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }, []);

  const addServiceRecord = useCallback((record: ServiceRecord) => {
    setServiceRecords((prev) => [record, ...prev]);
    setElevators((prev) =>
      prev.map((e) => (e.id === record.elevatorId ? { ...e, lastServiceAt: record.date } : e))
    );
  }, []);

  const updateElevator = useCallback((id: string, patch: Partial<Elevator>) => {
    setElevators((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const saveProduct = useCallback((product: SparePart) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetAll = useCallback(() => {
    setElevators(SEED_ELEVATORS);
    setServiceRecords(SEED_SERVICE_RECORDS);
    setSubmissions(SEED_SUBMISSIONS);
    setProducts(SPARE_PARTS);
  }, []);

  const value = useMemo<AdminStore>(
    () => ({
      elevators, serviceRecords, submissions, products,
      setSubmissionStatus, addServiceRecord, updateElevator, saveProduct, deleteProduct, resetAll,
    }),
    [elevators, serviceRecords, submissions, products,
     setSubmissionStatus, addServiceRecord, updateElevator, saveProduct, deleteProduct, resetAll]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAdminStore(): AdminStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminStore-г AdminStoreProvider дотор ашиглана');
  return ctx;
}
