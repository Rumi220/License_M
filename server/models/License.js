const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  productName: { type: String, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Virtual field for status
licenseSchema.virtual('status').get(function () {
  const now = new Date();
  const diffDays = Math.ceil((this.expiryDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays <= 7) return 'Expiring Soon';
  return 'Active';
});

// Ensure virtuals are included in JSON outputs
licenseSchema.set('toJSON', { virtuals: true });
licenseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('License', licenseSchema);
