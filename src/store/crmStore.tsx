import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { friendlyError, getSupabase } from '../lib/supabase';
import {
  type Activity, type Company, type Contact, type Deal, type Staff,
  activityToRow, companyToRow, contactToRow, dealToRow, dealStage,
  rowToActivity, rowToCompany, rowToContact, rowToDeal,
} from '../lib/crm';

/**
 * CRM-ийн өгөгдөл — "crm" эрхтэй үед админ хэсэг нээгдэхэд нэг удаа татна.
 * Өөрчлөлт бүр Supabase руу шууд бичигдэж, амжилттай бол дэлгэц шинэчлэгдэнэ.
 */

type Result = Promise<string | null>;

interface CrmStore {
  enabled: boolean;
  loading: boolean;
  /** supabase/crm.sql ажиллуулаагүй */
  notInstalled: boolean;
  error: string | null;

  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  staff: Staff[];

  reload: () => Promise<void>;
  saveCompany: (c: Partial<Company> & { name: string }) => Promise<{ id: string | null; error: string | null }>;
  deleteCompany: (id: string) => Result;
  importCompanies: (rows: { company: Partial<Company> & { name: string }; contact?: { name: string; phone: string } }[]) => Promise<{ added: number; error: string | null }>;
  saveContact: (c: Partial<Contact> & { name: string }) => Result;
  deleteContact: (id: string) => Result;
  saveDeal: (d: Partial<Deal> & { title: string; companyId: string }) => Promise<{ id: string | null; error: string | null }>;
  moveDeal: (id: string, stage: Deal['stage']) => Result;
  deleteDeal: (id: string) => Result;
  addActivity: (a: Partial<Activity> & { kind: Activity['kind'] }) => Result;
  updateActivity: (id: string, patch: Partial<Activity>) => Result;
  deleteActivity: (id: string) => Result;
  staffName: (id: string | null | undefined) => string;
}

const Ctx = createContext<CrmStore | null>(null);

const missingTable = (msg: string) => /crm_|relation .* does not exist|Could not find the table|PGRST205/i.test(msg);

