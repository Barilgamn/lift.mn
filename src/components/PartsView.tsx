import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ShoppingCart, 
  Check, 
  Plus, 
  Info, 
  Truck, 
  ShieldCheck, 
  FileCheck2, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SPARE_PARTS } from '../data/mockData';
import { SparePart, CartItem } from '../types';

interface PartsViewProps {
  onAddToCart: (part: SparePart) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const PartsView: React.FC<PartsViewProps> = ({ 
  onAddToCart, 
  onOpenCart, 
  cartCount 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailPart, setDetailPart] = useState<SparePart | null>(null);
  
  // Custom Sourcing Form state
  const [sourceBrand, setSourceBrand] = useState('OTIS');
  const [sourcePartName, setSourcePartName] = useState('');
  const [sourceYear, setSourceYear] = useState('2018');
  const [sourcePhone, setSourcePhone] = useState('');
  const [sourceNotes, setSourceNotes] = useState('');
  const [sourceSuccess, setSourceSuccess] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'Бүх ангилал' },
    { key: 'inverter', label: 'Инвертер & Хяналт' },
    { key: 'door', label: 'Хаалганы механизм' },
    { key: 'cable', label: 'Тросс & Кабель' },
    { key: 'sensor', label: 'Мэдрэгч & Фотоэлемент' },
    { key: 'button', label: 'Товчлуур & Дэлгэц (COP/LOP)' },
    { key: 'motor', label: 'Хөдөлгүүр & Мотор' },
    { key: 'brake', label: 'Тоормос & Аюулгүй байдал' }
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

