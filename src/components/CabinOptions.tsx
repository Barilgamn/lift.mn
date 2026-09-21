import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Layers, X } from 'lucide-react';
import { CABIN_THEMES, CabinModel, CabinTheme, OPTION_GROUPS, OptionItem } from '../data/cabinData';
import { ImageZoom } from './ImageZoom';
import { Reveal } from './Reveal';

/**
 * KLEEMANN-ы каталогийн сонголтууд — бүхээгийн дизайн, хаалга, панорама,
 * ачааны лифт.
 *
 * Бүхээгийн загвар бүр 2-3 өнгөний хувилбартай бөгөөд хувилбар тус бүр
 * өөрийн материалын жагсаалттай. Тиймээс карт дарахад хувилбар сонгож,
 * тухайн хувилбарын материалыг зэрэгцүүлэн харуулах цонх нээгдэнэ.
 */

/** Дээд талын ангиллын цэс — гурван дизайн загвар + бусад бүлгүүд */
type TabId = string;

/** Esc товч дарахад цонхыг хаана — модал цонхны хүлээгдэж буй зан төлөв */
function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
}

/**
 * Дэлгэрэнгүй цонхны доод талын "үнийн санал авах" товч.
 *
 * Дарахад цонхоо ЗААВАЛ хаана — эс бөгөөс маягт руу гүйлгэсэн ч дэлгэц
 * дүүрэн бүрхүүл дээр үлдэж, хэрэглэгч юу ч дарж чадахгүй болно.
 */
const QuoteButton: React.FC<{
  label: string;
  onRequestQuote: (label: string) => void;
  onClose: () => void;
}> = ({ label, onRequestQuote, onClose }) => (
  <button
    type="button"
    onClick={() => {
      onRequestQuote(label);
      onClose();
    }}
    className="mt-5 w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors active:scale-[0.99]"
  >
    <span>Энэ загвараар үнийн санал авах</span>
    <ArrowRight className="w-4 h-4" />
  </button>
);

