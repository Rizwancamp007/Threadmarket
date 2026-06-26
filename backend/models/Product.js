const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  images: [String], // Array of Cloudinary URLs
  description: {
    type: String, // Rich text
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [String],
  fabric: String,
  colors: [String],
  sizes: [String],
  price: {
    type: Number,
    required: true,
    default: 0
  },
  discountedPrice: {
    type: Number
  },
  costPrice: {
    type: Number
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  metaTitle: String,
  metaDescription: String,
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Auto-generate slug before save
productSchema.pre('save', function() {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
