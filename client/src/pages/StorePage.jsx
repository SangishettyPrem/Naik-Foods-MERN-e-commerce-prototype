import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  Sparkles,
  MapPin,
  Flame,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';

export const StorePage = ({ onQuickView, selectedRegion, onSelectRegion }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDietary, setSelectedDietary] = useState(searchParams.get('dietary') || 'all');
  const [selectedSpice, setSelectedSpice] = useState(searchParams.get('spice') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL searchParams change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlRegion = searchParams.get('region');
    const urlSearch = searchParams.get('search');

    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlRegion && onSelectRegion) onSelectRegion(urlRegion);
    if (urlSearch !== null) setSearch(urlSearch);
  }, [searchParams, onSelectRegion]);

  // Load Categories on mount
  useEffect(() => {
    productService.getCategories().then((res) => {
      if (res.success) setCategories(res.data || []);
    });
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = {
          search: search.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          region: selectedRegion !== 'all' ? selectedRegion : undefined,
          dietary: selectedDietary !== 'all' ? selectedDietary : undefined,
          spiceLevel: selectedSpice !== 'all' ? selectedSpice : undefined,
          sort: sortBy !== 'featured' ? sortBy : undefined,
        };

        const res = await productService.getProducts(params);
        if (res.success && res.data) {
          setProducts(res.data);
          setTotalCount(res.total || res.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [search, selectedCategory, selectedRegion, selectedDietary, selectedSpice, sortBy]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    if (onSelectRegion) onSelectRegion('all');
    setSelectedDietary('all');
    setSelectedSpice('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedRegion !== 'all' ||
    selectedDietary !== 'all' ||
    selectedSpice !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Store Header Banner */}
      <div className="bg-surface-sage border border-surface-border rounded-3xl p-6 sm:p-10 space-y-3 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-bold text-[#356323]">
            <Sparkles className="w-3.5 h-3.5 text-[#70BF4F]" />
            Authentic Maharashtrian Pantry
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            The Naik Foods Store
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            Hand-pounded Goda masalas, zero-maida millet noodles, roasted crispy khakhras, and mukhvas directly from our Shukrawar Peth store in Pune.
          </p>
        </div>
      </div>

      {/* Main Filter & Products Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white border border-surface-border p-5 rounded-3xl shadow-soft sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#70BF4F]" />
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#70BF4F] hover:text-[#5BA33E] font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search in Store */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Masala, Millet, Khakhra"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Heritage Region Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#70BF4F]" /> Region of Origin
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Maharashtra' },
                { id: 'Pune', label: 'Pune Heritage' },
                { id: 'Vidarbha', label: 'Vidarbha Hand-Pounded' },
                { id: 'Konkan', label: 'Coastal Konkan' },
                { id: 'Western Maharashtra', label: 'Kolhapur & Western Maha' },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => onSelectRegion && onSelectRegion(reg.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                    selectedRegion === reg.id
                      ? 'bg-[#70BF4F]/15 text-[#356323] font-bold border border-[#70BF4F]/30'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Product Category
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-[#70BF4F]/15 text-[#356323] font-bold border border-[#70BF4F]/30'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                    selectedCategory === cat.slug
                      ? 'bg-[#70BF4F]/15 text-[#356323] font-bold border border-[#70BF4F]/30'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Dietary Preference
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'Vegan', label: 'Vegan' },
                { id: 'Jain Friendly', label: 'Jain Friendly' },
                { id: 'Millet-Based', label: 'Millet-Rich' },
                { id: 'Zero Maida', label: 'Zero Maida' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDietary(d.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    selectedDietary === d.id
                      ? 'border-[#70BF4F] bg-[#70BF4F] text-white font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Spice Level
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Any Spice' },
                { id: 'Mild', label: 'Mild' },
                { id: 'Medium', label: 'Medium' },
                { id: 'Spicy', label: 'Spicy / Teekha' },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpice(sp.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs text-center transition-all ${
                    selectedSpice === sp.id
                      ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Bar: Results Count & Sort Dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span className="font-bold text-neutral-900 text-sm">
                {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
              </span>
              {selectedRegion !== 'all' && (
                <span className="bg-[#70BF4F]/15 text-[#356323] px-2.5 py-0.5 rounded-full font-semibold">
                  {selectedRegion}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full font-semibold">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 flex items-center gap-1.5 bg-surface-muted"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-800 text-xs font-semibold focus:outline-none focus:border-[#70BF4F] bg-white cursor-pointer"
                >
                  <option value="featured">Featured / Bestsellers</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Additions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-400 font-semibold text-[11px]">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800">
                  Search: "{search}"
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedRegion !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#70BF4F]/15 text-[#356323]">
                  Region: {selectedRegion}
                  <button onClick={() => onSelectRegion && onSelectRegion('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800">
                  Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedDietary !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800">
                  Dietary: {selectedDietary}
                  <button onClick={() => setSelectedDietary('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSpice !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-900">
                  Spice: {selectedSpice}
                  <button onClick={() => setSelectedSpice('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-neutral-500 hover:text-red-500 text-xs font-semibold ml-1 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid or Skeletons or Empty State */}
          {loading ? (
            /* Skeleton Loaders (fast visual skeleton, NOT a blocking page spinner) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-surface-border p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-neutral-200 rounded-xl" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-8 bg-neutral-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-surface-border p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-sage mx-auto flex items-center justify-center text-neutral-400">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">No matching delicacies found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                  Try clearing some filter criteria or selecting another region to explore our complete Maharashtrian catalog.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#70BF4F] text-white text-xs font-bold hover:bg-[#5BA33E] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Product Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
