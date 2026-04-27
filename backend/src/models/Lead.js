const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['New', 'Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'New'
  },
  value: {
    type: String,
    default: '₹0'
  },
  source: {
    type: String,
    default: 'Direct'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
