import api from './api';

export const productService = {
  // Fetch products with multi-filter, search, region, dietary, sorting, pagination
  getProducts: async (params = {}) => {
    return await api.get('/products', { params });
  },

  // Fetch featured & bestseller picks
  getFeatured: async () => {
    return await api.get('/products/featured');
  },

  // Fetch single product by slug or id
  getProduct: async (slugOrId) => {
    return await api.get(`/products/${slugOrId}`);
  },

  // Add customer review
  addReview: async (productId, reviewData) => {
    return await api.post(`/products/${productId}/reviews`, reviewData);
  },

  // Fetch all product categories
  getCategories: async () => {
    return await api.get('/categories');
  },
};
