const Cart = require('../models/Cart');
const Product = require('../models/Product');

const FREE_DELIVERY_THRESHOLD = Number(process.env.FREE_DELIVERY_THRESHOLD) || 999;
const STANDARD_SHIPPING_FEE = Number(process.env.STANDARD_SHIPPING_FEE) || 79;

// Helper to compute calculated cart totals
const formatCartResponse = (cart) => {
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  let isFreeShippingCoupon = cart.coupon && cart.coupon.freeShipping;

  if (cart.coupon && cart.coupon.code) {
    if (cart.coupon.discountPercent > 0) {
      discountAmount = Math.round((subtotal * cart.coupon.discountPercent) / 100);
    } else if (cart.coupon.discountAmount > 0) {
      discountAmount = Math.min(subtotal, cart.coupon.discountAmount);
    }
  }

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || isFreeShippingCoupon;
  const shippingFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const freeDeliveryGap = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return {
    cartId: cart.cartId,
    items: cart.items,
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    coupon: cart.coupon,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    freeDeliveryGap,
    freeDeliveryProgress,
    isFreeDeliveryEligible: isFreeDelivery,
  };
};

// @desc    Get cart by cartId (or initialize if not found)
// @route   GET /api/cart/:cartId
const getCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = await Cart.create({
        cartId,
        items: [],
      });
    }

    res.json({
      success: true,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (with server-side price lookup)
// @route   POST /api/cart/items
const addItem = async (req, res, next) => {
  try {
    const { cartId, productId, variantId, quantity = 1 } = req.body;

    if (!cartId || !productId || !variantId) {
      return res.status(400).json({
        success: false,
        message: 'cartId, productId, and variantId are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const variant = product.variants.find((v) => v.variantId === variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Product variant not found',
      });
    }

    let cart = await Cart.findOne({ cartId });
    if (!cart) {
      cart = new Cart({ cartId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.variantId === variantId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant.variantId,
        title: product.title,
        weight: variant.weight,
        price: variant.price, // Trust ONLY database price
        quantity: Number(quantity),
        thumbnail: product.thumbnail,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: `${product.title} (${variant.weight}) added to cart!`,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PATCH /api/cart/items
const updateItem = async (req, res, next) => {
  try {
    const { cartId, variantId, quantity } = req.body;

    if (!cartId || !variantId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'cartId, variantId, and quantity are required',
      });
    }

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.variantId === variantId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated',
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:variantId
const removeItem = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const { cartId } = req.query;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: 'cartId query parameter is required',
      });
    }

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.variantId !== variantId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply or remove promo coupon
// @route   POST /api/cart/coupon
const applyCoupon = async (req, res, next) => {
  try {
    const { cartId, couponCode } = req.body;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: 'cartId is required',
      });
    }

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    if (!couponCode || couponCode.trim() === '') {
      // Remove coupon
      cart.coupon = {
        code: null,
        discountPercent: 0,
        discountAmount: 0,
        freeShipping: false,
      };
      await cart.save();
      return res.json({
        success: true,
        message: 'Coupon removed',
        data: formatCartResponse(cart),
      });
    }

    const cleanCode = couponCode.trim().toUpperCase();

    // Recognized promo codes
    if (cleanCode === 'NAIK10') {
      cart.coupon = {
        code: 'NAIK10',
        discountPercent: 10,
        discountAmount: 0,
        freeShipping: false,
      };
    } else if (cleanCode === 'FREESHIP') {
      cart.coupon = {
        code: 'FREESHIP',
        discountPercent: 0,
        discountAmount: 0,
        freeShipping: true,
      };
    } else if (cleanCode === 'FIRST50') {
      cart.coupon = {
        code: 'FIRST50',
        discountPercent: 0,
        discountAmount: 50,
        freeShipping: false,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid coupon code "${couponCode}". Try NAIK10, FREESHIP, or FIRST50.`,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: `Coupon "${cleanCode}" applied successfully!`,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   POST /api/cart/clear
const clearCart = async (req, res, next) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findOne({ cartId });
    if (cart) {
      cart.items = [];
      cart.coupon = { code: null, discountPercent: 0, discountAmount: 0, freeShipping: false };
      await cart.save();
    }
    res.json({
      success: true,
      message: 'Cart cleared',
      data: formatCartResponse(cart || { cartId, items: [] }),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyCoupon,
  clearCart,
};
