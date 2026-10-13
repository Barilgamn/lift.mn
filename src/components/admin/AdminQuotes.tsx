import React, { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, PhoneCall, Save, Search, X } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import type { Submission, SubmissionStatus } from '../../types';
import { HOTLINE } from '../../lib/submitForm';
import { isPriceQuote, Q, quotedPrice } from '../../lib/priceQuote';
import { productPath } from '../../routes';
import { Badge, PageHead, Panel } from './adminUi';

/**
 * Сэлбэгийн үнийн санал.
 *
 * Сайт дээр үнэгүй бараанд "Үнийн санал авах" дарж ирсэн хүсэлтүүд.
 * Менежер үнэ тогтоож хадгалаад хэрэглэгч рүү залгана. Хүсвэл тэр үнийг
 * шууд каталогт хадгалж, дараагийн хэрэглэгчдэд сайт дээр харагдуулна.
 */

/** Үнийн саналын урсгалд тохирсон төлөвийн нэр */
const STATUS: Record<SubmissionStatus, { label: string; tone: 'amber' | 'blue' | 'green' }> = {
  new: { label: 'Хариулаагүй', tone: 'amber' },
  'in-progress': { label: 'Үнэ өгсөн', tone: 'blue' },
  done: { label: 'Дууссан', tone: 'green' },
};

const FILTERS: Array<{ value: SubmissionStatus | 'all'; label: string }> = [
  { value: 'new', label: 'Хариулаагүй' },
  { value: 'in-progress', label: 'Үнэ өгсөн' },
  { value: 'done', label: 'Дууссан' },
  { value: 'all', label: 'Бүгд' },
];

const money = (n: number) => `${n.toLocaleString('en-US')}₮`;
const qtyOf = (s: Submission) => Math.max(1, Number(s.details['Тоо ширхэг']) || 1);

/** Хэрэглэгчид утсаар уншиж эсвэл мессежээр илгээх бэлэн бичвэр */
function messageFor(s: Submission, price: number, note: string): string {
  const qty = qtyOf(s);
  const parts = [
    `Сайн байна уу. LIFT.MN-ээс таны асуусан ${s.details['Бараа'] ?? ''} (${s.details['Код'] ?? ''})`,
    `нэгжийн үнэ ${money(price)}` + (qty > 1 ? `, ${qty} ширхэг нийт ${money(price * qty)}` : '') + '.',
  ];
  if (note.trim()) parts.push(note.trim().replace(/\.?$/, '.'));
  parts.push(`Захиалах бол ${HOTLINE} дугаар луу холбогдоно уу.`);
  return parts.join(' ');
}

