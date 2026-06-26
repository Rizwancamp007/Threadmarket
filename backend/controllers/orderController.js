const Order = require('../models/Order');

// Generate unique order token e.g. TM-2024-X8B9
const generateOrderToken = () => {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TM-${year}-${randomStr}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest Checkout Supported)
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const orderToken = generateOrderToken();

      const order = new Order({
        orderToken,
        orderItems,
        user: req.user ? req.user._id : undefined, // Attach user if logged in
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is admin or the order belongs to the user
      if (req.user.role === 'admin' || (order.user && order.user._id.equals(req.user._id))) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track order by token
// @route   GET /api/orders/track/:token
// @access  Public
const trackOrderByToken = async (req, res) => {
  try {
    const token = req.params.token.trim();
    // Check if token is a valid mongoose ObjectId
    const isValidObjectId = token.match(/^[0-9a-fA-F]{24}$/);
    
    const query = isValidObjectId 
      ? { $or: [{ orderToken: token }, { _id: token }] }
      : { orderToken: token };

    const order = await Order.findOne(query);

    if (order) {
      res.json({
        orderToken: order.orderToken,
        status: order.status,
        shippingAddress: order.shippingAddress,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        expectedDelivery: new Date(order.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000) // +5 days
      });
    } else {
      res.status(404).json({ message: 'Order not found with that token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      
      if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
        order.isPaid = true; // Assuming COD is paid on delivery
        order.paidAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Admin
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  trackOrderByToken,
  updateOrderStatus,
  getOrders,
  markOrderAsPaid
};
