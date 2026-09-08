const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create / place new simulated order
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { cartId, customer, paymentMethod = 'UPI' } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.addressLine || !customer.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, phone number, address, and pincode',
      });
    }

    let cart = null;
    if (cartId) {
      cart = await Cart.findOne({ cartId });
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add products before placing an order.',
      });
    }

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discount = 0;
    if (cart.coupon && cart.coupon.code) {
      if (cart.coupon.discountPercent > 0) {
        discount = Math.round((subtotal * cart.coupon.discountPercent) / 100);
      } else if (cart.coupon.discountAmount > 0) {
        discount = Math.min(subtotal, cart.coupon.discountAmount);
      }
    }

    const isFreeShipping = subtotal >= 999 || (cart.coupon && cart.coupon.freeShipping);
    const shippingFee = isFreeShipping ? 0 : 79;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    // Generate unique order ID and tracking number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `NF-${new Date().getFullYear()}-${randomSuffix}`;
    const trackingId = `NAIK-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;

    const deliveryDays = customer.pincode.startsWith('411') ? 2 : 3;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);
    const estimatedDeliveryDate = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const newOrder = await Order.create({
      orderNumber,
      trackingId,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email ? customer.email.trim() : 'guest@naikfoods.co.in',
        phone: customer.phone.trim(),
        addressLine: customer.addressLine.trim(),
        landmark: customer.landmark ? customer.landmark.trim() : '',
        city: customer.city || 'Pune',
        state: customer.state || 'Maharashtra',
        pincode: customer.pincode.trim(),
      },
      items: cart.items,
      pricing: {
        subtotal,
        discount,
        shippingFee,
        totalAmount,
      },
      couponUsed: {
        code: cart.coupon ? cart.coupon.code : null,
        discountAmount: discount,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      orderStatus: 'Order Confirmed',
      estimatedDeliveryDate,
    });

    // Clear cart after successful order creation
    cart.items = [];
    cart.coupon = { code: null, discountPercent: 0, discountAmount: 0, freeShipping: false };
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! A confirmation SMS and WhatsApp message have been simulated.',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by order number
// @route   GET /api/orders/:orderNumber
const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderByNumber,
};
