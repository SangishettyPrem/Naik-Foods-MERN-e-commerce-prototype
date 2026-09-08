import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';

export const SearchModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ search: query, limit: 6 });
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Popular search terms
  const popularTerms = [
    'Millet Noodles',
    'Goda Masala',
    'Khakhra',
    'Bakarwadi',
    'Mitha Paan',
    'Thecha',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-neutral-200">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-surface-border flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search authentic masalas, millet noodles, snacks, regional specials..."
            className="w-full text-sm sm:text-base font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none bg-transparent"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-[#70BF4F] animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-neutral-100 rounded border border-neutral-300 text-neutral-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-4 bg-surface-muted border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#70BF4F]" /> Trending:
          </span>
          {popularTerms.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:border-[#70BF4F] text-neutral-700 hover:text-[#356323] transition-colors whitespace-nowrap text-xs font-medium"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() !== '' && results.length === 0 && !loading ? (
            <div className="py-12 text-center text-neutral-500 space-y-1">
              <p className="font-bold text-neutral-800 text-sm">No delicacies found for "{query}"</p>
              <p className="text-xs text-neutral-400">Try searching for "Noodles", "Masala", or "Pune"</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  onClose();
                  if (onSelectProduct) onSelectProduct(product);
                }}
                className="p-3 rounded-2xl hover:bg-surface-sage border border-transparent hover:border-[#70BF4F]/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#70BF4F] transition-colors">
                        {product.title}
                      </h4>
                      <span className="text-[10px] font-bold text-[#356323] bg-[#70BF4F]/15 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {product.region}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {product.subtitle || product.highlights?.[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-neutral-900">
                    ₹{product.variants?.[0]?.price || 99}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#70BF4F] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-center text-[11px] text-neutral-400 flex items-center justify-between px-6">
          <span>Search queries index title, ingredients, regions & dietary tags</span>
          <button onClick={onClose} className="hover:text-neutral-800 font-semibold">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