const CabinDetail: React.FC<{
  theme: CabinTheme;
  model: CabinModel;
  onClose: () => void;
  onRequestQuote: (label: string) => void;
}> = ({ theme, model, onClose, onRequestQuote }) => {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const variant = model.variants[index] ?? model.variants[0];
  // Зураг томруулсан үед Esc нь эхлээд томруулсан цонхыг хаана
  useEscape(() => { if (!zoom) onClose(); });

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${theme.title} ${model.code}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface-2 border border-line"
      >
        <div className="sticky top-0 z-10 bg-surface-2 border-b border-line px-5 py-3.5 flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-brand-bright">
              {theme.title}
            </div>
            <h3 className="text-lg font-black text-ink tracking-tight">KLEEMANN {model.code}</h3>
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

        <div className="p-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-5">
          <div>
            <button
              type="button"
              onClick={() => setZoom(true)}
              aria-label={`${model.code} бүхээгийг томруулж харах`}
              className="block w-full rounded-xl overflow-hidden border border-line cursor-zoom-in"
            >
              <img
                src={variant.image}
                alt={`KLEEMANN ${model.code} бүхээг — ${index + 1}-р хувилбар`}
                className="w-full aspect-3/4 object-cover"
              />
            </button>

            {model.variants.length > 1 && (
              <div className="mt-3 flex gap-2">
                {model.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}-р хувилбар`}
                    aria-current={i === index ? 'true' : undefined}
                    className={`w-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      i === index ? 'border-brand' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <img src={v.image} alt="" className="w-full aspect-3/4 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-3">
              {index + 1}-р хувилбарын материал
            </div>
            <dl className="divide-y divide-line">
              {variant.spec.map((row) => (
                <div key={row.label} className="py-2.5">
                  <dt className="text-[11px] text-ink-subtle">{row.label}</dt>
                  <dd className="mt-0.5 text-sm text-ink leading-snug">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[11px] text-ink-subtle leading-relaxed">
              Өнгө, материалыг каталогийн жагсаалтаас чөлөөтэй сонгож,
              өөрийн барилгын засалд тохируулан захиалах боломжтой.
            </p>

            <QuoteButton
              label={`${theme.title} ${model.code} · ${index + 1}-р хувилбар`}
              onRequestQuote={onRequestQuote}
              onClose={onClose}
            />
          </div>
        </div>

        {zoom && (
          <ImageZoom
            src={variant.image}
            alt={`KLEEMANN ${model.code} бүхээг`}
            onClose={() => setZoom(false)}
          />
        )}
      </div>
    </div>
  );
};

/** Панорама, хаалга, ачааны лифтний карт дарахад нээгдэх цонх */
const OptionDetail: React.FC<{
  groupTitle: string;
  item: OptionItem;
  onClose: () => void;
  onRequestQuote: (label: string) => void;
}> = ({ groupTitle, item, onClose, onRequestQuote }) => {
  const [zoom, setZoom] = useState(false);
  useEscape(() => { if (!zoom) onClose(); });
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface-2 border border-line"
      >
        <div className="sticky top-0 z-10 bg-surface-2 border-b border-line px-5 py-3.5 flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-brand-bright">
              {groupTitle}
            </div>
            <h3 className="text-lg font-black text-ink tracking-tight">{item.title}</h3>
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

        <div className="p-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-5">
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={`${item.title} зургийг томруулж харах`}
            className="block w-full rounded-xl overflow-hidden border border-line cursor-zoom-in"
          >
            <img src={item.image} alt={item.title} className="w-full aspect-3/4 object-cover" />
          </button>

          <div>
            <p className="text-sm text-ink leading-relaxed">{item.note}</p>
            <p className="mt-3 text-[11px] text-ink-subtle leading-relaxed">
              Хэмжээ, өнгө, өнгөлгөөний материалыг барилгын зураг төсөлд тохируулан
              захиалгаар үйлдвэрлэнэ.
            </p>
            <QuoteButton
              label={`${groupTitle} · ${item.title}`}
              onRequestQuote={onRequestQuote}
              onClose={onClose}
            />
          </div>
        </div>

        {zoom && <ImageZoom src={item.image} alt={item.title} onClose={() => setZoom(false)} />}
      </div>
    </div>
  );
};

export const CabinOptions: React.FC<{ onRequestQuote: (label: string) => void }> = ({
  onRequestQuote,
}) => {
  const tabs = useMemo(
    () => [
      ...CABIN_THEMES.map((t) => ({ id: t.id, label: t.title })),
      ...OPTION_GROUPS.map((g) => ({ id: g.id, label: g.title })),
    ],
    []
  );
  const [tab, setTab] = useState<TabId>(tabs[0].id);
  const [open, setOpen] = useState<{ theme: CabinTheme; model: CabinModel } | null>(null);
  const [openItem, setOpenItem] = useState<{ group: string; item: OptionItem } | null>(null);

  const theme = CABIN_THEMES.find((t) => t.id === tab) ?? null;
  const group = OPTION_GROUPS.find((g) => g.id === tab) ?? null;
  const note = theme?.note ?? group?.note ?? '';

  const totalVariants = useMemo(
    () => CABIN_THEMES.reduce((n, t) => n + t.models.reduce((m, x) => m + x.variants.length, 0), 0),
    []
  );
  const totalOptions = useMemo(
    () => OPTION_GROUPS.reduce((n, g) => n + g.items.length, 0),
    []
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Сонголтууд</span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
            Бүхээг, хаалганы сонголтууд
          </h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-2xl">
            KLEEMANN-ы каталогаас {totalVariants} бүхээгийн хувилбар, панорама бүхээг, хаалга,
            ачааны лифтний {totalOptions} шийдэл. Карт дээр дарж материалын дэлгэрэнгүйг харна.
            Барилгадаа тохирохыг нь сонгоод үнийн санал авах хүсэлтдээ дугаарыг нь бичиж илгээнэ үү.
          </p>
        </div>
      </div>

      {/* Ангилал */}
      <div
        role="tablist"
        aria-label="Сонголтын ангилал"
        className="mt-7 flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 py-1"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`shrink-0 inline-flex items-center h-11 px-5 rounded-xl text-sm font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                active
                  ? 'bg-brand text-white border-brand shadow-lg shadow-brand/25'
                  : 'bg-surface-3 text-ink-muted border-line hover:text-ink hover:border-line-strong'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {note && <p className="mt-4 text-xs text-ink-subtle">{note}</p>}

      {/* Бүхээгийн загварууд */}
      {theme && (
        <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {theme.models.map((m, i) => (
            <Reveal key={m.code} as="li" delay={(i % 5) * 70}>
              <button
                type="button"
                onClick={() => setOpen({ theme, model: m })}
                className="group w-full text-left rounded-xl overflow-hidden bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300 cursor-pointer"
              >
                <img
                  src={m.variants[0].image}
                  alt={`KLEEMANN ${m.code} бүхээг`}
                  loading="lazy"
                  className="w-full aspect-3/4 object-cover"
                />
                <div className="p-3">
                  <div className="text-sm font-black text-ink">{m.code}</div>
                  <div className="mt-0.5 text-[11px] text-ink-subtle">
                    {m.variants.length} хувилбар
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      )}

      {/* Панорама, хаалга, ачааны лифт */}
      {group && (
        <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {group.items.map((it, i) => (
            <Reveal key={it.id} as="li" delay={(i % 5) * 70}>
              <button
                type="button"
                onClick={() => setOpenItem({ group: group.title, item: it })}
                className="group w-full h-full text-left rounded-xl overflow-hidden bg-surface-3 border border-line hover:border-brand hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 transition-[border-color,box-shadow,translate] duration-300 cursor-zoom-in flex flex-col"
              >
                <img
                  src={it.image}
                  alt={it.title}
                  loading="lazy"
                  className="w-full aspect-3/4 object-cover"
                />
                <div className="p-3">
                  <div className="text-[13px] font-bold text-ink leading-snug">{it.title}</div>
                  <div className="mt-0.5 text-[11px] text-ink-subtle leading-snug">{it.note}</div>
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      )}

      {open && (
        <CabinDetail
          theme={open.theme}
          model={open.model}
          onClose={() => setOpen(null)}
          onRequestQuote={onRequestQuote}
        />
      )}
      {openItem && (
        <OptionDetail
          groupTitle={openItem.group}
          item={openItem.item}
          onClose={() => setOpenItem(null)}
          onRequestQuote={onRequestQuote}
        />
      )}
    </div>
  );
};

export default CabinOptions;
