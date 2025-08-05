const License = require('../models/License');

// Get all licenses (for all users)
exports.getLicenses = async (req, res) => {
  try {
    const licenses = await License.find().populate('createdBy', 'name email');
    res.json(licenses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Add a new license (admin only)
exports.createLicense = async (req, res) => {
  try {
    const { productName, licenseKey, expirationDate } = req.body;

    const existing = await License.findOne({ licenseKey });
    if (existing) return res.status(400).json({ msg: 'License key already exists' });

    const license = await License.create({
      productName,
      licenseKey,
      expirationDate,
      createdBy: req.user.id
    });

    res.status(201).json(license);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update license (admin only)
exports.updateLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await License.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
