const express = require('express');
const router = express.Router();
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyCoupon,
  clearCart,
} = require('../controllers/cartController');

router.get('/:cartId', getCart);
router.post('/items', addItem);
router.patch('/items', updateItem);
router.delete('/items/:variantId', removeItem);
router.post('/coupon', applyCoupon);
router.post('/clear', clearCart);

module.exports = router;