const QuoteDetail: React.FC<{ quote: Submission; onClose: () => void }> = ({ quote, onClose }) => {
  const { updateSubmission, products, saveProduct } = useAdminStore();
  const existing = quotedPrice(quote);
  const [price, setPrice] = useState<string>(existing ? String(existing) : '');
  const [note, setNote] = useState(quote.details[Q.note] ?? '');
  const [toCatalog, setToCatalog] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const qty = qtyOf(quote);
  const unit = Number(price);
  const valid = Number.isFinite(unit) && unit > 0;

  // Каталогт хадгалах боломжтой эсэх — бараа өгөгдлийн санд байх ёстой
  const product = products.find((p) => p.id === quote.details[Q.productId]);
  const variantId = quote.details[Q.variantId];
  const variant = variantId ? product?.variants?.find((v) => v.id === variantId) : undefined;
  const canSaveToCatalog = Boolean(product && (!variantId || variant));

  const save = async (status: SubmissionStatus) => {
    if (status !== 'done' && !valid) {
      setMessage({ ok: false, text: 'Нэгжийн үнийг оруулна уу.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    const details: Record<string, string> = { [Q.note]: note.trim() };
    if (valid) {
      details[Q.price] = String(Math.round(unit));
      details[Q.at] = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
    let err = await updateSubmission(quote.id, { details, status });

    if (!err && toCatalog && valid && product) {
      const updated = variant
        ? {
            ...product,
            variants: product.variants!.map((v) => (v.id === variant.id ? { ...v, price: Math.round(unit) } : v)),
          }
        : { ...product, price: Math.round(unit) };
      const catalogErr = await saveProduct(updated);
      if (catalogErr) err = `Санал хадгалагдсан ч каталогт бичихэд алдаа гарлаа: ${catalogErr}`;
    }
    setBusy(false);
    setMessage(
      err
        ? { ok: false, text: err }
        : {
            ok: true,
            text:
              status === 'done'
                ? 'Дууссан гэж тэмдэглэлээ.'
                : toCatalog && valid
                  ? 'Үнэ хадгалагдаж, каталогт ч бичигдлээ — сайт дээр шууд харагдана.'
                  : 'Үнэ хадгалагдлаа. Хэрэглэгч рүү залгаж мэдэгдэнэ үү.',
          }
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(messageFor(quote, unit, note));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setMessage({ ok: false, text: 'Хуулж чадсангүй — бичвэрийг гараар сонгож хуулна уу.' });
    }
  };

  const field = 'w-full h-10 px-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none';
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1.5';
  const row = (k: string, v?: React.ReactNode) =>
    v ? (
      <div className="flex justify-between gap-4 py-1.5">
        <dt className="text-ink-dark-muted shrink-0">{k}</dt>
        <dd className="text-ink-dark font-semibold text-right break-words min-w-0">{v}</dd>
      </div>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Үнийн санал ${quote.id}`}
        onClick={(e) => e.stopPropagation()}
        className="theme-light w-full sm:max-w-xl max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-paper border border-line-light"
      >
        <div className="sticky top-0 z-10 bg-paper border-b border-line-light px-5 py-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-ink-dark">{quote.id}</span>
              <Badge tone={STATUS[quote.status].tone}>{STATUS[quote.status].label}</Badge>
            </div>
            <h2 className="mt-1 text-base font-black text-ink-dark leading-snug">{quote.details['Бараа']}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Хаах"
            className="p-1.5 rounded-lg hover:bg-paper-3 text-ink-dark-muted cursor-pointer shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Хэрэглэгч */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1">Хэрэглэгч</h3>
            <dl className="text-xs divide-y divide-line-light">
              {row('Нэр', quote.contactName || '—')}
              {row('Утас', <span className="font-mono">{quote.phone}</span>)}
              {row('Илгээсэн', quote.createdAt)}
              {row('Тайлбар', quote.details['Нэмэлт тайлбар'])}
            </dl>
            <a
              id="quote-call"
              href={`tel:${quote.phone.replace(/[^\d+]/g, '')}`}
              className="mt-2 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Залгах
            </a>
          </section>

          {/* Бараа */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-1">Бараа</h3>
            <dl className="text-xs divide-y divide-line-light">
              {row('Код', <span className="font-mono">{quote.details['Код']}</span>)}
              {row('Загвар', quote.details['Загвар'])}
              {row('Брэнд', quote.details['Брэнд'])}
              {row('Тоо ширхэг', String(qty))}
            </dl>
            {quote.details[Q.productId] && (
              <a
                href={productPath(quote.details[Q.productId])}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
              >
                Сайт дээр харах <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </section>

          {/* Үнийн санал */}
          <section className="p-4 rounded-xl bg-paper-2 border border-line-light">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink-dark-muted mb-3">Үнийн санал</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label} htmlFor="q-price">Нэгжийн үнэ (₮)</label>
                <input
                  id="q-price"
                  type="number"
                  min={0}
                  step={100}
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Жишээ: 185000"
                  className={`${field} font-mono`}
                />
              </div>
              <div>
                <span className={label}>Нийт ({qty} ш)</span>
                <div id="q-total" className="h-10 px-3 rounded-lg bg-paper border border-line-light flex items-center text-sm font-black font-mono text-ink-dark">
                  {valid ? money(unit * qty) : '—'}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className={label} htmlFor="q-note">Тэмдэглэл (хүргэлт, хугацаа г.м)</label>
              <textarea
                id="q-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Жишээ: Агуулахад бэлэн, 2 хоногт хүргэнэ"
                className="w-full px-3 py-2 rounded-lg bg-paper border border-line-light text-sm text-ink-dark focus:border-brand focus:outline-none"
              />
            </div>

            <label className={`mt-3 flex items-start gap-2 text-xs ${canSaveToCatalog ? 'text-ink-dark cursor-pointer' : 'text-ink-dark-subtle'}`}>
              <input
                id="q-catalog"
                type="checkbox"
                checked={toCatalog}
                disabled={!canSaveToCatalog}
                onChange={(e) => setToCatalog(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Энэ үнийг каталогт хадгалах — сайт дээр "Үнийн санал авах"-ын оронд шууд үнэ харагдана.
                {!canSaveToCatalog && ' (Бараа өгөгдлийн санд олдсонгүй.)'}
              </span>
            </label>

            {valid && (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={label + ' mb-0'}>Хэрэглэгчид хэлэх бичвэр</span>
                  <button
                    type="button"
                    onClick={() => void copy()}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-line-light bg-paper text-[11px] font-bold text-ink-dark-muted hover:text-brand hover:border-brand cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Хууллаа' : 'Хуулах'}
                  </button>
                </div>
                <p id="q-message" className="p-3 rounded-lg bg-paper border border-line-light text-xs text-ink-dark leading-relaxed">
                  {messageFor(quote, unit, note)}
                </p>
              </div>
            )}

            {message && (
              <p role="status" className={`mt-3 text-xs ${message.ok ? 'text-emerald-700' : 'text-red-700'}`}>
                {message.text}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                id="q-save"
                type="button"
                disabled={busy}
                onClick={() => void save('in-progress')}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" /> {busy ? 'Хадгалж байна…' : 'Үнэ хадгалах'}
              </button>
              {quote.status !== 'done' && (
                <button
                  id="q-done"
                  type="button"
                  disabled={busy}
                  onClick={() => void save('done')}
                  className="h-10 px-4 rounded-lg border border-line-light text-ink-dark-muted hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Дууссан гэж тэмдэглэх
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const AdminQuotes: React.FC = () => {
  const { submissions } = useAdminStore();
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('new');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const quotes = useMemo(() => submissions.filter(isPriceQuote), [submissions]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: quotes.length, new: 0, 'in-progress': 0, done: 0 };
    for (const q of quotes) c[q.status] += 1;
    return c;
  }, [quotes]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((s) => {
      if (filter !== 'all' && s.status !== filter) return false;
      if (!q) return true;
      return [s.id, s.contactName, s.phone, s.details['Бараа'], s.details['Код']]
        .join(' ').toLowerCase().includes(q);
    });
  }, [quotes, filter, query]);

  // Хадгалсны дараа жагсаалт шинэчлэгдэх тул цонхыг id-аар нь дахин олно
  const open = quotes.find((s) => s.id === openId) ?? null;

  return (
    <div>
      <PageHead
        title="Үнийн санал"
        lead='Сэлбэг дээр "Үнийн санал авах" дарж ирсэн хүсэлтүүд. Үнэ тогтоож хадгалаад хэрэглэгч рүү залгана.'
      />

      <Panel className="p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Төлөвөөр шүүх">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  filter === f.value
                    ? 'bg-brand border-brand text-white'
                    : 'bg-paper border-line-light text-ink-dark-muted hover:border-brand hover:text-brand'
                }`}
              >
                {f.label}
                <span className="tabular-nums opacity-80">{counts[f.value]}</span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dark-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Бараа, код, нэр, утсаар хайх"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-paper-2 border border-line-light text-sm text-ink-dark placeholder:text-ink-dark-subtle focus:border-brand focus:outline-none"
            />
          </div>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-dark-muted">
            {quotes.length === 0
              ? 'Одоогоор үнийн санал ирээгүй байна.'
              : filter === 'new'
                ? 'Хариулаагүй үнийн санал алга. Сайн байна!'
                : 'Шүүлтүүрт тохирох хүсэлт олдсонгүй.'}
          </p>
        ) : (
          <ul className="divide-y divide-line-light">
            {rows.map((s) => {
              const p = quotedPrice(s);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(s.id)}
                    className="w-full text-left px-4 sm:px-5 py-3.5 hover:bg-paper-2 transition-colors cursor-pointer flex items-center gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge tone={STATUS[s.status].tone}>{STATUS[s.status].label}</Badge>
                        <span className="text-sm font-bold text-ink-dark">{s.details['Бараа']}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-ink-dark-muted">
                        <span className="font-mono font-semibold text-ink-dark">{s.details['Код']}</span>
                        {' '}× {qtyOf(s)} · {s.contactName || 'Нэргүй'} ·{' '}
                        <span className="font-mono">{s.phone}</span> · {s.createdAt}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {p ? (
                        <>
                          <div className="text-sm font-black font-mono text-ink-dark">{money(p)}</div>
                          <div className="text-[11px] text-ink-dark-muted">нэгж</div>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-800">Үнэ өгөөгүй</span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {open && <QuoteDetail key={open.id} quote={open} onClose={() => setOpenId(null)} />}
    </div>
  );
};

export default AdminQuotes;
