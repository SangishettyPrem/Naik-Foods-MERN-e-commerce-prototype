const Pincode = require('../models/Pincode');

// @desc    Check delivery serviceability by Indian Pincode
// @route   POST /api/pincode/check
const checkPincode = async (req, res, next) => {
  try {
    const { pincode } = req.body;

    if (!pincode || !/^\d{6}$/.test(pincode.toString().trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      });
    }

    const pin = pincode.toString().trim();

    // Check if customized pincode exists in DB
    let record = await Pincode.findOne({ pincode: pin });

    if (!record) {
      // Dynamic fallback estimation based on Indian Postal Circle prefixes
      let city = 'Maharashtra';
      let estimatedDays = '3 - 4 Days';
      let expressDelivery = false;
      let state = 'Maharashtra';

      if (pin.startsWith('411')) {
        city = 'Pune / PCMC';
        estimatedDays = '24 - 48 Hours';
        expressDelivery = true;
      } else if (pin.startsWith('400') || pin.startsWith('401')) {
        city = 'Mumbai / Thane';
        estimatedDays = '2 - 3 Days';
        expressDelivery = true;
      } else if (pin.startsWith('440') || pin.startsWith('441')) {
        city = 'Nagpur (Vidarbha)';
        estimatedDays = '2 - 3 Days';
      } else if (pin.startsWith('416')) {
        city = 'Kolhapur';
        estimatedDays = '2 - 3 Days';
      } else if (pin.startsWith('422')) {
        city = 'Nashik';
        estimatedDays = '2 - 3 Days';
      } else if (pin.startsWith('431')) {
        city = 'Chhatrapati Sambhajinagar (Marathwada)';
        estimatedDays = '3 - 4 Days';
      } else if (pin.startsWith('110')) {
        city = 'Delhi NCR';
        state = 'Delhi';
        estimatedDays = '4 - 5 Days';
      } else if (pin.startsWith('560')) {
        city = 'Bengaluru';
        state = 'Karnataka';
        estimatedDays = '4 - 5 Days';
      } else {
        city = 'Your Area';
        state = 'India';
        estimatedDays = '4 - 5 Days';
      }

      record = {
        pincode: pin,
        city,
        state,
        serviceable: true,
        estimatedDays,
        expressDelivery,
        codAvailable: true,
        deliveryPartner: 'Bluedart / Delhivery / Naik Logistics',
      };
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkPincode,
};
