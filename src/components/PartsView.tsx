import React, { useEffect, useState } from 'react';
import { submitForm } from '../lib/submitForm';
import { PhotoAttach, Photo } from './PhotoAttach';
import { ProductImage } from './ProductImage';
import { hasPrice, productPriceLabel } from '../lib/variants';
import { PriceQuoteModal } from './PriceQuoteModal';
import { flyToCart } from '../lib/flyToCart';
import {
  ShoppingBag,
  Search,
  Plus,
  Info,
  Truck,
  Send,
  CheckCircle2,
  Sparkles,
  PackagePlus,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productPath } from '../routes';
import { useProducts } from '../lib/useProducts';
import { PARTS_FILTER_BRANDS, PARTS_ORDER_BRANDS } from '../data/brands';
import { SparePart } from '../types';

interface PartsViewProps {
  onAddToCart: (part: SparePart) => void;
  onOpenCart: () => void;
}

export const PartsView: React.FC<PartsViewProps> = ({ 
  onAddToCart, 
  onOpenCart,
}) => {
  const { products: SPARE_PARTS, loading: productsLoading } = useProducts();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom Sourcing Form state
  const [sourceBrand, setSourceBrand] = useState(PARTS_ORDER_BRANDS[0].value);
  const [sourcePartName, setSourcePartName] = useState('');
  const [sourceYear, setSourceYear] = useState('2018');
  const [sourcePhone, setSourcePhone] = useState('');
  const [sourceNotes, setSourceNotes] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [sourcePhotos, setSourcePhotos] = useState<Photo[]>([]);
  const [sourceSuccess, setSourceSuccess] = useState(false);
  /** "Сэлбэг захиалга" товчоор ирэхэд маягтыг түр тодруулна */
  const [orderFocus, setOrderFocus] = useState(false);
  const [sourceSending, setSourceSending] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const [addedToast, setAddedToast] = useState<string | null>(null);
  /** Үнийн санал хүсэх цонх нээгдсэн бараа */
  const [quotePart, setQuotePart] = useState<SparePart | null>(null);

  const categories = [
    { key: 'all', label: 'Бүх ангилал' },
    { key: 'inverter', label: 'Инвертер & Хяналт' },
    { key: 'door', label: 'Хаалганы механизм' },
    { key: 'cable', label: 'Тросс & Кабель' },
    { key: 'sensor', label: 'Мэдрэгч & Фотоэлемент' },
    { key: 'button', label: 'Товчлуур & Дэлгэц (COP/LOP)' },
    { key: 'motor', label: 'Хөдөлгүүр & Мотор' },
    { key: 'brake', label: 'Тоормос & Аюулгүй байдал' },
    { key: 'oil', label: 'Бусад эд анги' }
  ];

  const brands = ['all', ...PARTS_FILTER_BRANDS];

  const filteredParts = SPARE_PARTS.filter(part => {
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || part.brand.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      part.oemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const handleAddToCartWithFeedback = (part: SparePart, source?: Element | null) => {
    flyToCart(source ?? null, part.image);
    onAddToCart(part);
    setAddedToast(`"${part.name}" сагсанд нэмэгдлээ!`);
    setTimeout(() => {
      setAddedToast(null);
    }, 3000);
  };

  const handleSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePartName || !sourcePhone) {
      setSourceError('Сэлбэгийн нэр болон утасны дугаараа оруулна уу.');
      return;
    }
    setSourceError('');
    setSourceSending(true);

    const result = await submitForm('sourcing', {
      contactName: sourceOrg,
      phone: sourcePhone,
      photos: sourcePhotos.map((p) => p.dataUrl),
      summary: `${sourcePartName} — ${sourceBrand}`,
      details: {
        'Брэнд': sourceBrand,
        'Тоноглолын он': sourceYear,
        'Сэлбэгийн нэр': sourcePartName,
        'Байгууллага / СӨХ': sourceOrg,
        'Нэмэлт тайлбар': sourceNotes,
      },
    });

    setSourceSending(false);
    if (result.status === 'sent') setSourceSuccess(true);
    else setSourceError(result.message);
  };

  // Тусгай захиалгын маягтаас өмнө яг ХОЁР МӨР бараа харуулна.
  // Баганын тоо нь доорх сүлжээний ангиллаас хамаарна:
  //   grid-cols-2 xl:grid-cols-3 (гар утсанд ч 2 багана)
  // Тэр ангиллыг өөрчилвөл энд ч гэсэн тааруулна.
  const columnsAt = (width: number) => (width >= 1280 ? 3 : 2);
  const [columns, setColumns] = useState(() =>
    typeof window === 'undefined' ? 4 : columnsAt(window.innerWidth)
  );

  useEffect(() => {
    const onResize = () => setColumns(columnsAt(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const FEATURED_COUNT = columns * 2;

  /**
   * Тусгай захиалгын маягт руу очих — ангиллын доорх "Сэлбэг захиалга"
   * товч. Хаягт #zahialga тавьдаг тул холбоосыг хуваалцаж болно.
   */
  const goToOrder = () => {
    const el = document.getElementById('source-section');
    if (!el) return;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#zahialga`);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setOrderFocus(true);
    window.setTimeout(() => {
      el.querySelector<HTMLElement>('select, input, textarea')?.focus({ preventScroll: true });
    }, reduce ? 0 : 600);
    window.setTimeout(() => setOrderFocus(false), 2200);
  };

  // /parts#zahialga хаягаар орж ирвэл бараа ачаалагдсаны дараа маягт руу очно
  useEffect(() => {
    if (!productsLoading && window.location.hash === '#zahialga') goToOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsLoading]);

  /** Тусгай захиалгын хэсэг — сүлжээний дунд бүтэн өргөнөөр орно */
  const sourcingSection = (
    <div id="source-section" className="col-span-full scroll-mt-24 my-2">
        <div className="max-w-3xl mx-auto">
          
          <div className={`p-8 md:p-10 rounded-2xl bg-surface-2 border shadow-2xl transition-all duration-500 ${
            orderFocus ? 'border-brand ring-4 ring-brand/25' : 'border-line'
          }`}>
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/15 text-brand-bright text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Тусгай Захиалга</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-ink">
                Олдохгүй Байгаа Сэлбэг Захиалах
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Хуучин эсвэл Монголд ховор лифтний сэлбэгийн мэдээллийг илгээвэл бид БНХАУ, Солонгос, Европын үйлдвэрлэгчдээс шууд олж, үнийн санал гаргана.
              </p>
            </div>

            {sourceSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-success mx-auto mb-3" />
                <h3 className="text-xl font-bold text-ink mb-2">
                  Сэлбэгийн хүсэлт хүлээн авлаа!
                </h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto mb-6">
                  Манай гадаад худалдааны менежер тухайн сэлбэгийн үйлдвэрийн нийлүүлэлт, тээврийн хугацаа болон үнийн тооцоог таны <strong className="text-accent-ink">{sourcePhone}</strong> дугаарт 2 цагийн дотор мэдэгдэх болно.
                </p>
                <button
                  onClick={() => setSourceSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Шинэ сэлбэг хайх хүсэлт илгээх
                </button>
              </div>
            ) : (
              <form onSubmit={handleSourceSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Лифтний брэнд / Үйлдвэрлэгч *
                    </label>
                    <select
                      value={sourceBrand}
                      onChange={(e) => setSourceBrand(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                    >
                      {PARTS_ORDER_BRANDS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Үйлдвэрлэсэн он (ойролцоогоор)
                    </label>
                    <input 
                      type="text"
                      placeholder="Жишээ: 2012 эсвэл 2005 он"
                      value={sourceYear}
                      onChange={(e) => setSourceYear(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Шаардлагатай сэлбэгийн нэр эсвэл зориулалт *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Жишээ: Хаалганы серво мотор, Редукторын араа, Дэлгэцийн хавтан..."
                    value={sourcePartName}
                    onChange={(e) => setSourcePartName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Холбоо барих утас *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="9911-XXXX"
                      value={sourcePhone}
                      onChange={(e) => setSourcePhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink font-mono focus:border-brand-bright focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Байгууллагын нэр / СӨХ
                    </label>
                    <input 
                      type="text"
                      placeholder="Жишээ: Шинэ Өргөө СӨХ"
                      value={sourceOrg}
                      onChange={(e) => setSourceOrg(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Сэлбэгийн пайз дээрх кодууд, үзүүлэлтийн тайлбар
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Хэрэв сэлбэгийн пайз (Model/Part No), вольт, ватт бичигдсэн бол энд бичнэ үү..."
                    value={sourceNotes}
                    onChange={(e) => setSourceNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-3 border border-line text-ink focus:border-brand-bright focus:outline-none"
                  />
                </div>

                <PhotoAttach
                  photos={sourcePhotos}
                  onChange={setSourcePhotos}
                  label="Сэлбэгийн зураг"
                  hint="Пайз дээрх код, холбогч хэсэг, эвдрэлийн байдал харагдвал үйлдвэрлэгчийг олоход хамгийн их тус болно."
                />

                {sourceError && (
                  <p role="alert" className="text-[11px] text-danger-soft text-center leading-relaxed">
                    {sourceError}
                  </p>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={sourceSending}
                    className="px-8 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg shadow-brand/30 disabled:opacity-60 disabled:cursor-wait"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sourceSending ? 'Илгээж байна…' : 'Үйлдвэрээс захиалах үнийн санал авах'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
    </div>
  );

  return (
    <div id="parts-view" className="w-full bg-surface-1 text-ink min-h-screen">
      
      {/* Toast alert */}
      {addedToast && (
        <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 bg-brand text-white px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-neutral-950" />
          <span>{addedToast}</span>
          <button 
            onClick={onOpenCart} 
            className="underline ml-2 hover:opacity-80 cursor-pointer"
          >
            Сагс үзэх →
          </button>
        </div>
      )}

      {/* 2. Catalog & Search & Filters */}
      <section className="theme-light bg-surface-1 py-8 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[232px_1fr] lg:gap-8">

        {/* Ангилал — lg дээр зүүн талд босоо, түүнээс бага дэлгэцэд хөндлөн */}
        <aside className="mb-6 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
          <h2 className="hidden lg:block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-3">
            Ангилал
          </h2>
          <nav
            aria-label="Сэлбэгийн ангилал"
            className="flex lg:flex-col items-center lg:items-stretch gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              const count =
                cat.key === 'all'
                  ? SPARE_PARTS.length
                  : SPARE_PARTS.filter((p) => p.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  aria-current={active ? 'true' : undefined}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap lg:whitespace-normal lg:text-left transition cursor-pointer lg:flex lg:items-center lg:justify-between lg:gap-2 ${
                    active
                      ? 'bg-brand text-white font-bold shadow-md shadow-brand/30'
                      : 'bg-surface-2 text-ink-muted hover:text-ink border border-line'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`hidden lg:inline text-[10px] font-mono tabular-nums ${
                      active ? 'text-white/70' : 'text-ink-subtle'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Олдохгүй байгаа сэлбэг — тусгай захиалгын маягт руу */}
          <button
            id="parts-order-cta"
            type="button"
            onClick={goToOrder}
            className="group/cta mt-3 lg:mt-5 w-full flex items-center gap-3 p-3 lg:p-3.5 rounded-xl bg-gradient-to-br from-[#FFD43B] to-[#F7B500] text-[#0B3F78] text-left shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
              <PackagePlus className="w-5 h-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block whitespace-nowrap text-sm lg:text-[13px] font-black uppercase">Сэлбэг захиалга</span>
              <span className="block text-[11px] font-semibold leading-snug text-[#0B3F78]/80">Олдохгүй байгаа сэлбэгийг үйлдвэрээс</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover/cta:translate-x-1 transition-transform" />
          </button>
        </aside>

        {/* Баруун багана */}
        <div className="min-w-0">

        {/* Хайлт ба брэнд — бүх дэлгэцэд нэг мөрөнд */}
        <div id="parts-filter-bar" className="p-3 sm:p-4 rounded-2xl bg-surface-2 border border-line mb-6 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
            <input
              type="search"
              placeholder="Нэр, кодоор хайх"
              aria-label="Сэлбэгийн нэр эсвэл кодоор хайх"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-3 border border-line text-ink text-xs placeholder:text-ink-subtle focus:border-brand-bright focus:outline-none"
            />
          </div>
          <label className="shrink-0 flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-ink-muted whitespace-nowrap">Брэнд:</span>
            <select
              aria-label="Брэнд"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-11 w-32 sm:w-44 px-3 rounded-xl bg-surface-3 border border-line text-ink text-xs focus:border-brand-bright focus:outline-none cursor-pointer"
            >
              <option value="all">Бүх брэнд</option>
              {brands.filter(b => b !== 'all').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-surface-2 border border-line text-ink-muted">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-bright animate-pulse" />
            <p className="text-sm font-semibold text-ink">Сэлбэгийн жагсаалт ачаалж байна…</p>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-surface-2 border border-line text-ink-muted">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-bright" />
            <p className="text-sm font-semibold text-ink">Хайлтад тохирох сэлбэг олдсонгүй</p>
            <p className="text-xs text-ink-subtle mt-1 mb-4">
              Та доорх "Олдохгүй байгаа сэлбэг захиалах" тусгай маягтаар хүсэлтээ илгээнэ үү.
            </p>
            <a 
              href="#source-section" 
              className="inline-block px-4 py-2 rounded-xl bg-brand text-white font-bold text-xs uppercase"
            >
              Үйлдвэрээс захиалах хүсэлт илгээх
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
            {filteredParts.map((part, index) => (
              <React.Fragment key={part.id}>
              <div 
                className="group min-w-0 rounded-xl sm:rounded-2xl bg-surface-2 border border-line hover:border-brand transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div>
                  {/* Зураг — дэлгэрэнгүй хуудас руу хөтөлнө */}
                  <div className="relative h-36 sm:h-48 overflow-hidden bg-surface-1">
                    <Link
                      to={productPath(part.id)}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="absolute inset-0 p-3 pt-7 sm:p-4 flex items-center justify-center"
                    >
                      <ProductImage
                        src={part.image}
                        alt={part.name}
                        thumb
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                        fallbackClassName="w-full h-full bg-surface-2 rounded-xl"
                        iconClassName="w-8 h-8 text-ink-subtle opacity-40"
                      />
                    </Link>

                    <div className="pointer-events-none absolute top-2 left-2 sm:top-2.5 sm:left-2.5 max-w-[45%] truncate px-1.5 sm:px-2 py-0.5 rounded bg-surface-2/90 text-[9px] sm:text-[10px] font-mono text-ink-muted border border-white/10">
                      {part.brand}
                    </div>

                    <div className="pointer-events-none absolute top-2 right-2 sm:top-2.5 sm:right-2.5 text-[9px] sm:text-[10px]">
                      {part.inStock ? (
                        <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/10 text-success border border-emerald-500/40 font-bold whitespace-nowrap">
                          Бэлэн ({part.stockCount})
                        </span>
                      ) : (
                        <span className="px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/10 text-warn border border-amber-500/40 font-bold whitespace-nowrap">
                          Захиалгаар
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Part Info */}
                  <div className="p-3 sm:p-4">
                    <div translate="no" className="text-[10px] sm:text-[11px] font-mono text-brand-bright font-semibold mb-1 truncate">
                      {part.oemCode}
                    </div>
                    <h3 className="mb-2">
                      <Link
                        to={productPath(part.id)}
                        className="text-xs font-bold text-ink line-clamp-2 hover:text-brand-bright group-hover:text-warn transition-colors"
                      >
                        {part.name}
                      </Link>
                    </h3>
                    {/* Гар утсанд карт нарийн — тайлбарыг дэлгэрэнгүй хуудсанд үлдээнэ */}
                    <div className="hidden sm:block text-[11px] text-ink-muted line-clamp-2 mb-3">
                      {part.description}
                    </div>

                    <div className="text-[10px] text-ink-subtle mb-2 sm:mb-3 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-brand-bright" />
                      <span>{part.deliveryDays}</span>
                    </div>

                    <div className="pt-2 border-t border-line flex flex-col items-start sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                      <span className={`text-[11px] sm:text-xs text-ink-subtle shrink-0 ${part.variants?.length ? '' : 'hidden sm:inline'}`}>
                        {part.variants?.length ? `${part.variants.length} загвар` : 'Үнэ:'}
                      </span>
                      {hasPrice(part) ? (
                        <span className="text-xs sm:text-sm font-black text-accent-ink font-mono sm:text-right">
                          {productPriceLabel(part)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setQuotePart(part)}
                          className="text-[11px] sm:text-xs font-bold text-accent-ink underline decoration-dotted underline-offset-4 hover:text-accent-hover cursor-pointer text-left sm:text-right py-2.5 -my-2.5"
                        >
                          {productPriceLabel(part)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 pt-0 sm:p-4 sm:pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Гар утсанд зураг, нэр нь дэлгэрэнгүй рүү хөтөлдөг тул зөвхөн гол товч */}
                  <Link
                    to={productPath(part.id)}
                    className="hidden sm:flex py-2 px-3 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted text-xs font-semibold transition cursor-pointer items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Үзүүлэлт</span>
                  </Link>

                  <button
                    onClick={(e) =>
                      part.variants?.length
                        ? navigate(productPath(part.id))
                        : handleAddToCartWithFeedback(
                            part,
                            e.currentTarget.closest('.group')?.querySelector('img')
                          )
                    }
                    className="min-h-10 py-2 px-2 sm:px-3 rounded-lg bg-brand hover:bg-brand-hover text-white font-bold text-[11px] sm:text-xs uppercase sm:tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-brand/30 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{part.variants?.length ? 'Загвар сонгох' : 'Сагслах'}</span>
                  </button>
                </div>
              </div>

              {/* Хоёр мөр барааны дараа тусгай захиалга, дараа нь үлдсэн нь цувна */}
              {index === FEATURED_COUNT - 1 && sourcingSection}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Бараа хоёр мөрөөс цөөн бол маягтыг жагсаалтын дараа тавина */}
        {!productsLoading && filteredParts.length < FEATURED_COUNT && (
          <div className="grid grid-cols-1 mt-6">{sourcingSection}</div>
        )}

        </div>

        </div>
      </section>

      {quotePart && <PriceQuoteModal part={quotePart} onClose={() => setQuotePart(null)} />}
    </div>
  );
};
