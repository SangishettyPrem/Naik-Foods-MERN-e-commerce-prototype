const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlugOrId,
  getFeaturedProducts,
  addProductReview,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slugOrId', getProductBySlugOrId);
router.post('/:id/reviews', addProductReview);

module.exports = router;
