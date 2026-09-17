/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveSection, SparePart, CartItem } from './types';
import { PortalHome } from './components/PortalHome';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DeltaLiftView } from './components/DeltaLiftView';
import { ServiceView } from './components/ServiceView';
import { PartsView } from './components/PartsView';
import { EmergencyModal } from './components/EmergencyModal';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('portal');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Shopping Cart state
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

  const handleSelectSection = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (part: SparePart) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.part.id === part.id);
      if (existing) {
        return prev.map(item =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
    setCartItems(prev =>
      prev.map(item =>
        item.part.id === partId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (partId: string) => {
    setCartItems(prev => prev.filter(item => item.part.id !== partId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      
      {/* 1. Portal View (when activeSection === 'portal') */}
      {activeSection === 'portal' && (
        <PortalHome 
          onSelectSection={handleSelectSection}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />
      )}

      {/* 2. Sub-Site Layouts (when activeSection is delta-lift, service, or parts) */}
      {activeSection !== 'portal' && (
        <div className="flex-1 flex flex-col">
          <Navbar 
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main className="flex-1">
            {activeSection === 'delta-lift' && (
              <DeltaLiftView />
            )}

            {activeSection === 'service' && (
              <ServiceView 
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}

            {activeSection === 'parts' && (
              <PartsView 
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                cartCount={totalCartCount}
              />
            )}
          </main>

          <Footer 
            onSelectSection={handleSelectSection}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        </div>
      )}

      {/* Modals & Overlays */}
      <EmergencyModal 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

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
