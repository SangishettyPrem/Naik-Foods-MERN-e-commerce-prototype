import React, { useState } from 'react';
import {
  X,
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
  Sparkles,
  Send,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { pincodeService } from '../../services/pincodeService';
import { productService } from '../../services/productService';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Pincode checker state
  const [pincodeInput, setPincodeInput] = useState('411002');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);

  if (!isOpen || !product) return null;

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];
  const variants = product.variants?.length > 0 ? product.variants : [
    { variantId: 'default', weight: 'Standard', price: 99, inStock: true },
  ];
  const selectedVariant = variants[selectedVariantIndex] || variants[0];

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product._id, selectedVariant.variantId, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleCheckPincode = async (e) => {
    e?.preventDefault();
    if (!pincodeInput || !/^\d{6}$/.test(pincodeInput)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeError('');
    setCheckingPincode(true);
    try {
      const res = await pincodeService.checkPincode(pincodeInput);
      if (res.success && res.data) {
        setPincodeResult(res.data);
      }
    } catch (err) {
      setPincodeError(err.message || 'Service check failed');
    } finally {
      setCheckingPincode(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      addToast('Please fill name and review comment', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await productService.addReview(product._id, {
        reviewerName,
        rating: reviewRating,
        comment: reviewComment,
      });
      if (res.success && res.data) {
        setReviewsList(res.data.reviews);
        addToast('Review submitted successfully!', 'success');
        setShowReviewForm(false);
        setReviewerName('');
        setReviewComment('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Product Images Gallery */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200 relative">
                <img
                  src={images[selectedImageIndex] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.isBestseller && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-[#161915] text-white tracking-wide uppercase">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#70BF4F] ring-2 ring-[#70BF4F]/20'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Heritage Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-surface-sage border border-neutral-200/80 rounded-xl p-3 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#70BF4F] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-neutral-800">100% Traditional</p>
                    <p className="text-neutral-500">Hand-pounded recipe</p>
                  </div>
                </div>
                <div className="bg-surface-sage border border-neutral-200/80 rounded-xl p-3 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#70BF4F] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-neutral-800">Shelf Life</p>
                    <p className="text-neutral-500">{product.shelfLife || '6 Months'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                {/* Region & Dietary Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#70BF4F]/15 text-[#356323] border border-[#70BF4F]/30">
                    <MapPin className="w-3 h-3" />
                    {product.region} Heritage
                  </span>
                  {product.dietary?.map((diet) => (
                    <span
                      key={diet}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200"
                    >
                      {diet}
                    </span>
                  ))}
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  By {product.vendor || 'Naik Foods Heritage'}
                </p>

                {/* Star Rating summary */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current text-amber-400 mr-1" />
                    <span>{product.rating || 4.9}</span>
                  </div>
                  <span className="text-neutral-300">•</span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {reviewsList.length} verified ratings
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-black font-mono text-neutral-900">
                    ₹{selectedVariant.price}
                  </span>
                  {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                    <>
                      <span className="text-base font-mono line-through text-neutral-400">
                        ₹{selectedVariant.originalPrice}
                      </span>
                      <span className="text-xs font-bold text-[#356323] bg-emerald-50 px-2 py-0.5 rounded-full">
                        Save ₹{selectedVariant.originalPrice - selectedVariant.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">Inclusive of all local taxes</p>

                {/* Pack Size Variant Switcher */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                    Select Pack Size:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {variants.map((v, idx) => (
                      <button
                        key={v.variantId}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedVariantIndex === idx
                            ? 'border-[#70BF4F] bg-[#70BF4F]/10 ring-1 ring-[#70BF4F]'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-900">{v.weight}</p>
                        <p className="text-xs font-mono font-semibold text-neutral-600">₹{v.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Indian Pincode Delivery Checker */}
                <div className="mt-5 p-4 rounded-2xl bg-surface-muted border border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#70BF4F]" /> Check Delivery & COD
                    </span>
                    <span className="text-[11px] font-normal text-neutral-400">
                      Standard: ₹79 (Free above ₹999)
                    </span>
                  </div>

                  <form onSubmit={handleCheckPincode} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode"
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F]"
                    />
                    <button
                      type="submit"
                      disabled={checkingPincode}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-[#70BF4F] text-white transition-colors"
                    >
                      {checkingPincode ? 'Checking...' : 'Check'}
                    </button>
                  </form>

                  {pincodeError && (
                    <p className="text-[11px] text-red-500 font-medium">{pincodeError}</p>
                  )}

                  {pincodeResult && (
                    <div className="text-xs space-y-1 pt-1 animate-fade-in text-neutral-700">
                      <p className="font-semibold text-[#356323] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-[#70BF4F]" />
                        Delivering to {pincodeResult.city} ({pincodeResult.pincode})
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Estimated ETA: <strong className="text-neutral-800">{pincodeResult.estimatedDays}</strong> via {pincodeResult.deliveryPartner}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description & Highlights */}
                <div className="mt-5 space-y-3">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                  {product.highlights?.length > 0 && (
                    <ul className="space-y-1 text-xs text-neutral-700">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#70BF4F] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart action */}
              <div className="pt-4 border-t border-neutral-100 flex items-center gap-4">
                <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono font-bold text-sm text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all ${
                    isAdding
                      ? 'bg-[#70BF4F] text-white scale-98'
                      : 'bg-[#161915] text-white hover:bg-[#70BF4F]'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Basket • ₹{selectedVariant.price * quantity}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Accordion / Tabs: Ingredients & Customer Reviews */}
          <div className="mt-10 pt-8 border-t border-neutral-200 space-y-8">
            {/* Ingredients Section */}
            {product.ingredients?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Ingredients Transparency
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Customer Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Verified Customer Reviews ({reviewsList.length})
                  </h3>
                  <p className="text-xs text-neutral-500">Authentic feedback from real buyers</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#70BF4F] text-[#356323] hover:bg-[#70BF4F] hover:text-white transition-all"
                >
                  {showReviewForm ? 'Cancel Review' : '+ Write a Review'}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-surface-sage border border-[#70BF4F]/30 rounded-2xl p-5 mb-6 space-y-4 animate-slide-up"
                >
                  <h4 className="text-sm font-bold text-neutral-900">Leave Your Experience</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Sangeeta K."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 block mb-1">
                        Rating *
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating ? 'fill-current' : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1">
                      Review Comment *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="How did you like the flavor, texture, or authenticity?"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 rounded-xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">
                    Be the first verified customer to review this regional specialty!
                  </p>
                ) : (
                  reviewsList.map((rev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-900">
                            {rev.reviewerName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      {rev.title && (
                        <p className="text-xs font-bold text-neutral-800">{rev.title}</p>
                      )}
                      <p className="text-xs text-neutral-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
