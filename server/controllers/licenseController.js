const License = require('../models/License');

// Get all licenses (for all users)
exports.getPaginatedLicenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Build a filter
    const filter = search
      ? {
          $or: [
            { clientName: { $regex: search, $options: "i" } }, // case-insensitive
            { productName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await License.countDocuments(filter);
    const licenses = await License.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name'); // <-- populate createdBy with only the name field

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
    const { clientName, productName, customerPODate, startDate, expiryDate, details, reminder } = req.body;

    const license = await License.create({
      clientName,
      productName,
      customerPODate,
      startDate,
      expiryDate,
      details,
      reminder,
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

// Delete license (admin only)
exports.deleteLicense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await License.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: 'License not found' });
    }

    res.json({ msg: 'License deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};