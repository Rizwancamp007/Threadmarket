const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  bundlePrice: {
    type: Number,
    required: true
  },
  originalTotal: {
    type: Number,
    required: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date
}, { timestamps: true });

const Bundle = mongoose.model('Bundle', bundleSchema);
module.exports = Bundle;
