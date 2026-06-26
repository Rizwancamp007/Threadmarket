const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderToken: {
    type: String,
    required: true,
    unique: true
  },
  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    address: String,
    city: String
  },
  orderItems: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    size: String,
    color: String
  }],
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentProof: String,
  itemsPrice: { type: Number, default: 0.0 },
  taxPrice: { type: Number, default: 0.0 },
  shippingPrice: { type: Number, default: 0.0 },
  totalPrice: { type: Number, default: 0.0 },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

// Auto-generate order token
orderSchema.pre('save', function() {
  if (!this.orderToken) {
    const year = new Date().getFullYear();
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.orderToken = `TM-${year}-${randomStr}`;
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
