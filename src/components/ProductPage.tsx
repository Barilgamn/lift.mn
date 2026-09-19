import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Plus, ShoppingBag, Truck } from 'lucide-react';
import { SparePart } from '../types';
import { useProducts } from '../lib/useProducts';
import { ProductImage } from './ProductImage';
import { ImageZoom, ZoomableImage } from './ImageZoom';
import { priceLabel, productPriceLabel, variantAsPart } from '../lib/variants';
import { ROUTES, productPath } from '../routes';

/** Санал болгох бараа: эхлээд ижил ангиллаас, дутвал бусдаас нөхнө */
function recommend(current: SparePart, all: SparePart[], count = 4): SparePart[] {
  const others = all.filter((p) => p.id !== current.id);
  const same = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, count);
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full bg-surface-1 text-ink min-h-[60dvh]">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</div>
  </div>
);

/**
 * Барааны дэлгэрэнгүй — бүтэн хуудас (`/parts/:productId`).
 *
 * Өмнө нь popup байсан. Бүтэн хуудас болсноор хаяг хуваалцах, хөтчийн
 * буцах товч ажиллах, хайлтын систем индекслэх боломжтой болно.
 */
export const ProductPage: React.FC<{
  onAddToCart: (part: SparePart) => void;
  /** Байршлын мөрөнд барааны нэрийг харуулахад ашиглана */
  onTitle?: (name: string | undefined) => void;
}> = ({ onAddToCart, onTitle }) => {
  const { productId = '' } = useParams();
  const { products, loading } = useProducts();
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const part = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
  const suggestions = useMemo(
    () => (part ? recommend(part, products) : []),
    [part, products]
  );

  // Өөр бараа руу шилжихэд хуудасны эхнээс харуулна
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setAdded(null);
  }, [productId]);

  // Байршлын мөрөнд нэрээ өгнө. Хуудаснаас гарахад цэвэрлэнэ.
  useEffect(() => {
    onTitle?.(part?.name);
    return () => onTitle?.(undefined);
  }, [part?.name, onTitle]);

  const add = (target: SparePart, label: string) => {
    onAddToCart(target);
    setAdded(label);
    window.setTimeout(() => setAdded(null), 3000);
  };

  if (loading) {
    return (
      <Shell>
        <div className="text-center py-20 text-ink-muted">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30 text-brand-bright animate-pulse" />
          <p className="text-sm font-semibold text-ink">Бүтээгдэхүүн ачаалж байна…</p>
        </div>
      </Shell>
    );
  }

  if (!part) {
    return (
      <Shell>
        <div className="text-center py-20">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30 text-brand-bright" />
          <p className="text-sm font-semibold text-ink">Энэ бараа олдсонгүй</p>
          <p className="text-xs text-ink-subtle mt-1 mb-5">
            Устгагдсан эсвэл хаяг буруу байж магадгүй.
          </p>
          <Link
            to={ROUTES.parts.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Дэлгүүр рүү буцах
          </Link>
        </div>
      </Shell>
    );
  }

  const variants = part.variants ?? [];

  return (
    <>
      <Shell>
        <Link
          to={ROUTES.parts.path}
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-bright transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Бүх сэлбэг
        </Link>

        {/* Дээд хэсэг: зураг зүүн, мэдээлэл баруун */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-6 lg:gap-10">
          <ZoomableImage
            src={part.image}
            alt={part.name}
            onZoom={(src, alt) => setZoom({ src, alt })}
            className="w-full h-full object-contain p-4"
            fallbackClassName="w-full aspect-[4/3] rounded-2xl bg-surface-2 border border-line"
            iconClassName="w-4 h-4"
          >
            <ProductImage
              src=""
              alt={part.name}
              className=""
              fallbackClassName="w-full h-full"
              iconClassName="w-10 h-10 text-ink-subtle opacity-40"
            />
          </ZoomableImage>

          <div className="min-w-0">
            <span className="text-[11px] font-mono text-brand-bright font-bold uppercase tracking-wider">
              {part.brand} · {part.oemCode}
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {part.name}
            </h1>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">{part.description}</p>

            <dl className="mt-5 rounded-2xl bg-surface-2 border border-line divide-y divide-line text-sm">
              {Object.entries(part.specs).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-ink-subtle text-xs">{k}</dt>
                  <dd className="font-semibold text-right">{v}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-ink-subtle text-xs flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Хүргэлт
                </dt>
                <dd className="font-semibold text-success text-right">{part.deliveryDays}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
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
                onClick={() => add(part, part.name)}
                className="mt-5 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-brand/30 transition-colors"
              >
                <Plus className="w-4 h-4" /> Сагсанд нэмэх
              </button>
            )}
          </div>
        </div>

        {/* Загварууд */}
        {variants.length > 0 && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-black">Загвар сонгох</h2>
              <span className="text-xs text-ink-subtle">{variants.length} загвар</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {variants.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-line hover:border-brand transition-colors"
                >
                  <ZoomableImage
                    src={v.image}
                    alt={`${part.name} — ${v.code}`}
                    onZoom={(src, alt) => setZoom({ src, alt })}
                    className="w-full h-full object-contain"
                    fallbackClassName="w-[72px] h-[72px] shrink-0 rounded-lg bg-white"
                  >
                    <ProductImage
                      src=""
                      alt={v.code}
                      className=""
                      fallbackClassName="w-[72px] h-[72px] rounded-lg bg-surface-3"
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
                    onClick={() => add(variantAsPart(part, v), `${part.name} — ${v.code}`)}
                    aria-label={`${v.code} сагсанд нэмэх`}
                    className="shrink-0 w-11 h-11 rounded-lg bg-brand hover:bg-brand-hover text-white flex items-center justify-center cursor-pointer shadow-md transition-colors"
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

        {/* Санал болгох */}
        {suggestions.length > 0 && (
          <section className="mt-12 pt-8 border-t border-line">
            <h2 className="text-base font-black mb-4">Санал болгох бүтээгдэхүүн</h2>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <Link
                    to={productPath(s.id)}
                    className="block h-full rounded-xl bg-surface-2 border border-line hover:border-brand overflow-hidden transition-colors group/sug"
                  >
                    <ProductImage
                      src={s.image}
                      alt={s.name}
                      className="w-full h-28 object-contain p-3 group-hover/sug:scale-105 transition-transform duration-300"
                      fallbackClassName="w-full h-28 bg-surface-1"
                      iconClassName="w-6 h-6 text-ink-subtle opacity-40"
                    />
                    <div className="p-3">
                      <div className="text-xs font-bold leading-snug line-clamp-2">{s.name}</div>
                      <div className="mt-1 text-[11px] text-ink-subtle">
                        {s.variants?.length ? `${s.variants.length} загвар` : s.categoryLabel}
                      </div>
                      <div className="mt-1 text-[11px] font-mono font-bold text-accent-ink">
                        {productPriceLabel(s)}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Shell>

      {/* Сагсанд нэмсэн мэдэгдэл */}
      {added && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-40 bg-brand text-white px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="max-w-[60vw] truncate">"{added}" сагсанд нэмэгдлээ</span>
        </div>
      )}

      {zoom && <ImageZoom src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </>
  );
};

export default ProductPage;