export const CrmProvider: React.FC<{ enabled: boolean; children: React.ReactNode }> = ({ enabled, children }) => {
  const [loading, setLoading] = useState(enabled);
  const [notInstalled, setNotInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    const sb = await getSupabase();
    const [co, ct, de, ac, st] = await Promise.all([
      sb.from('crm_companies').select('*').order('name'),
      sb.from('crm_contacts').select('*').order('created_at'),
      sb.from('crm_deals').select('*').order('updated_at', { ascending: false }),
      sb.from('crm_activities').select('*').order('created_at', { ascending: false }).limit(2000),
      sb.rpc('crm_staff'),
    ]);
    setLoading(false);
    const first = co.error || ct.error || de.error || ac.error;
    if (first) {
      if (missingTable(`${first.message} ${first.code ?? ''}`)) setNotInstalled(true);
      else setError(friendlyError(first));
      return;
    }
    setNotInstalled(false);
    setError(null);
    setCompanies((co.data ?? []).map(rowToCompany));
    setContacts((ct.data ?? []).map(rowToContact));
    setDeals((de.data ?? []).map(rowToDeal));
    setActivities((ac.data ?? []).map(rowToActivity));
    setStaff(st.error ? [] : ((st.data ?? []) as Staff[]));
  }, [enabled]);

  useEffect(() => { void reload(); }, [reload]);

  const sortByName = (list: Company[]) => [...list].sort((a, b) => a.name.localeCompare(b.name, 'mn'));

  const addSystemNote = useCallback(async (companyId: string | null, dealId: string | null, body: string) => {
    const sb = await getSupabase();
    const { data } = await sb.from('crm_activities')
      .insert(activityToRow({ companyId, dealId, kind: 'system', body })).select().single();
    if (data) setActivities((prev) => [rowToActivity(data), ...prev]);
  }, []);

  const saveCompany = useCallback(async (c: Partial<Company> & { name: string }) => {
    if (!c.name.trim()) return { id: null, error: 'Нэрийг бөглөнө үү' };
    const sb = await getSupabase();
    const row = companyToRow(c);
    const q = c.id
      ? sb.from('crm_companies').update(row).eq('id', c.id).select().single()
      : sb.from('crm_companies').insert(row).select().single();
    const { data, error: e } = await q;
    if (e) return { id: null, error: friendlyError(e) };
    const saved = rowToCompany(data);
    setCompanies((prev) => sortByName(prev.some((x) => x.id === saved.id) ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
    if (!c.id) void addSystemNote(saved.id, null, 'Харилцагч бүртгэгдлээ');
    return { id: saved.id, error: null };
  }, [addSystemNote]);

  const deleteCompany = useCallback(async (id: string) => {
    const sb = await getSupabase();
    const { error: e } = await sb.from('crm_companies').delete().eq('id', id);
    if (e) return friendlyError(e);
    setCompanies((prev) => prev.filter((x) => x.id !== id));
    setContacts((prev) => prev.filter((x) => x.companyId !== id));
    setDeals((prev) => prev.filter((x) => x.companyId !== id));
    setActivities((prev) => prev.filter((x) => x.companyId !== id));
    return null;
  }, []);

  const importCompanies = useCallback<CrmStore['importCompanies']>(async (rows) => {
    if (!rows.length) return { added: 0, error: null };
    const sb = await getSupabase();
    const { data, error: e } = await sb.from('crm_companies').insert(rows.map((r) => companyToRow(r.company))).select();
    if (e) return { added: 0, error: friendlyError(e) };
    const saved = (data ?? []).map(rowToCompany);
    // Мөрийн дарааллаар холбогдох хүнийг тааруулна
    const people = rows.flatMap((r, i) => (r.contact && saved[i] ? [contactToRow({
      companyId: saved[i].id, name: r.contact.name, phone: r.contact.phone, isPrimary: true,
    })] : []));
    if (people.length) {
      const { data: cdata } = await sb.from('crm_contacts').insert(people).select();
      setContacts((prev) => [...prev, ...(cdata ?? []).map(rowToContact)]);
    }
    setCompanies((prev) => sortByName([...prev, ...saved]));
    return { added: saved.length, error: null };
  }, []);

  const saveContact = useCallback(async (c: Partial<Contact> & { name: string }) => {
    if (!c.name.trim()) return 'Нэрийг бөглөнө үү';
    const sb = await getSupabase();
    // Нэг байгууллагад нэг л үндсэн холбогдох хүн
    if (c.isPrimary && c.companyId) {
      await sb.from('crm_contacts').update({ is_primary: false }).eq('company_id', c.companyId).neq('id', c.id ?? '00000000-0000-0000-0000-000000000000');
    }
    const row = contactToRow(c);
    const { data, error: e } = c.id
      ? await sb.from('crm_contacts').update(row).eq('id', c.id).select().single()
      : await sb.from('crm_contacts').insert(row).select().single();
    if (e) return friendlyError(e);
    const saved = rowToContact(data);
    setContacts((prev) => {
      let next = prev.some((x) => x.id === saved.id) ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
      if (saved.isPrimary) next = next.map((x) => (x.companyId === saved.companyId && x.id !== saved.id ? { ...x, isPrimary: false } : x));
      return next;
    });
    return null;
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    const sb = await getSupabase();
    const { error: e } = await sb.from('crm_contacts').delete().eq('id', id);
    if (e) return friendlyError(e);
    setContacts((prev) => prev.filter((x) => x.id !== id));
    return null;
  }, []);

  const saveDeal = useCallback(async (d: Partial<Deal> & { title: string; companyId: string }) => {
    if (!d.title.trim()) return { id: null, error: 'Хэлцлийн нэрийг бөглөнө үү' };
    const sb = await getSupabase();
    const before = d.id ? deals.find((x) => x.id === d.id) : undefined;
    const row = dealToRow(d);
    const { data, error: e } = d.id
      ? await sb.from('crm_deals').update(row).eq('id', d.id).select().single()
      : await sb.from('crm_deals').insert(row).select().single();
    if (e) return { id: null, error: friendlyError(e) };
    const saved = rowToDeal(data);
    setDeals((prev) => (prev.some((x) => x.id === saved.id) ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev]));
    if (!before) void addSystemNote(saved.companyId, saved.id, `Хэлцэл нээгдлээ: ${saved.title}`);
    else if (before.stage !== saved.stage) {
      void addSystemNote(saved.companyId, saved.id, `"${saved.title}": ${dealStage(before.stage).label} → ${dealStage(saved.stage).label}`);
    }
    return { id: saved.id, error: null };
  }, [deals, addSystemNote]);

  const moveDeal = useCallback(async (id: string, stage: Deal['stage']) => {
    const d = deals.find((x) => x.id === id);
    if (!d || d.stage === stage) return null;
    // Шууд шилжүүлээд, алдаа гарвал буцаана — чирэхэд саатал мэдрэгдэхгүй
    setDeals((prev) => prev.map((x) => (x.id === id ? { ...x, stage } : x)));
    const { error: e } = await saveDeal({ ...d, stage });
    if (e) setDeals((prev) => prev.map((x) => (x.id === id ? d : x)));
    return e;
  }, [deals, saveDeal]);

  const deleteDeal = useCallback(async (id: string) => {
    const sb = await getSupabase();
    const { error: e } = await sb.from('crm_deals').delete().eq('id', id);
    if (e) return friendlyError(e);
    setDeals((prev) => prev.filter((x) => x.id !== id));
    setActivities((prev) => prev.filter((x) => x.dealId !== id));
    return null;
  }, []);

  const addActivity = useCallback(async (a: Partial<Activity> & { kind: Activity['kind'] }) => {
    if (!a.body?.trim()) return 'Агуулгыг бичнэ үү';
    const sb = await getSupabase();
    const { data, error: e } = await sb.from('crm_activities').insert(activityToRow(a)).select().single();
    if (e) return friendlyError(e);
    setActivities((prev) => [rowToActivity(data), ...prev]);
    return null;
  }, []);

  const updateActivity = useCallback(async (id: string, patch: Partial<Activity>) => {
    const sb = await getSupabase();
    const { data, error: e } = await sb.from('crm_activities').update(activityToRow(patch)).eq('id', id).select().single();
    if (e) return friendlyError(e);
    const saved = rowToActivity(data);
    setActivities((prev) => prev.map((x) => (x.id === id ? saved : x)));
    return null;
  }, []);

  const deleteActivity = useCallback(async (id: string) => {
    const sb = await getSupabase();
    const { error: e } = await sb.from('crm_activities').delete().eq('id', id);
    if (e) return friendlyError(e);
    setActivities((prev) => prev.filter((x) => x.id !== id));
    return null;
  }, []);

  const staffName = useCallback(
    (id: string | null | undefined) => (id ? staff.find((s) => s.id === id)?.name ?? '' : ''),
    [staff]
  );

  const value = useMemo<CrmStore>(() => ({
    enabled, loading, notInstalled, error,
    companies, contacts, deals, activities, staff,
    reload, saveCompany, deleteCompany, importCompanies, saveContact, deleteContact,
    saveDeal, moveDeal, deleteDeal, addActivity, updateActivity, deleteActivity, staffName,
  }), [enabled, loading, notInstalled, error, companies, contacts, deals, activities, staff,
       reload, saveCompany, deleteCompany, importCompanies, saveContact, deleteContact,
       saveDeal, moveDeal, deleteDeal, addActivity, updateActivity, deleteActivity, staffName]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useCrm(): CrmStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCrm-г CrmProvider дотор ашиглана');
  return ctx;
}
