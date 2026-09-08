const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variantId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true, // e.g., "100g", "200g", "500g", "1kg"
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  inventoryQuantity: {
    type: Number,
    default: 50,
  },
});

const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    default: '',
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
  },
  verifiedPurchase: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    highlights: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    categorySlug: {
      type: String,
      required: true,
      index: true,
    },
    region: {
      type: String,
      required: true,
      enum: ['Pune', 'Vidarbha', 'Konkan', 'Marathwada', 'Western Maharashtra'],
      index: true,
    },
    dietary: [
      {
        type: String,
        enum: [
          'Vegan',
          'Jain Friendly',
          'Millet-Based',
          'Zero Maida',
          'Gluten-Free',
          '100% Vegetarian',
        ],
      },
    ],
    spiceLevel: {
      type: String,
      enum: ['None', 'Mild', 'Medium', 'Spicy', 'Kolhapuri Teekha'],
      default: 'Mild',
    },
    vendor: {
      type: String,
      default: 'Naik Foods Heritage',
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    shelfLife: {
      type: String,
      default: '6 Months',
    },
    storageInstruction: {
      type: String,
      default: 'Store in an airtight container in a cool, dry place.',
    },
    variants: [variantSchema],
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast keyword search across title, subtitle, highlights, and ingredients
productSchema.index({
  title: 'text',
  subtitle: 'text',
  highlights: 'text',
  ingredients: 'text',
  region: 'text',
});

module.exports = mongoose.model('Product', productSchema);
