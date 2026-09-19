import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Truck, X } from 'lucide-react';
import { SparePart } from '../types';
import { ProductImage } from './ProductImage';
import { ImageZoom, ZoomableImage } from './ImageZoom';
import { priceLabel, productPriceLabel, variantAsPart } from '../lib/variants';

interface ProductDetailProps {
  part: SparePart;
  /** Санал болгох бараа сонгоход ашиглана */
  allProducts: SparePart[];
  onClose: () => void;
  onSelect: (part: SparePart) => void;
  onAddToCart: (part: SparePart) => void;
}

/** Санал болгох бараа: эхлээд ижил ангиллаас, дутвал бусдаас нөхнө */
function recommend(current: SparePart, all: SparePart[], count = 4): SparePart[] {
  const others = all.filter((p) => p.id !== current.id);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  part,
  allProducts,
  onClose,
  onSelect,
  onAddToCart,
}) => {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const variants = part.variants ?? [];
  const suggestions = useMemo(() => recommend(part, allProducts), [part, allProducts]);

  // Өөр бараа руу шилжихэд дээрээс нь эхлүүлнэ
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [part.id]);

  // Esc дарахад хаана. Зураг томорсон үед эхлээд түүнийг хаана.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (zoom) return; // ImageZoom өөрөө барина
      onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, zoom]);

  const openZoom = (src: string, alt: string) => setZoom({ src, alt });

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
        role="presentation"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${part.name} — дэлгэрэнгүй`}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto bg-surface-2 border border-line rounded-t-2xl sm:rounded-2xl shadow-2xl text-ink"
        >
          {/* Толгой — гүйлгэхэд дагаж наалдана */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 px-5 sm:px-6 py-4 bg-surface-2/95 backdrop-blur border-b border-line">
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-brand-bright font-bold uppercase tracking-wider">
                {part.brand} · {part.oemCode}
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight">{part.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Хаах"
              className="shrink-0 w-9 h-9 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted hover:text-ink flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            {/* Дээд хэсэг: зураг зүүн талд, мэдээлэл баруун талд */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-5 lg:gap-7 pt-5">
              <ZoomableImage
                src={part.image}
                alt={part.name}
                onZoom={openZoom}
                className="w-full h-full object-contain p-3"
                fallbackClassName="w-full aspect-[4/3] rounded-xl bg-surface-1 border border-line"
                iconClassName="w-4 h-4"
              >
                <ProductImage
                  src=""
                  alt={part.name}
                  className=""
                  fallbackClassName="w-full h-full"
                  iconClassName="w-9 h-9 text-ink-subtle opacity-40"
                />
              </ZoomableImage>

              <div className="min-w-0">
                <p className="text-sm text-ink-muted leading-relaxed">{part.description}</p>

                <dl className="mt-4 rounded-xl bg-surface-1 border border-line divide-y divide-line text-sm">
                  {Object.entries(part.specs).map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 px-3.5 py-2.5">
                      <dt className="text-ink-subtle text-xs">{k}</dt>
                      <dd className="font-semibold text-right">{v}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 px-3.5 py-2.5">
                    <dt className="text-ink-subtle text-xs flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Хүргэлт
                    </dt>
                    <dd className="font-semibold text-success text-right">{part.deliveryDays}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 px-3.5 py-2.5">
                    <dt className="text-ink-subtle text-xs">
                      {variants.length ? 'Үнийн хязгаар' : 'Нэгжийн үнэ'}
                    </dt>
                    <dd className="font-black text-accent-ink font-mono text-right">
                      {productPriceLabel(part)}
                    </dd>
                  </div>
                </dl>

                {!variants.length && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(part);
                      onClose();
                    }}
                    className="mt-4 w-full sm:w-auto px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Сагсанд нэмэх
                  </button>
                )}
              </div>
            </div>

            {/* Загварууд */}
            {variants.length > 0 && (
              <section className="mt-7">
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="text-sm font-black">Загвар сонгох</h4>
                  <span className="text-xs text-ink-subtle">{variants.length} загвар</span>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {variants.map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-1 border border-line hover:border-brand transition-colors"
                    >
                      <ZoomableImage
                        src={v.image}
                        alt={`${part.name} — ${v.code}`}
                        onZoom={openZoom}
                        className="w-full h-full object-contain"
                        fallbackClassName="w-16 h-16 shrink-0 rounded-lg bg-white"
                      >
                        <ProductImage
                          src=""
                          alt={v.code}
                          className=""
                          fallbackClassName="w-16 h-16 rounded-lg bg-surface-3"
                          iconClassName="w-4 h-4 text-ink-subtle opacity-50"
                        />
                      </ZoomableImage>

                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs font-bold text-brand-bright break-words">
                          {v.code}
                        </div>
                        <div className="text-[11px] text-ink-muted line-clamp-2">{v.name}</div>
                        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-bold text-accent-ink font-mono">
                            {priceLabel(v.price)}
                          </span>
                          {v.stockCount > 0 ? (
                            <span className="text-[10px] text-success">Бэлэн ({v.stockCount})</span>
                          ) : (
                            <span className="text-[10px] text-warn">Захиалгаар</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart(variantAsPart(part, v));
                          onClose();
                        }}
                        aria-label={`${v.code} сагсанд нэмэх`}
                        className="shrink-0 w-10 h-10 rounded-lg bg-brand hover:bg-brand-hover text-white flex items-center justify-center cursor-pointer shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-[11px] text-ink-subtle leading-relaxed">
                  Зураг дээр дарвал томроно. "Үнэ тохиролцоно" гэсэн загварыг сагсанд нэмээд
                  захиалга илгээвэл менежер үнийн санал буцаан илгээнэ.
                </p>
              </section>
            )}

            {/* Санал болгох бүтээгдэхүүн */}
            {suggestions.length > 0 && (
              <section className="mt-8 pt-6 border-t border-line">
                <h4 className="text-sm font-black mb-3">Санал болгох бүтээгдэхүүн</h4>
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(s)}
                        className="w-full h-full text-left rounded-xl bg-surface-1 border border-line hover:border-brand overflow-hidden cursor-pointer transition-colors group/sug"
                      >
                        <ProductImage
                          src={s.image}
                          alt={s.name}
                          className="w-full h-24 object-contain p-2 group-hover/sug:scale-105 transition-transform duration-300"
                          fallbackClassName="w-full h-24 bg-surface-2"
                          iconClassName="w-6 h-6 text-ink-subtle opacity-40"
                        />
                        <div className="p-2.5">
                          <div className="text-xs font-bold leading-snug line-clamp-2">{s.name}</div>
                          <div className="mt-1 text-[11px] text-ink-subtle">
                            {s.variants?.length ? `${s.variants.length} загвар` : s.categoryLabel}
                          </div>
                          <div className="mt-1 text-[11px] font-mono font-bold text-accent-ink">
                            {productPriceLabel(s)}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      {zoom && <ImageZoom src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </>
  );
};
