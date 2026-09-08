import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  MapPin,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Check,
  Phone,
  Store,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

export const Header = ({ onOpenSearch, selectedRegion, onSelectRegion }) => {
  const { cart, openCart } = useCart();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const regionDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(event.target)
      ) {
        setRegionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const regions = [
    { id: "all", name: "All Maharashtra", badge: "All Hubs" },
    { id: "Pune", name: "Pune Heritage", badge: "24-48 hrs" },
    { id: "Vidarbha", name: "Vidarbha Spices", badge: "2-3 Days" },
    { id: "Konkan", name: "Konkan Coastal", badge: "2-3 Days" },
    { id: "Western Maharashtra", name: "Western Maha", badge: "2-3 Days" },
  ];

  // Parse active query param
  const queryParams = new URLSearchParams(location.search);
  const activeCategory = queryParams.get("category");
  const isHomePage = location.pathname === "/";
  const isAllStore = location.pathname === "/store" && !activeCategory;

  const currentRegionObj =
    regions.find((r) => r.id === selectedRegion) || regions[0];

  const categoriesNav = [
    {
      name: "All Products",
      to: "/store",
      isActive: isAllStore,
    },
    {
      name: "Spices & Masalas",
      to: "/store?category=spices-and-masalas",
      isActive: location.pathname === "/store" && activeCategory === "spices-and-masalas",
    },
    {
      name: "Snacks & Namkeen",
      to: "/store?category=snacks-and-namkeen",
      isActive: location.pathname === "/store" && activeCategory === "snacks-and-namkeen",
    },
    {
      name: "Millet & Staples",
      to: "/store?category=dry-instant-grocery",
      isActive: location.pathname === "/store" && activeCategory === "dry-instant-grocery",
    },
    {
      name: "Pickles & Chutneys",
      to: "/store?category=pickles-and-condiments",
      isActive: location.pathname === "/store" && activeCategory === "pickles-and-condiments",
    },
    {
      name: "Sweets & Festive",
      to: "/store?category=sweets-and-bakery",
      isActive: location.pathname === "/store" && activeCategory === "sweets-and-bakery",
    },
  ];

  return (
    <>
      {/* 1. Top Announcement Utility Bar */}
      <div className="bg-[#161915] text-[#FAFAF8] text-xs font-medium py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#70BF4F] text-white tracking-wide uppercase shadow-2xs">
              Authentic Maharashtrian
            </span>
            <span className="text-neutral-300">
              Use coupon <strong className="text-[#70BF4F]">NAIK10</strong> for 10% OFF | Free delivery over ₹999
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-neutral-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#70BF4F]" />
              Heritage Store: Shukrawar Peth, Pune
            </span>
            <span>•</span>
            <a
              href="tel:+919730046247"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#70BF4F]" />
              +91 9730046247
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Action Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-border shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#70BF4F] to-[#46832E] flex items-center justify-center text-white shadow-brand">
                  <span className="text-xl font-black">N</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tracking-tight text-[#161915]">
                      Naik<span className="text-[#70BF4F]">Foods</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#70BF4F]/10 text-[#70BF4F] border border-[#70BF4F]/20 uppercase tracking-wider">
                      Heritage
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                    Pure Maharashtrian Flavors
                  </span>
                </div>
              </Link>
            </div>

            {/* Central Search Bar Trigger */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-neutral-100/90 hover:bg-neutral-100 text-neutral-500 text-xs font-medium border border-neutral-200/80 transition-all hover:border-[#70BF4F]/40 shadow-2xs group"
                aria-label="Search catalog"
              >
                <div className="flex items-center gap-2.5 text-neutral-500 group-hover:text-neutral-800">
                  <Search className="w-4 h-4 text-neutral-400 group-hover:text-[#70BF4F] transition-colors" />
                  <span className="truncate">Search masalas, noodles, bakarwadi...</span>
                </div>
                <kbd className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono bg-white rounded border border-neutral-300 text-neutral-400 shadow-2xs">
                  /
                </kbd>
              </button>
            </div>

            {/* Right Action Utilities */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Mobile Search Button (Visible on Small Screens) */}
              <button
                onClick={onOpenSearch}
                className="md:hidden p-2.5 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Region Selector Dropdown (Desktop & Tablet) */}
              <div className="relative" ref={regionDropdownRef}>
                <button
                  type="button"
                  onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-sage border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-all"
                  aria-expanded={regionDropdownOpen}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#70BF4F]" />
                  <span className="text-neutral-500 font-normal">Region:</span>
                  <span className="text-neutral-900 font-bold max-w-[100px] truncate">
                    {currentRegionObj.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                      regionDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {regionDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-slide-up">
                    <div className="px-3.5 py-2 border-b border-neutral-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Select Delivery Region
                      </p>
                    </div>
                    <div className="p-1">
                      {regions.map((reg) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => {
                            onSelectRegion && onSelectRegion(reg.id);
                            setRegionDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-colors ${
                            selectedRegion === reg.id
                              ? "bg-[#70BF4F]/10 text-[#70BF4F] font-bold"
                              : "text-neutral-700 hover:bg-neutral-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {selectedRegion === reg.id ? (
                              <Check className="w-3.5 h-3.5 text-[#70BF4F]" />
                            ) : (
                              <div className="w-3.5 h-3.5" />
                            )}
                            <span>{reg.name}</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-normal">
                            {reg.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#161915] text-white hover:bg-[#70BF4F] transition-all duration-300 shadow-md hover:shadow-lg group active:scale-95"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold tracking-wide">
                  ₹{cart.totalAmount || 0}
                </span>
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#70BF4F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-fade-in shadow-xs">
                    {cart.itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-neutral-900" />
                ) : (
                  <Menu className="w-6 h-6 text-neutral-900" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Dedicated Category Navigation Strip (Visible on Desktop & Tablet) */}
        <div className="hidden lg:block bg-neutral-50/80 border-t border-neutral-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between gap-1 overflow-x-auto py-2 no-scrollbar">
              <div className="flex items-center gap-1.5 flex-nowrap">
                {/* Home Link */}
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isHomePage
                      ? "bg-[#70BF4F] text-white shadow-2xs"
                      : "text-neutral-700 hover:text-neutral-900 hover:bg-white"
                  }`}
                >
                  Home
                </Link>

                {/* Category Links with active tracking */}
                {categoriesNav.map((cat) => (
                  <Link
                    key={cat.to}
                    to={cat.to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      cat.isActive
                        ? "bg-[#70BF4F] text-white shadow-2xs"
                        : "text-neutral-700 hover:text-neutral-900 hover:bg-white"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Right Special Highlight: Regional Specials */}
              <div className="flex items-center gap-2 pl-4 border-l border-neutral-200">
                <Link
                  to="/store?region=Pune"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#70BF4F]/10 text-[#46832E] hover:bg-[#70BF4F]/20 transition-all border border-[#70BF4F]/20"
                >
                  <Sparkles className="w-3 h-3 text-[#70BF4F]" />
                  <span>Pune Heritage Bestsellers</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* 4. Mobile Drawer Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-surface-border px-4 py-4 space-y-4 animate-slide-up shadow-xl max-h-[85vh] overflow-y-auto">
            {/* Mobile Search input */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-500 text-xs font-medium border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <span>Search masalas, noodles, snacks...</span>
                </div>
                <span className="text-[10px] text-neutral-400">Tap to search</span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-1">
                Store Navigation
              </p>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isHomePage
                    ? "bg-[#70BF4F]/10 text-[#70BF4F] font-bold"
                    : "text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <span>Home</span>
              </Link>
              {categoriesNav.map((cat) => (
                <Link
                  key={cat.to}
                  to={cat.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    cat.isActive
                      ? "bg-[#70BF4F]/10 text-[#70BF4F] font-bold"
                      : "text-neutral-800 hover:bg-neutral-50"
                  }`}
                >
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Regional Provenance Selector */}
            <div className="pt-3 border-t border-neutral-100">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                Filter Catalog by Region:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      onSelectRegion && onSelectRegion(reg.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-xl text-left border transition-all ${
                      selectedRegion === reg.id
                        ? "bg-[#70BF4F]/10 border-[#70BF4F] text-[#46832E]"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="text-xs font-bold">{reg.name}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">
                      {reg.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Store Information */}
            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-[#70BF4F]" />
                <span>Naik Foods, Shukrawar Peth, Pune</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#70BF4F]" />
                <span>+91 9730046247 (Mon-Sat 10am - 8pm)</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
