import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartId, setCartId] = useState('');
  const [cart, setCart] = useState({
    cartId: '',
    items: [],
    itemCount: 0,
    coupon: null,
    subtotal: 0,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
    freeDeliveryThreshold: 999,
    freeDeliveryGap: 999,
    freeDeliveryProgress: 0,
    isFreeDeliveryEligible: false,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Initialize or retrieve persistent Cart ID
  useEffect(() => {
    let storedId = localStorage.getItem('naik_cart_id');
    if (!storedId) {
      storedId = 'cart_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('naik_cart_id', storedId);
    }
    setCartId(storedId);
  }, []);

  // Fetch cart data once cartId is ready
  const refreshCart = useCallback(
    async (id = cartId) => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await cartService.getCart(id);
        if (res.success && res.data) {
          setCart(res.data);
        }
      } catch (err) {
        console.error('Failed to load cart:', err.message);
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  useEffect(() => {
    if (cartId) {
      refreshCart(cartId);
    }
  }, [cartId, refreshCart]);

  // Add item with variant
  const addToCart = async (productId, variantId, quantity = 1) => {
    try {
      setUpdating(true);
      const res = await cartService.addItem(cartId, productId, variantId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        addToast(res.message || 'Added to cart!', 'success');
        setIsCartOpen(true); // Seamless slide-over cart drawer opening
      }
    } catch (err) {
      addToast(err.message || 'Failed to add item', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (variantId, quantity) => {
    try {
      setUpdating(true);
      const res = await cartService.updateItem(cartId, variantId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to update quantity', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Remove item
  const removeFromCart = async (variantId) => {
    try {
      setUpdating(true);
      const res = await cartService.removeItem(cartId, variantId);
      if (res.success && res.data) {
        setCart(res.data);
        addToast('Item removed from cart', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to remove item', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Apply Coupon
  const applyCoupon = async (couponCode) => {
    try {
      setUpdating(true);
      const res = await cartService.applyCoupon(cartId, couponCode);
      if (res.success && res.data) {
        setCart(res.data);
        addToast(res.message, 'success');
        return { success: true, message: res.message };
      }
    } catch (err) {
      addToast(err.message || 'Invalid coupon', 'error');
      return { success: false, message: err.message };
    } finally {
      setUpdating(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const res = await cartService.clearCart(cartId);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        loading,
        updating,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
