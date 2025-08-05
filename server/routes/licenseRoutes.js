const express = require('express');
const router = express.Router();

const { createLicense, getLicenses, updateLicense } = require('../controllers/licenseController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All users can view
router.get('/', authenticateToken, getLicenses);

// Only admins can create and update
router.post('/', authenticateToken, authorizeRoles('admin'), createLicense);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateLicense);

module.exports = router;
