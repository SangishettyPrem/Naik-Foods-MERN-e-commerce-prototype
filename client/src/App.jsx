import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { SearchModal } from './components/product/SearchModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { MessageCircle } from 'lucide-react';

export function App() {
  const navigate = useNavigate();

  // Active quick view product modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Global selected region state (synced with header & store)
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !isSearchOpen && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setQuickViewProduct(null);
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleSelectRegion = (regionId) => {
    setSelectedRegion(regionId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#161915]">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onQuickView={(p) => setQuickViewProduct(p)}
                selectedRegion={selectedRegion}
                onSelectRegion={handleSelectRegion}
              />
            }
          />
          <Route
            path="/store"
            element={
              <StorePage
                onQuickView={(p) => setQuickViewProduct(p)}
                selectedRegion={selectedRegion}
                onSelectRegion={handleSelectRegion}
              />
            }
          />
          <Route
            path="/products/:slug"
            element={<ProductDetailPage onQuickView={(p) => setQuickViewProduct(p)} />}
          />
          <Route
            path="*"
            element={
              <StorePage
                onQuickView={(p) => setQuickViewProduct(p)}
                selectedRegion={selectedRegion}
                onSelectRegion={handleSelectRegion}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Express Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Floating WhatsApp Support Button (matching authentic Naik Foods) */}
      <a
        href="https://wa.me/919730046247?text=Hello%20Naik%20Foods!%20I%20have%20an%20inquiry%20regarding%20my%20order."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">WhatsApp Support</span>
      </a>
    </div>
  );
}
export default App;
