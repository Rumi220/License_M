const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  expirationDate: { type: Date, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);
