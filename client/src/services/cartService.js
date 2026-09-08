import api from './api';

export const cartService = {
  // Fetch cart details by cartId
  getCart: async (cartId) => {
    return await api.get(`/cart/${cartId}`);
  },

  // Add item with variant
  addItem: async (cartId, productId, variantId, quantity = 1) => {
    return await api.post('/cart/items', {
      cartId,
      productId,
      variantId,
      quantity,
    });
  },

  // Update item quantity
  updateItem: async (cartId, variantId, quantity) => {
    return await api.patch('/cart/items', {
      cartId,
      variantId,
      quantity,
    });
  },

  // Remove item
  removeItem: async (cartId, variantId) => {
    return await api.delete(`/cart/items/${variantId}`, {
      params: { cartId },
    });
  },

  // Apply or remove coupon
  applyCoupon: async (cartId, couponCode) => {
    return await api.post('/cart/coupon', {
      cartId,
      couponCode,
    });
  },

  // Clear cart
  clearCart: async (cartId) => {
    return await api.post('/cart/clear', { cartId });
  },
};
