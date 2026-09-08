const mongoose = require('mongoose');
const Product = require('../models/Product');

// @desc    Get all products with dynamic search, multi-filter, sorting, pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      region,
      dietary,
      spiceLevel,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
      bestseller,
    } = req.query;

    const query = {};

    // 1. Search Query
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { highlights: searchRegex },
        { ingredients: searchRegex },
        { region: searchRegex },
        { vendor: searchRegex },
      ];
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      query.categorySlug = category.toLowerCase();
    }

    // 3. Region Filter
    if (region && region !== 'all') {
      query.region = region;
    }

    // 4. Dietary Preferences
    if (dietary && dietary !== 'all') {
      const dietaryArray = Array.isArray(dietary) ? dietary : dietary.split(',');
      query.dietary = { $in: dietaryArray };
    }

    // 5. Spice Level Filter
    if (spiceLevel && spiceLevel !== 'all') {
      query.spiceLevel = spiceLevel;
    }

    // 6. Price Range Filter (matches variant price)
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = Number(minPrice);
      if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
    }

    // 7. Flags
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (bestseller === 'true') {
      query.isBestseller = true;
    }

    // Sorting Logic
    let sortOptions = { isBestseller: -1, rating: -1, createdAt: -1 };
    if (sort === 'price-asc') {
      sortOptions = { 'variants.0.price': 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { 'variants.0.price': -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slugOrId
const getProductBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      product = await Product.findById(slugOrId).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: slugOrId }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch 4 related products from the same category or region for recommendation
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [{ categorySlug: product.categorySlug }, { region: product.region }],
    })
      .limit(4)
      .lean();

    res.json({
      success: true,
      data: product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured & bestselling products
// @route   GET /api/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const [bestsellers, regionalPicks] = await Promise.all([
      Product.find({ isBestseller: true }).limit(8).lean(),
      Product.find({ isFeatured: true }).limit(8).lean(),
    ]);

    res.json({
      success: true,
      data: {
        bestsellers,
        regionalPicks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product customer review
// @route   POST /api/products/:id/reviews
const addProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reviewerName, rating, title, comment } = req.body;

    if (!reviewerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Reviewer name, rating (1-5), and review comment are required',
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const newReview = {
      reviewerName: reviewerName.trim(),
      rating: Number(rating),
      title: title ? title.trim() : '',
      comment: comment.trim(),
      verifiedPurchase: true,
      date: new Date(),
    };

    product.reviews.unshift(newReview);
    product.reviewCount = product.reviews.length;

    // Recalculate average rating
    const totalRatingSum = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    product.rating = Number((totalRatingSum / product.reviews.length).toFixed(1));

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been published.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlugOrId,
  getFeaturedProducts,
  addProductReview,
};
