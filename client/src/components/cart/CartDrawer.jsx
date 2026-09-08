import React, { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { FreeShippingProgress } from "./FreeShippingProgress";

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    addToCart,
    updating,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    setCouponError("");
    const res = await applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  // 1-Click Quick Add Recommended Treats
  const quickAddItems = [
    {
      productId: "quick_mukhwas",
      title: "Shahi Mukhwas",
      weight: "100g",
      price: 100,
      image:
        "https://res.cloudinary.com/dskzfipt3/image/upload/v1781327582/medusa/1781327580352-pomelli_photoshoot_image_1_1_0612%20%2819%29.png.jpg",
      variantId: "v-sm-100g",
    },
    {
      productId: "quick_paan",
      title: "Aaswad Mitha Paan",
      weight: "100g",
      price: 110,
      image:
        "https://res.cloudinary.com/dskzfipt3/image/upload/v1781328014/medusa/1781328012514-pomelli_photoshoot_image_1_1_0612%20%2815%29.png.jpg",
      variantId: "v-amp-100g",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-up">
          {/* Header */}
          <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-muted">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#70BF4F]/15 flex items-center justify-center text-[#70BF4F]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Your Basket
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}{" "}
                  selected
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Free Delivery Meter */}
            {cart.items.length > 0 && <FreeShippingProgress cart={cart} />}

            {/* Empty State */}
            {cart.items.length === 0 ? (
              <div className="py-16 flex flex-col items-center text-center px-4">
                <div className="w-20 h-20 rounded-full bg-surface-sage flex items-center justify-center text-neutral-400 mb-4 border border-neutral-200">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-neutral-500 max-w-xs mb-6">
                  Add authentic Maharashtrian masalas, roasted khakhras, or
                  millet noodles to get started.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Explore Delicacies
                </button>
              </div>
            ) : (
              /* Item List */
              <div className="divide-y divide-neutral-100">
                {cart.items.map((item) => (
                  <div
                    key={item.variantId}
                    className="py-4 flex gap-3.5 first:pt-0 last:pb-0 group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 relative">
                      <img
                        src={
                          item.thumbnail ||
                          "https://res.cloudinary.com/dskzfipt3/image/upload/v1775205758/SVG_1_y89cdr.svg"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                            {item.title}
                          </h4>
                          <span className="inline-block text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md mt-1">
                            {item.weight}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="p-1 px-2 text-neutral-600 hover:bg-neutral-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="p-1 px-2 text-neutral-600 hover:bg-neutral-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right font-mono font-bold text-sm text-neutral-900">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Add Cross-Sell Row when Cart has items */}
            {cart.items.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#70BF4F]" />
                  Customers Also Added
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickAddItems.map((prod) => {
                    const alreadyInCart = cart.items.some(
                      (i) => i.variantId === prod.variantId,
                    );
                    return (
                      <div
                        key={prod.variantId}
                        className="border border-neutral-200 rounded-xl p-2.5 flex flex-col justify-between bg-surface-muted hover:border-[#70BF4F]/50 transition-colors"
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-10 h-10 object-cover rounded-lg border border-neutral-200"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-neutral-800 truncate">
                              {prod.title}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              ₹{prod.price}
                            </p>
                          </div>
                        </div>
                        <button
                          disabled={alreadyInCart || updating}
                          onClick={() => {
                            // Find matching real seeded product id or pass
                            const seededProdId =
                              prod.variantId === "v-sm-100g"
                                ? cart.items[0]?.product // fallback link
                                : cart.items[0]?.product;
                            // Add using cart item endpoint
                            updateQuantity(prod.variantId, 1);
                          }}
                          className={`mt-2 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                            alreadyInCart
                              ? "bg-neutral-100 text-neutral-400"
                              : "bg-[#70BF4F]/15 hover:bg-[#70BF4F] text-[#356323] hover:text-white"
                          }`}
                        >
                          {alreadyInCart ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          {alreadyInCart ? "Added" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Coupon Code Section */}
            {cart.items.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. NAIK10)"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-mono font-semibold rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F] focus:ring-1 focus:ring-[#70BF4F]"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={updating}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#70BF4F] text-white text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {couponError}
                  </p>
                )}

                {/* Quick Coupon Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon("NAIK10")}
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#70BF4F]/15 text-[#356323] hover:bg-[#70BF4F]/25 border border-[#70BF4F]/30 transition-colors"
                  >
                    NAIK10 (10% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon("FREESHIP")}
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#70BF4F]/15 text-[#356323] hover:bg-[#70BF4F]/25 border border-[#70BF4F]/30 transition-colors"
                  >
                    FREESHIP
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-surface-border bg-surface-muted space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    ₹{cart.subtotal}
                  </span>
                </div>

                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-[#356323] font-medium">
                    <span className="flex items-center gap-1">
                      Coupon Discount ({cart.coupon?.code})
                    </span>
                    <span className="font-mono font-bold">
                      -₹{cart.discountAmount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-mono font-semibold">
                    {cart.shippingFee === 0 ? (
                      <span className="text-[#356323] font-bold">FREE</span>
                    ) : (
                      `₹${cart.shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span className="font-mono text-[#161915]">
                    ₹{cart.totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  if (onProceedToCheckout) onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-neutral-400 font-medium">
                🔒 Safe 256-bit Encrypted Checkout • Bluedart / Delhivery
                Delivery
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
