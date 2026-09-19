import React, { useEffect, useState } from 'react';
import { submitForm } from '../lib/submitForm';
import { PhotoAttach, Photo } from './PhotoAttach';
import { ProductImage } from './ProductImage';
import { productPriceLabel } from '../lib/variants';
import {
  ShoppingBag,
  Search,
  Plus,
  Info,
  Truck,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productPath } from '../routes';
import { useProducts } from '../lib/useProducts';
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
  const [sourceBrand, setSourceBrand] = useState('OTIS');
  const [sourcePartName, setSourcePartName] = useState('');
  const [sourceYear, setSourceYear] = useState('2018');
  const [sourcePhone, setSourcePhone] = useState('');
  const [sourceNotes, setSourceNotes] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [sourcePhotos, setSourcePhotos] = useState<Photo[]>([]);
  const [sourceSuccess, setSourceSuccess] = useState(false);
  const [sourceSending, setSourceSending] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const [addedToast, setAddedToast] = useState<string | null>(null);

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

  const brands = [
    'all',
    'OTIS',
    'Mitsubishi',
    'Monarch',
    'CEDES',
    'STEP Tech',
    'Fermator',
    'TorinDrive',
    'Dynatech'
  ];

  const filteredParts = SPARE_PARTS.filter(part => {
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || part.brand.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      part.oemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const handleAddToCartWithFeedback = (part: SparePart) => {
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
  //   grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
  // Тэр ангиллыг өөрчилвөл энд ч гэсэн тааруулна.
  const columnsAt = (width: number) => (width >= 1280 ? 3 : width >= 640 ? 2 : 1);
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

  /** Тусгай захиалгын хэсэг — сүлжээний дунд бүтэн өргөнөөр орно */
  const sourcingSection = (
    <div id="source-section" className="col-span-full scroll-mt-24 my-2">
        <div className="max-w-3xl mx-auto">
          
          <div className="p-8 md:p-10 rounded-2xl bg-surface-2 border border-line shadow-2xl">
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
                      <option value="OTIS">OTIS</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Sigma">Sigma (LG)</option>
                      <option value="Schindler">Schindler</option>
                      <option value="KONE">KONE</option>
                      <option value="Monarch">Monarch</option>
                      <option value="Other">Бусад / Тодорхойгүй</option>
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
        <div className="fixed bottom-6 right-6 z-50 bg-brand text-white px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
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
        </aside>

        {/* Баруун багана */}
        <div className="min-w-0">

        {/* Search & Brand Filter Bar */}
        <div className="p-4 rounded-2xl bg-surface-2 border border-line mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-ink-subtle" />
            <input 
              type="text"
              placeholder="Сэлбэгийн нэр эсвэл кодоор хайх (Жишээ: NICE, AT120, 10mm)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-3 border border-line text-ink text-xs placeholder:text-ink-subtle focus:border-brand-bright focus:outline-none"
            />
          </div>

          {/* Brand select */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-ink-muted whitespace-nowrap">Брэнд:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-3 border border-line text-ink text-xs focus:border-brand-bright focus:outline-none cursor-pointer"
            >
              <option value="all">Бүх брэнд</option>
              {brands.filter(b => b !== 'all').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredParts.map((part, index) => (
              <React.Fragment key={part.id}>
              <div 
                className="group rounded-2xl bg-surface-2 border border-line hover:border-brand transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div>
                  {/* Зураг — дэлгэрэнгүй хуудас руу хөтөлнө */}
                  <div className="relative h-48 overflow-hidden bg-surface-1">
                    <Link
                      to={productPath(part.id)}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="absolute inset-0 p-4 flex items-center justify-center"
                    >
                      <ProductImage
                        src={part.image}
                        alt={part.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                        fallbackClassName="w-full h-full bg-surface-2 rounded-xl"
                        iconClassName="w-8 h-8 text-ink-subtle opacity-40"
                      />
                    </Link>

                    <div className="pointer-events-none absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-2/90 text-[10px] font-mono text-ink-muted border border-white/10">
                      {part.brand}
                    </div>

                    <div className="pointer-events-none absolute top-2.5 right-2.5">
                      {part.inStock ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-success border border-emerald-500/40 text-[10px] font-bold">
                          Бэлэн ({part.stockCount})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-warn border border-amber-500/40 text-[10px] font-bold">
                          Захиалгаар
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Part Info */}
                  <div className="p-4">
                    <div className="text-[11px] font-mono text-brand-bright font-semibold mb-1">
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
                    <div className="text-[11px] text-ink-muted line-clamp-2 mb-3">
                      {part.description}
                    </div>

                    <div className="text-[10px] text-ink-subtle mb-3 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-brand-bright" />
                      <span>{part.deliveryDays}</span>
                    </div>

                    <div className="pt-2 border-t border-line flex items-baseline justify-between gap-2">
                      <span className="text-xs text-ink-subtle shrink-0">
                        {part.variants?.length ? `${part.variants.length} загвар` : 'Үнэ:'}
                      </span>
                      <span className="text-sm font-black text-accent-ink font-mono text-right">
                        {productPriceLabel(part)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <Link
                    to={productPath(part.id)}
                    className="py-2 px-3 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Үзүүлэлт</span>
                  </Link>

                  <button
                    onClick={() =>
                      part.variants?.length
                        ? navigate(productPath(part.id))
                        : handleAddToCartWithFeedback(part)
                    }
                    className="py-2 px-3 rounded-lg bg-brand hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-brand/30"
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
        {!productsLoading && filteredParts.length <= FEATURED_COUNT && (
          <div className="grid grid-cols-1 mt-6">{sourcingSection}</div>
        )}

        </div>

        </div>
      </section>


    </div>
  );
};
