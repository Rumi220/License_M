const License = require('../models/License');

// Get all licenses (for all users)
exports.getPaginatedLicenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await License.countDocuments();
    const licenses = await License.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      licenses,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch licenses' });
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
