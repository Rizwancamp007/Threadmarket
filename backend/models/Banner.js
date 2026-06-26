const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  mobileImage: String,
  title: String,
  subtitle: String,
  link: String,
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date,
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