  const handleSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePartName || !sourcePhone) {
      alert('Сэлбэгийн нэр болон утасны дугаараа оруулна уу!');
      return;
    }
    setSourceSuccess(true);
  };

  return (
    <div id="parts-view" className="w-full bg-[#051329] text-neutral-100 min-h-screen">
      
      {/* Toast alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-neutral-950 px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
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

      {/* 1. Header Banner */}
      <section className="relative py-14 border-b border-sky-900/40 overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Лифтний Оригинал Сэлбэгийн Дэлгүүр</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
                Лифт, Эскалаторын Сэлбэг Хэрэгсэл
              </h1>
              
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                OTIS, Mitsubishi, Hyundai, Monarch, Fermator зэрэг дэлхийн брэндүүдийн албан ёсны оригинал сэлбэгийн шууд худалдаа, найдвартай нийлүүлэлт.
              </p>
            </div>

            {/* Cart Trigger Card */}
            <div className="p-5 rounded-2xl bg-[#091B36] border border-sky-900/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Таны сагс:</div>
                  <div className="text-lg font-black text-white">{cartCount} бараа</div>
                </div>
              </div>
              <button
                id="parts-open-cart-btn"
                onClick={onOpenCart}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20"
              >
                <span>Сагс нээх</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick value props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-sky-900/40 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Оригинал OEM эд анги</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>УБ хотод өдөрт нь хүргэнэ</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>НӨАТ-ын баримт & Нэхэмжлэх</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>6-24 сарын албан баталгаа</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catalog & Search & Filters */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Brand Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#091B36] border border-sky-900/40 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Сэлбэгийн нэр эсвэл кодоор хайх (Жишээ: NICE, AT120, 10mm)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white text-xs placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Brand select */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-neutral-400 whitespace-nowrap">Брэнд:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-800 border border-sky-800/40 text-white text-xs focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="all">Бүх брэнд</option>
              {brands.filter(b => b !== 'all').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-[#091B36] text-neutral-400 hover:text-white border border-sky-900/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredParts.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-[#091B36]/60 border border-sky-900/40 text-neutral-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-sm font-semibold text-white">Хайлтад тохирох сэлбэг олдсонгүй</p>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Та доорх "Олдохгүй байгаа сэлбэг захиалах" тусгай маягтаар хүсэлтээ илгээнэ үү.
            </p>
            <a 
              href="#source-section" 
              className="inline-block px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs uppercase"
            >
              Үйлдвэрээс захиалах хүсэлт илгээх
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredParts.map((part) => (
              <div 
                key={part.id}
                className="group rounded-2xl bg-[#091B36] border border-sky-900/40 hover:border-amber-400/80 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div>
                  {/* Part Image */}
                  <div className="relative h-48 overflow-hidden bg-[#051329] p-4 flex items-center justify-center">
                    <img 
                      src={part.image} 
                      alt={part.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#091B36]/90 text-[10px] font-mono text-neutral-300 border border-white/10">
                      {part.brand}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {part.inStock ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          Бэлэн ({part.stockCount})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          Захиалгаар
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Part Info */}
                  <div className="p-4">
                    <div className="text-[11px] font-mono text-amber-400 font-semibold mb-1">
                      {part.oemCode}
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-2 mb-2 group-hover:text-amber-300 transition">
                      {part.name}
                    </h3>
                    <div className="text-[11px] text-neutral-400 line-clamp-2 mb-3">
                      {part.description}
                    </div>

                    <div className="text-[10px] text-neutral-500 mb-3 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-amber-400" />
                      <span>{part.deliveryDays}</span>
                    </div>

                    <div className="pt-2 border-t border-sky-900/40 flex items-baseline justify-between">
                      <span className="text-xs text-neutral-500">Үнэ:</span>
                      <span className="text-base font-black text-amber-400 font-mono">
                        {part.price.toLocaleString()} ₮
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDetailPart(part)}
                    className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Үзүүлэлт</span>
                  </button>

                  <button
                    onClick={() => handleAddToCartWithFeedback(part)}
                    className="py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-amber-400/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Сагслах</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* 3. Олдохгүй байгаа сэлбэг захиалах (Custom Sourcing Form) */}
      <section id="source-section" className="py-16 md:py-20 border-t border-sky-900/40 bg-[#091B36]/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 md:p-10 rounded-2xl bg-[#091B36] border border-sky-900/40 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Тусгай Захиалга</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Олдохгүй Байгаа Сэлбэг Захиалах
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Хуучин эсвэл Монголд ховор лифтний сэлбэгийн мэдээллийг илгээвэл бид БНХАУ, Солонгос, Европын үйлдвэрлэгчдээс шууд олж, үнийн санал гаргана.
              </p>
            </div>

            {sourceSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Сэлбэгийн хүсэлт хүлээн авлаа!
                </h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto mb-6">
                  Манай гадаад худалдааны менежер тухайн сэлбэгийн үйлдвэрийн нийлүүлэлт, тээврийн хугацаа болон үнийн тооцоог таны <strong className="text-amber-400">{sourcePhone}</strong> дугаарт 2 цагийн дотор мэдэгдэх болно.
                </p>
                <button
                  onClick={() => setSourceSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
                >
                  Шинэ сэлбэг хайх хүсэлт илгээх
                </button>
              </div>
            ) : (
              <form onSubmit={handleSourceSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Лифтний брэнд / Үйлдвэрлэгч *
                    </label>
                    <select
                      value={sourceBrand}
                      onChange={(e) => setSourceBrand(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
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
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Үйлдвэрлэсэн он (ойролцоогоор)
                    </label>
                    <input 
                      type="text"
                      placeholder="Жишээ: 2012 эсвэл 2005 он"
                      value={sourceYear}
                      onChange={(e) => setSourceYear(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Шаардлагатай сэлбэгийн нэр эсвэл зориулалт *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Жишээ: Хаалганы серво мотор, Редукторын араа, Дэлгэцийн хавтан..."
                    value={sourcePartName}
                    onChange={(e) => setSourcePartName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Холбоо барих утас *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="9911-XXXX"
                      value={sourcePhone}
                      onChange={(e) => setSourcePhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Байгууллагын нэр / СӨХ
                    </label>
                    <input 
                      type="text"
                      placeholder="Жишээ: Шинэ Өргөө СӨХ"
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Сэлбэгийн пайз дээрх кодууд, үзүүлэлтийн тайлбар
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Хэрэв сэлбэгийн пайз (Model/Part No), вольт, ватт бичигдсэн бол энд бичнэ үү..."
                    value={sourceNotes}
                    onChange={(e) => setSourceNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-sky-800/40 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg shadow-amber-400/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Үйлдвэрээс захиалах үнийн санал авах</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* Product Detail Modal */}
      {detailPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#091B36] border border-sky-900/40 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4 border-b border-sky-900/40 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{detailPart.brand} OEM</span>
                <h3 className="text-base font-black">{detailPart.name}</h3>
              </div>
              <button 
                onClick={() => setDetailPart(null)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <img 
              src={detailPart.image} 
              alt={detailPart.name}
              className="w-full h-52 object-contain bg-[#051329] rounded-xl mb-4 p-2"
            />

            <div className="text-xs text-neutral-300 leading-relaxed mb-4">
              {detailPart.description}
            </div>

            {/* Specs Table */}
            <div className="p-3.5 rounded-xl bg-[#051329] border border-sky-900/40 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between border-b border-sky-900/40/80 pb-1">
                <span className="text-neutral-500">OEM Код:</span>
                <span className="font-mono font-bold text-amber-400">{detailPart.oemCode}</span>
              </div>
              {Object.entries(detailPart.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-sky-900/40/80 pb-1">
                  <span className="text-neutral-500">{key}:</span>
                  <span className="font-semibold text-neutral-200">{val}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">Хүргэлт:</span>
                <span className="font-semibold text-emerald-400">{detailPart.deliveryDays}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-neutral-500">Нэгжийн үнэ:</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {detailPart.price.toLocaleString()} ₮
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleAddToCartWithFeedback(detailPart);
                    setDetailPart(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Сагсанд нэмэх</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
