import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Send, X } from 'lucide-react';
import type { SparePart } from '../types';
import { HOTLINE, submitForm } from '../lib/submitForm';
import { PRICE_QUOTE_TYPE, Q, QUOTE_LABEL } from '../lib/priceQuote';
import { productPath } from '../routes';

/**
 * Үнэгүй (0) сэлбэг дээр "Үнийн санал авах" дарахад нээгдэх цонх.
 *
 * Загвартай бараа бол аль загварыг сонирхож байгааг сонгуулна. Хүсэлт
 * админы "Үнийн санал" хэсэгт очиж, менежер үнэ тогтоогоод утсаар
 * хариулна.
 */
export const PriceQuoteModal: React.FC<{
  part: SparePart;
  /** Загварын жагсаалтаас дарсан бол тэр загвар урьдчилан сонгогдоно */
  variantId?: string;
  onClose: () => void;
}> = ({ part, variantId, onClose }) => {
  const variants = part.variants ?? [];
  const [selected, setSelected] = useState(variantId ?? variants[0]?.id ?? '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sentId, setSentId] = useState<string | null>(null);

  const variant = useMemo(() => variants.find((v) => v.id === selected), [variants, selected]);
  const code = variant?.code ?? part.oemCode;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 6) {
      setError('Утасны дугаараа бүрэн оруулна уу.');
      return;
    }
    const count = Math.max(1, Math.min(9999, Math.round(qty) || 1));
    setError('');
    setSending(true);
    const result = await submitForm('quote', {
      contactName: name.trim(),
      phone: phone.trim(),
      summary: `${part.name} — ${code} × ${count}`,
      details: {
        'Төрөл': PRICE_QUOTE_TYPE,
        'Бараа': part.name,
        'Код': code,
        'Загвар': variant?.name,
        'Брэнд': variant?.brand ?? part.brand,
        'Тоо ширхэг': count,
        'Нэмэлт тайлбар': note.trim(),
        'Холбоос': `${window.location.origin}${productPath(part.id)}`,
        [Q.productId]: part.id,
        [Q.variantId]: variant?.id,
      },
    });
    setSending(false);
    if (result.status === 'sent') setSentId(result.id);
    else setError(result.message);
  };

  const field =
    'w-full h-11 px-3 rounded-xl bg-surface-3 border border-line text-sm text-ink placeholder:text-ink-subtle focus:border-brand-bright focus:outline-none';
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5';

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={QUOTE_LABEL}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface-2 border border-line"
      >
        <div className="sticky top-0 z-10 bg-surface-2 border-b border-line px-5 py-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-widest text-brand-bright">
              {QUOTE_LABEL}
            </div>
            <h3 className="text-base font-black text-ink leading-snug">{part.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-muted cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentId ? (
          <div className="px-5 py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <h4 className="mt-3 text-lg font-black text-ink">Хүсэлт хүлээн авлаа</h4>
            <p className="mt-1 text-xs font-mono text-brand-bright">{sentId}</p>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
              Менежер <strong className="text-ink">{code}</strong>-ийн үнийг тогтоогоод таны{' '}
              <strong className="text-ink">{phone}</strong> дугаар луу холбогдоно. Яаралтай бол{' '}
              <a href={`tel:+976${HOTLINE.replace(/\D/g, '')}`} className="text-brand-bright font-bold">
                {HOTLINE}
              </a>{' '}
              дугаар луу залгаарай.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 px-6 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Хаах
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 py-4 space-y-4">
            {variants.length > 0 ? (
              <div>
                <label className={label} htmlFor="pq-variant">Загвар</label>
                <select
                  id="pq-variant"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className={field}
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.code}{v.name ? ` — ${v.name}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-xs text-ink-muted">
                Код: <span className="font-mono font-bold text-brand-bright">{part.oemCode}</span>
              </div>
            )}

            <div className="grid grid-cols-[1fr_7rem] gap-3">
              <div>
                <label className={label} htmlFor="pq-phone">Утас *</label>
                <input
                  id="pq-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (error) setError(''); }}
                  placeholder="9911-XXXX"
                  aria-invalid={Boolean(error)}
                  className={`${field} font-mono ${error ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className={label} htmlFor="pq-qty">Тоо</label>
                <input
                  id="pq-qty"
                  type="number"
                  min={1}
                  max={9999}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className={label} htmlFor="pq-name">Нэр, байгууллага</label>
              <input
                id="pq-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Жишээ: Б. Болд, Шинэ Өргөө СӨХ"
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor="pq-note">Нэмэлт тайлбар</label>
              <textarea
                id="pq-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Лифтний брэнд, он, хүргэлтийн хаяг г.м"
                className={`${field} h-auto py-2.5`}
              />
            </div>

            {error && <p role="alert" className="text-xs text-danger-soft">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait transition-colors"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Илгээж байна…' : 'Үнийн санал хүсэх'}
            </button>
            <p className="text-[11px] text-ink-subtle leading-relaxed text-center">
              Менежер үнийг тогтоогоод таны утас руу холбогдоно.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default PriceQuoteModal;
