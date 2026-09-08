import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  Check,
  MapPin,
  Flame,
  Truck,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { productService } from "../services/productService";
import { pincodeService } from "../services/pincodeService";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ProductCard } from "../components/product/ProductCard";

export const ProductDetailPage = ({ onQuickView }) => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Pincode checker state
  const [pincodeInput, setPincodeInput] = useState("411002");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProduct(slug);
        if (res.success && res.data) {
          setProduct(res.data);
          setRelatedProducts(res.relatedProducts || []);
          setSelectedVariantIndex(0);
          setSelectedImageIndex(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-neutral-100 rounded w-96 mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link to="/store" className="text-sm font-bold text-[#70BF4F]">
          ← Back to Store
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIndex] || {
    price: 99,
    weight: "Standard",
  };
  const images =
    product.images?.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product._id, selectedVariant.variantId, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleCheckPincode = async (e) => {
    e?.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) return;
    setCheckingPincode(true);
    try {
      const res = await pincodeService.checkPincode(pincodeInput);
      if (res.success) setPincodeResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingPincode(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/" className="hover:text-neutral-900">
          Home
        </Link>
        <span>/</span>
        <Link to="/store" className="hover:text-neutral-900">
          Store
        </Link>
        <span>/</span>
        <Link
          to={`/store?category=${product.categorySlug}`}
          className="hover:text-neutral-900"
        >
          {product.category?.name || product.categorySlug}
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-bold truncate max-w-xs">
          {product.title}
        </span>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Images Column */}
        <div className="md:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-neutral-200">
            <img
              src={images[selectedImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${
                    selectedImageIndex === idx
                      ? "border-[#70BF4F]"
                      : "border-neutral-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#70BF4F]/15 text-[#356323]">
              <MapPin className="w-3 h-3" /> {product.region} Heritage
            </span>
            <h1 className="text-3xl font-black text-neutral-900">
              {product.title}
            </h1>
            <p className="text-sm text-neutral-500">{product.subtitle}</p>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-bold text-neutral-900 text-sm">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-neutral-400">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-mono font-black text-neutral-900">
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.originalPrice && (
              <span className="text-base font-mono line-through text-neutral-400">
                ₹{selectedVariant.originalPrice}
              </span>
            )}
          </div>

          {/* Variants */}
          {variants.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-neutral-500">
                Pack Weight:
              </span>
              <div className="flex gap-2">
                {variants.map((v, i) => (
                  <button
                    key={v.variantId}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                      selectedVariantIndex === i
                        ? "border-[#70BF4F] bg-[#70BF4F]/15 text-[#356323]"
                        : "border-neutral-200 text-neutral-700"
                    }`}
                  >
                    {v.weight} • ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Pincode Estimator */}
          <div className="p-4 rounded-2xl bg-surface-muted border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
              <Truck className="w-4 h-4 text-[#70BF4F]" />
              <span>Check Delivery ETA</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                placeholder="Pincode"
                className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Check
              </button>
            </form>
            {pincodeResult && (
              <p className="text-xs text-[#356323] font-semibold">
                ✓ Available in {pincodeResult.city}:{" "}
                {pincodeResult.estimatedDays}
              </p>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex items-center border rounded-xl p-1 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 font-mono font-bold text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 py-3.5 px-6 rounded-xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{selectedVariant.price * quantity}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-neutral-200">
          <h3 className="text-2xl font-black text-neutral-900">
            Frequently Paired Together
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
