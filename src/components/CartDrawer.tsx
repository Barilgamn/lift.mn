import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (partId: string, quantity: number) => void;
  onRemoveItem: (partId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [clientType, setClientType] = useState<'company' | 'person'>('company');
  const [companyName, setCompanyName] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'invoice' | 'qpay' | 'cash'>('invoice');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.part.price * item.quantity, 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !deliveryAddress) {
      alert('Утас болон хүргэлтийн хаягаа заавал оруулна уу!');
      return;
    }
    const newOrderNo = `LIFT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderNo);
    setStep('success');
    onClearCart();
  };

  const handleFinish = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="cart-drawer-panel"
        className="relative w-full max-w-md bg-surface-2 border-l border-line text-white h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between bg-surface-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-accent-ink" />
            <h2 className="text-base font-bold tracking-tight">
              {step === 'cart' && `Таны Сэлбэгийн Сагс (${cartItems.length})`}
              {step === 'checkout' && 'Захиалга Баталгаажуулах'}
              {step === 'success' && 'Захиалга Баталгаажлаа'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-3 hover:bg-neutral-700 text-ink-muted hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-ink-muted">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-accent-ink" />
                  <p className="text-sm font-medium">Таны сагс хоосон байна</p>
                  <p className="text-xs text-ink-subtle mt-1">
                    Сэлбэг хэрэгслийн каталогоос өөрт хэрэгтэй эд ангийг сонгон сагсанд нэмнэ үү.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.part.id}
                      className="p-3.5 rounded-xl bg-surface-3/60 border border-neutral-700/80 flex gap-3 items-center"
                    >
                      <img 
                        src={item.part.image} 
                        alt={item.part.name}
                        className="w-16 h-16 rounded-lg object-cover bg-surface-0 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {item.part.name}
                        </div>
                        <div className="text-[11px] text-accent-ink font-mono">
                          Код: {item.part.oemCode}
                        </div>
                        <div className="text-xs font-bold text-neutral-200 mt-1">
                          {item.part.price.toLocaleString()} ₮
                        </div>

                        {/* Quantity selector */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center rounded-lg bg-surface-2 border border-neutral-700 text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.part.id, item.quantity - 1)}
                              className="px-2 py-1 text-ink-muted hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 font-mono font-bold text-accent-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.part.id, item.quantity + 1)}
                              className="px-2 py-1 text-ink-muted hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button 
                            onClick={() => onRemoveItem(item.part.id)}
                            className="p-1 text-ink-subtle hover:text-danger-soft transition ml-auto cursor-pointer"
                            title="Устгах"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Захиалагчийн төрөл
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClientType('company')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer ${
                      clientType === 'company' 
                        ? 'bg-accent/20 border-accent text-warn' 
                        : 'bg-surface-3 border-neutral-700 text-ink-muted'
                    }`}
                  >
                    Байгууллага / СӨХ
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('person')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer ${
                      clientType === 'person' 
                        ? 'bg-accent/20 border-accent text-warn' 
                        : 'bg-surface-3 border-neutral-700 text-ink-muted'
                    }`}
                  >
                    Хувь хүн
                  </button>
                </div>
              </div>

              {clientType === 'company' && (
                <>
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Байгууллагын нэр *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Жишээ: Жигүүр Гранд СӨХ ХХК"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-ink-muted mb-1">
                      Регистрийн дугаар (НӨАТ-ын баримт олгоно) *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Жишээ: 1234567"
                      value={registerNo}
                      onChange={(e) => setRegisterNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white font-mono focus:border-accent focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Холбоо барих утас *
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="9911-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white font-mono focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Хүргэлтийн хаяг (Улаанбаатар хот дотор) *
                </label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Дүүрэг, хороо, байрны дугаар, орц, давхар..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-neutral-700 text-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Төлбөрийн хэлбэр
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-3 border border-neutral-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'invoice'} 
                      onChange={() => setPaymentMethod('invoice')}
                      className="text-accent-ink focus:ring-amber-400"
                    />
                    <FileText className="w-4 h-4 text-accent-ink" />
                    <span>Байгууллагын нэхэмжлэх илгээх (Банкаар шилжүүлэх)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-3 border border-neutral-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'qpay'} 
                      onChange={() => setPaymentMethod('qpay')}
                      className="text-accent-ink focus:ring-amber-400"
                    />
                    <CreditCard className="w-4 h-4 text-accent-ink" />
                    <span>QPay / Бүх банкны апп-аар шууд уншуулах</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-3 border border-neutral-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cash'} 
                      onChange={() => setPaymentMethod('cash')}
                      className="text-accent-ink focus:ring-amber-400"
                    />
                    <span>Хүргэлтийн ажилтанд бэлнээр төлөх</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <span>Захиалга баталгаажуулах ({total.toLocaleString()} ₮)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-success border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-accent-ink">
                  {orderNumber}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Захиалга амжилттай бүртгэгдлээ!
                </h3>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed max-w-sm mx-auto">
                Таны захиалгыг манай сэлбэгийн менежер хүлээн авлаа. Таны <strong className="text-accent-ink">{phone}</strong> дугаар луу нэхэмжлэх болон хүргэлтийн товч мэдээллийг 15 минутын дотор илгээх болно.
              </p>

              <div className="p-3.5 rounded-xl bg-surface-3 border border-neutral-700 text-left text-xs space-y-1 text-ink-muted">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Захиалгын дугаар:</span>
                  <span className="font-mono font-bold text-white">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Төлбөрийн хэлбэр:</span>
                  <span className="text-accent-ink font-semibold">{paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Нийт дүн (НӨАТ орсон):</span>
                  <span className="font-bold text-success">{total.toLocaleString()} ₮</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl bg-accent hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Хаах & Каталог руу буцах
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer (Subtotal & Proceed button) */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-line bg-surface-0 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Барааны дүн:</span>
                <span className="font-mono">{subtotal.toLocaleString()} ₮</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>НӨАТ (10%):</span>
                <span className="font-mono">{vat.toLocaleString()} ₮</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-line">
                <span>Нийт төлөх:</span>
                <span className="text-accent-ink font-mono text-base">{total.toLocaleString()} ₮</span>
              </div>
            </div>

            <button
              onClick={() => setStep('checkout')}
              className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-amber-300 text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <span>Худалдан авах / Захиалах</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
