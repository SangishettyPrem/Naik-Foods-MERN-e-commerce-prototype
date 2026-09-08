import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Flame, MapPin, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, updating } = useCart();

  // Selected variant state on the card (defaults to first variant)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = product.variants?.[selectedVariantIndex] || {
    variantId: 'default',
    weight: product.weight || 'Standard',
    price: 99,
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product._id, selectedVariant.variantId, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  // Region badge color mapping
  const regionBadges = {
    Pune: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Vidarbha: 'bg-amber-100 text-amber-900 border-amber-200',
    Konkan: 'bg-sky-100 text-sky-800 border-sky-200',
    'Western Maharashtra': 'bg-orange-100 text-orange-900 border-orange-200',
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group bg-white rounded-2xl border border-surface-border overflow-hidden hover:shadow-lift hover:border-[#70BF4F]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Card Top: Badges & Thumbnail */}
      <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden">
        {/* Region Provenance Tag */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
              regionBadges[product.region] || 'bg-neutral-100 text-neutral-800 border-neutral-200'
            }`}
          >
            <MapPin className="w-2.5 h-2.5" />
            {product.region}
          </span>

          {product.isBestseller && (
            <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#161915] text-white tracking-wide uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickView) onQuickView(product);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md text-neutral-700 hover:text-[#70BF4F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Quick View Product"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <img
          src={product.thumbnail || 'https://res.cloudinary.com/dskzfipt3/image/upload/v1775205758/SVG_1_y89cdr.svg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Spice Level Chip (if applicable) */}
        {product.spiceLevel && product.spiceLevel !== 'None' && (
          <div className="absolute bottom-2.5 left-3 z-10 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>{product.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400 mr-0.5" />
              <span>{product.rating || '4.9'}</span>
            </div>
            <span>•</span>
            <span className="text-[11px] text-neutral-400">
              ({product.reviewCount || 18} reviews)
            </span>
            {product.dietary?.[0] && (
              <>
                <span>•</span>
                <span className="text-[10px] font-bold text-[#356323] bg-[#70BF4F]/10 px-1.5 py-0.5 rounded">
                  {product.dietary[0]}
                </span>
              </>
            )}
          </div>

          {/* Title and Subtitle */}
          <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#70BF4F] transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.subtitle || product.highlights?.[0]}
          </p>
        </div>

        {/* In-Card Pack Size / Variant Selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="pt-2 border-t border-neutral-100" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Select Pack Size:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant, idx) => (
                <button
                  key={variant.variantId}
                  type="button"
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    selectedVariantIndex === idx
                      ? 'border-[#70BF4F] bg-[#70BF4F]/10 text-[#356323] font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {variant.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card Bottom: Price & Quick Add Button */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black font-mono text-neutral-900">
                ₹{selectedVariant.price}
              </span>
              {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-xs font-mono line-through text-neutral-400">
                  ₹{selectedVariant.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400 block">
              Pack of {selectedVariant.weight}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || updating}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm ${
              isAdding
                ? 'bg-[#70BF4F] text-white scale-95'
                : 'bg-[#161915] text-white hover:bg-[#70BF4F] hover:shadow-brand active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
