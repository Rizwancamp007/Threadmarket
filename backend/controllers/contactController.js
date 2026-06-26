const Contact = require('../models/Contact');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const contact = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json({ message: 'Message sent successfully!', contactId: contact._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error while sending message', error: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages
};
