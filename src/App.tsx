/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
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
import { CartDrawer } from './components/CartDrawer';

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

  // Хуудас солигдох бүрд гарчгийг шинэчилж, дээш нь гүйлгэнэ
  useEffect(() => {
    document.title = ROUTES[activeSection].title;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeSection]);

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

  /** Дэд хуудсуудын нийтлэг хүрээ: Navbar, байршлын мөр, хөл хэсэг */
  const SubPage: React.FC<{
    section: Exclude<ActiveSection, 'portal'>;
    children: React.ReactNode;
  }> = ({ section, children }) => (
    <div className="flex-1 flex flex-col">
      <Navbar
        activeSection={section}
        onSelectSection={handleSelectSection}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Breadcrumb section={section} />

      {/* key нь хуудас солигдох бүрд орох хөдөлгөөнийг дахин ажиллуулна */}
      <main key={section} className="flex-1 animate-page-enter">
        {children}
      </main>

      <Footer
        onSelectSection={handleSelectSection}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      <Routes>
        <Route
          path={ROUTES.portal.path}
          element={
            <PortalHome
              onSelectSection={handleSelectSection}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />
          }
        />

        <Route
          path={ROUTES['delta-lift'].path}
          element={
            <SubPage section="delta-lift">
              <DeltaLiftView />
            </SubPage>
          }
        />

        <Route
          path={ROUTES.parts.path}
          element={
            <SubPage section="parts">
              <PartsView
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                cartCount={totalCartCount}
              />
            </SubPage>
          }
        />

        <Route
          path={ROUTES.service.path}
          element={
            <SubPage section="service">
              <ServiceView onOpenEmergency={() => setIsEmergencyOpen(true)} />
            </SubPage>
          }
        />

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
