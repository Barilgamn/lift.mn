import React, { useMemo, useRef, useState } from 'react';
import { ImageOff, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { SparePart } from '../../types';
import { Badge, PageHead, Panel } from './adminUi';

const CATEGORIES: Array<{ value: SparePart['category']; label: string }> = [
  { value: 'motor', label: 'Мотор' },
  { value: 'cable', label: 'Кабель' },
  { value: 'door', label: 'Хаалганы механизм' },
  { value: 'button', label: 'Товчлуур' },
  { value: 'inverter', label: 'Инвертер' },
  { value: 'sensor', label: 'Мэдрэгч' },
  { value: 'brake', label: 'Тоормос' },
  { value: 'oil', label: 'Тос' },
];

/** localStorage-д багтаах зургийн дээд хэмжээ */
const MAX_IMAGE_BYTES = 200 * 1024;

const emptyProduct = (): SparePart => ({
  id: `part-${Date.now()}`,
  name: '', oemCode: '', category: 'motor', categoryLabel: 'Мотор',
  brand: '', price: 0, inStock: true, stockCount: 0, deliveryDays: 'Бэлэн',
  image: '', specs: {}, description: '',
});

const ProductForm: React.FC<{ initial: SparePart; onDone: () => void }> = ({ initial, onDone }) => {
  const { saveProduct } = useAdminStore();
  const [p, setP] = useState<SparePart>(initial);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SparePart>(k: K, v: SparePart[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const field = 'w-full h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none';
  const area = 'w-full px-3 py-2 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none';
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';

  const pickFile = (file: File) => {
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Зураг ${Math.round(file.size / 1024)} КБ байна. ${MAX_IMAGE_BYTES / 1024} КБ-аас бага зураг сонгоно уу, эсвэл зургийн холбоос ашиглана уу.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { set('image', String(reader.result)); setError(''); };
    reader.readAsDataURL(file);
  };

  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.name.trim()) { setError('Бүтээгдэхүүний нэрийг бөглөнө үү.'); return; }
    if (p.price <= 0) { setError('Үнийг оруулна уу.'); return; }
    const cat = CATEGORIES.find((c) => c.value === p.category);
    setBusy(true);
    const err = await saveProduct({
      ...p,
      name: p.name.trim(),
      categoryLabel: cat?.label ?? p.categoryLabel,
      inStock: p.stockCount > 0,
    });
    setBusy(false);
    if (err) { setError(err); return; }
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="p-name">Нэр</label>
          <input id="p-name" value={p.name} onChange={(e) => set('name', e.target.value)}
            placeholder="Жишээ: KLEEMANN хаалганы серво мотор" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="p-oem">OEM код</label>
          <input id="p-oem" value={p.oemCode} onChange={(e) => set('oemCode', e.target.value)}
            placeholder="KLM-DR-1180" className={`${field} font-mono`} />
        </div>
        <div>
          <label className={label} htmlFor="p-brand">Брэнд</label>
          <input id="p-brand" value={p.brand} onChange={(e) => set('brand', e.target.value)}
            placeholder="KLEEMANN" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="p-cat">Ангилал</label>
          <select id="p-cat" value={p.category}
            onChange={(e) => set('category', e.target.value as SparePart['category'])} className={field}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="p-price">Үнэ (₮)</label>
          <input id="p-price" type="number" min={0} value={p.price}
            onChange={(e) => set('price', Number(e.target.value))} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="p-stock">Нөөцийн үлдэгдэл</label>
          <input id="p-stock" type="number" min={0} value={p.stockCount}
            onChange={(e) => set('stockCount', Number(e.target.value))} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="p-days">Хүргэлт</label>
          <input id="p-days" value={p.deliveryDays} onChange={(e) => set('deliveryDays', e.target.value)}
            placeholder="Бэлэн / 7-14 хоног" className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="p-desc">Тайлбар</label>
        <textarea id="p-desc" rows={3} value={p.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Тохирох загвар, онцлог, анхаарах зүйл" className={area} />
      </div>

      {/* Зураг */}
      <div>
        <span className={label}>Зураг</span>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40 h-28 rounded-lg bg-paper-3 border border-line-light overflow-hidden flex items-center justify-center shrink-0">
            {p.image ? (
              <img src={p.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="w-6 h-6 text-ink-dark-subtle" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input value={p.image.startsWith('data:') ? '' : p.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="Зургийн холбоос (https://...)" className={field} />
            <div className="flex flex-wrap items-center gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" /> Файл сонгох
              </button>
              {p.image && (
                <button type="button" onClick={() => set('image', '')}
                  className="h-9 px-3 rounded-lg border border-line-light text-ink-dark-muted hover:text-red-700 hover:border-red-300 text-xs font-bold cursor-pointer transition-colors">
                  Зураг арилгах
                </button>
              )}
            </div>
            <p className="text-[11px] text-ink-dark-subtle">
              Файл сонгоход зураг хөтчийн санах ойд хадгалагдана. Багтаамж хязгаартай тул
              {' '}{MAX_IMAGE_BYTES / 1024} КБ хүртэл. Том зурагт холбоос ашиглана уу.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy}
          className="h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-xs font-bold cursor-pointer transition-colors">
          {busy ? 'Хадгалж байна…' : 'Хадгалах'}
        </button>
        <button type="button" onClick={onDone}
          className="h-10 px-4 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand text-xs font-bold cursor-pointer transition-colors">
          Болих
        </button>
      </div>
    </form>
  );
};

export const AdminProducts: React.FC = () => {
  const { products, deleteProduct } = useAdminStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<SparePart | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.oemCode, p.brand, p.categoryLabel].join(' ').toLowerCase().includes(q)
    );
  }, [products, query]);

  const money = (n: number) => n.toLocaleString('mn-MN') + ' ₮';

  return (
    <div>
      <PageHead
        title="Бүтээгдэхүүн"
        lead="Сэлбэгийн мэдээлэл, зураг, үнэ, нөөцийн үлдэгдэл. Өөрчлөлт сайтын дэлгүүрт шууд тусна."
        right={
          <button type="button" onClick={() => setEditing(emptyProduct())}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-bold cursor-pointer transition-colors">
            <Plus className="w-4 h-4" /> Шинэ бүтээгдэхүүн
          </button>
        }
      />

      <Panel className="p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэр, код, брэндээр хайх"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none" />
        </div>
      </Panel>

      <div className="mb-3 text-xs text-ink-dark-muted">{rows.length} бүтээгдэхүүн</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((p) => (
          <Panel key={p.id} className="overflow-hidden flex flex-col">
            <div className="h-36 bg-paper-3 flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img src={p.image} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <ImageOff className="w-7 h-7 text-ink-dark-subtle" />
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono text-brand">{p.oemCode || '—'}</span>
                <Badge tone={p.stockCount === 0 ? 'red' : p.stockCount <= 5 ? 'amber' : 'green'}>
                  {p.stockCount === 0 ? 'Дууссан' : `Үлдэгдэл ${p.stockCount}`}
                </Badge>
              </div>
              <h3 className="mt-1.5 text-sm font-bold text-ink-dark leading-snug">{p.name}</h3>
              <p className="mt-1 text-[11px] text-ink-dark-muted line-clamp-2">{p.description}</p>
              <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                <span className="text-sm font-black font-mono text-ink-dark">{money(p.price)}</span>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => setEditing(p)} aria-label={`${p.name} засах`}
                    className="p-2 rounded-lg border border-line-light text-ink-dark-muted hover:text-brand hover:border-brand cursor-pointer transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" aria-label={`${p.name} устгах`}
                    onClick={() => { if (confirm(`"${p.name}" бүтээгдэхүүнийг устгах уу?`)) void deleteProduct(p.id).then((err) => { if (err) alert(err); }); }}
                    className="p-2 rounded-lg border border-line-light text-ink-dark-muted hover:text-red-700 hover:border-red-300 cursor-pointer transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-6"
             onClick={() => setEditing(null)} role="presentation">
          <div role="dialog" aria-modal="true" aria-label="Бүтээгдэхүүн засах"
            onClick={(e) => e.stopPropagation()}
            className="theme-light w-full sm:max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-paper border border-line-light">
            <div className="sticky top-0 bg-paper border-b border-line-light px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-dark">
                {products.some((x) => x.id === editing.id) ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}
              </h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Хаах"
                className="p-1.5 rounded-lg hover:bg-paper-3 text-ink-dark-muted cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <ProductForm initial={editing} onDone={() => setEditing(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
