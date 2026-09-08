import React from 'react';
import { Truck, CheckCircle2, Sparkles } from 'lucide-react';

export const FreeShippingProgress = ({ cart }) => {
  const { subtotal, freeDeliveryThreshold, freeDeliveryGap, isFreeDeliveryEligible, freeDeliveryProgress } = cart;

  return (
    <div className="bg-surface-sage border border-[#70BF4F]/20 rounded-2xl p-4 transition-all">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 font-bold">
          {isFreeDeliveryEligible ? (
            <span className="text-[#356323] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#70BF4F]" />
              FREE Standard Delivery Unlocked!
            </span>
          ) : (
            <span className="text-neutral-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#70BF4F]" />
              Add <strong className="text-[#70BF4F]">₹{freeDeliveryGap}</strong> more for Free Delivery
            </span>
          )}
        </div>
        <span className="font-mono font-bold text-neutral-500 text-[11px]">
          ₹{subtotal} / ₹{freeDeliveryThreshold}
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFreeDeliveryEligible
              ? 'bg-gradient-to-r from-[#70BF4F] to-[#5BA33E]'
              : 'bg-[#70BF4F]'
          }`}
          style={{ width: `${freeDeliveryProgress}%` }}
        />
      </div>

      {isFreeDeliveryEligible && (
        <p className="text-[11px] text-[#356323] font-medium mt-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#70BF4F]" />
          You saved ₹79 shipping on this order!
        </p>
      )}
    </div>
  );
};
