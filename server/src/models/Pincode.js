const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      unique: true,
      index: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      default: 'Maharashtra',
    },
    serviceable: {
      type: Boolean,
      default: true,
    },
    estimatedDays: {
      type: String,
      default: '2 - 3 Days',
    },
    expressDelivery: {
      type: Boolean,
      default: false,
    },
    codAvailable: {
      type: Boolean,
      default: true,
    },
    deliveryPartner: {
      type: String,
      default: 'Naik Express / Bluedart',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pincode', pincodeSchema);
