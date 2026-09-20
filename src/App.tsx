/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ActiveSection, CartItem, SparePart } from './types';
import { ROUTES, sectionFromPath } from './routes';
import { PortalHome } from './components/PortalHome';
import { Navbar } from './components/Navbar';
import { Breadcrumb } from './components/Breadcrumb';
import { Footer } from './components/Footer';
import { DeltaLiftView } from './components/DeltaLiftView';
import { ServiceView } from './components/ServiceView';
import { PartsView } from './components/PartsView';
import { EmergencyModal } from './components/EmergencyModal';

/**
 * Удирдлагын хэсгийг тусад нь ачаална. Сайтад зочлогчид админы код
 * болон газрын зургийн сангийн жинг татахгүй.
 */
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminSubmissions = lazy(() => import('./components/admin/AdminSubmissions'));
const AdminMap = lazy(() => import('./components/admin/AdminMap'));
const AdminElevators = lazy(() => import('./components/admin/AdminElevators'));
const AdminProducts = lazy(() => import('./components/admin/AdminProducts'));
import { CartDrawer } from './components/CartDrawer';
import { ProductPage } from './components/ProductPage';


/** Дэд хуудсуудын нийтлэг хүрээ: Navbar, байршлын мөр, хөл хэсэг */
const PageShell: React.FC<{
  section: Exclude<ActiveSection, 'portal'>;
  /** Байршлын мөрөнд нэмэх дэд алхам — жишээ нь барааны нэр */
  trail?: string;
  onSelectSection: (section: ActiveSection) => void;
  onOpenCart: () => void;
  cartCount: number;
  children: React.ReactNode;
}> = ({ section, trail, onSelectSection, onOpenCart, cartCount, children }) => (
  <div className="flex-1 flex flex-col">
    <Navbar
      activeSection={section}
      onSelectSection={onSelectSection}
      cartCount={cartCount}
      onOpenCart={onOpenCart}
    />

    <Breadcrumb section={section} trail={trail} />

    {/* key нь хуудас солигдох бүрд орох хөдөлгөөнийг дахин ажиллуулна */}
    <main key={section} className="flex-1 animate-page-enter">
      {children}
    </main>

    <Footer onSelectSection={onSelectSection} />
  </div>
);


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = sectionFromPath(location.pathname);

  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lift_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lift_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Cart sync error:', e);
    }
  }, [cartItems]);

  const isAdmin = location.pathname.startsWith('/admin');

  // Хуудас солигдох бүрд гарчгийг шинэчилж, дээш нь гүйлгэнэ
  useEffect(() => {
    document.title = isAdmin
      ? 'Удирдлагын хэсэг | LIFT.MN'
      : ROUTES[activeSection].title;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeSection, isAdmin, location.pathname]);

  const handleSelectSection = (section: ActiveSection) => {
    navigate(ROUTES[section].path);
  };

  const handleAddToCart = (part: SparePart) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { part, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(partId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.part.id === partId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (partId: string) => {
    setCartItems((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const handleClearCart = () => setCartItems([]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  /** Байршлын мөрөнд харуулах дэд алхам — барааны хуудас өөрөө бөглөнө */
  const [trail, setTrail] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      <Routes>
        <Route
          path={ROUTES.portal.path}
          element={
            <PortalHome
              onSelectSection={handleSelectSection}
            />
          }
        />

        <Route
          path={ROUTES['delta-lift'].path}
          element={
            <PageShell
              section="delta-lift"
              onSelectSection={handleSelectSection}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            >
              <DeltaLiftView />
            </PageShell>
          }
        />

        <Route
          path={ROUTES.parts.path}
          element={
            <PageShell
              section="parts"
              onSelectSection={handleSelectSection}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            >
              <PartsView
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
              />
            </PageShell>
          }
        />

        {/* Барааны дэлгэрэнгүй — өөрийн хаягтай бүтэн хуудас */}
        <Route
          path={`${ROUTES.parts.path}/:productId`}
          element={
            <PageShell
              section="parts"
              trail={trail}
              onSelectSection={handleSelectSection}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            >
              <ProductPage onAddToCart={handleAddToCart} onTitle={setTrail} />
            </PageShell>
          }
        />

        <Route
          path={ROUTES.service.path}
          element={
            <PageShell
              section="service"
              onSelectSection={handleSelectSection}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            >
              <ServiceView onOpenEmergency={() => setIsEmergencyOpen(true)} />
            </PageShell>
          }
        />

        {/* Удирдлагын хэсэг — өөрийн бүрхүүлтэй, нийтийн цэс, хөл хэсэггүй */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="p-10 text-sm text-neutral-400">Ачаалж байна…</div>}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="map" element={<AdminMap />} />
          <Route path="elevators" element={<AdminElevators />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Танихгүй зам — портал руу буцаана */}
        <Route path="*" element={<Navigate to={ROUTES.portal.path} replace />} />
      </Routes>

      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
