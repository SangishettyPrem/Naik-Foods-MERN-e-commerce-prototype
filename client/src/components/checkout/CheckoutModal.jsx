import { useState } from "react";
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
  Phone,
  Home,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { orderService } from "../../services/pincodeService";
import { pincodeService } from "../../services/pincodeService";

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, cartId, refreshCart } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressLine: "",
    landmark: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411002",
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-detect city if pincode changes
    if (name === "pincode" && value.length === 6) {
      pincodeService.checkPincode(value).then((res) => {
        if (res.success && res.data) {
          setFormData((prev) => ({
            ...prev,
            city: res.data.city,
            state: res.data.state,
          }));
        }
      });
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.addressLine ||
      !formData.pincode
    ) {
      addToast("Please fill all mandatory shipping details", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await orderService.createOrder({
        cartId,
        customer: formData,
        paymentMethod,
      });

      if (res.success && res.data) {
        setConfirmedOrder(res.data);
        await refreshCart(cartId); // Refresh empty cart
        addToast("Order confirmed successfully!", "success");
      }
    } catch (err) {
      addToast(err.message || "Failed to process order", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-neutral-200">
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-muted">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-neutral-900">
              Naik<span className="text-[#70BF4F]">Foods</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#70BF4F]/15 text-[#356323]">
              Express Checkout
            </span>
          </div>
          <button
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {confirmedOrder ? (
            /* Order Success State */
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#356323] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  Dhanyawad! Order Confirmed
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Your authentic Maharashtrian delicacies are being freshly
                  packed.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-surface-sage border border-[#70BF4F]/30 rounded-2xl p-5 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200/80">
                  <span className="text-xs text-neutral-500 font-semibold">
                    Order Number
                  </span>
                  <span className="font-mono font-black text-neutral-900 text-sm">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-neutral-200/80">
                  <span className="text-xs text-neutral-500 font-semibold">
                    Bluedart Tracking ID
                  </span>
                  <span className="font-mono font-bold text-[#356323] text-xs">
                    {confirmedOrder.trackingId}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-neutral-200/80">
                  <span className="text-xs text-neutral-500 font-semibold">
                    Estimated Delivery
                  </span>
                  <span className="font-semibold text-neutral-900 text-xs flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#70BF4F]" />
                    {confirmedOrder.estimatedDeliveryDate}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500 font-semibold">
                    Amount Paid / COD
                  </span>
                  <span className="font-mono font-black text-neutral-900 text-base">
                    ₹{confirmedOrder.pricing.totalAmount}
                  </span>
                </div>
              </div>

              {/* Shipping Recipient Notice */}
              <div className="text-xs text-neutral-600 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left space-y-1">
                <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-[#70BF4F]" />
                  Shipping to: {confirmedOrder.customer.fullName} (
                  {confirmedOrder.customer.phone})
                </p>
                <p className="text-neutral-500">
                  {confirmedOrder.customer.addressLine},{" "}
                  {confirmedOrder.customer.city} -{" "}
                  {confirmedOrder.customer.pincode}
                </p>
              </div>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-xs font-bold transition-colors shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Order Items Preview Snippet */}
              <div className="bg-surface-muted border border-neutral-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-neutral-900">
                    {cart.itemCount} Items in Order
                  </p>
                  <p className="text-neutral-500 text-[11px]">
                    Subtotal: ₹{cart.subtotal}{" "}
                    {cart.discountAmount > 0 &&
                      `• Saved ₹${cart.discountAmount}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-mono text-neutral-900">
                    Total: ₹{cart.totalAmount}
                  </span>
                  <span className="block text-[10px] text-[#356323] font-bold">
                    {cart.shippingFee === 0
                      ? "FREE Shipping"
                      : "+ ₹79 Delivery"}
                  </span>
                </div>
              </div>

              {/* Shipping Address Inputs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#70BF4F]" />
                  Delivery Address in India
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Anand Joshi"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">
                    Flat / House No. / Building / Street Address *
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    required
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="e.g. 102, Shreeram Residency, Near City Post Office"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="411002"
                      className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-neutral-200 focus:outline-none focus:border-[#70BF4F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#70BF4F]" />
                  Select Payment Option
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "UPI",
                      label: "UPI / QR Code",
                      sub: "Instant & Fast",
                    },
                    {
                      id: "COD",
                      label: "Cash on Delivery",
                      sub: "Pay upon arrival",
                    },
                    {
                      id: "CARD",
                      label: "Credit / Debit",
                      sub: "Visa, Master",
                    },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setPaymentMethod(pay.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === pay.id
                          ? "border-[#70BF4F] bg-[#70BF4F]/10 ring-1 ring-[#70BF4F]"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <p className="text-xs font-bold text-neutral-900">
                        {pay.label}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        {pay.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <button
                  type="submit"
                  disabled={submitting || cart.items.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>
                    {submitting
                      ? "Placing Order..."
                      : `Place Order • ₹${cart.totalAmount}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-neutral-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#70BF4F]" />
                  Simulated Prototype Checkout • Safe & Verified
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
