const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const order = await Order.findOne();
    if (!order) {
      console.log('No orders found');
      process.exit();
    }
    
    console.log('Order found:', order._id);
    
    order.status = 'Approved';
    await order.save();
    console.log('Successfully saved!');
    
  } catch (err) {
    console.error('Error saving order:', err.stack);
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        console.error(`- ${key}: ${err.errors[key].message}`);
      });
    }
  }
  process.exit();
});
