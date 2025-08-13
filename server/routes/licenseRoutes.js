const express = require('express');
const router = express.Router();

const { createLicense, getPaginatedLicenses , updateLicense, deleteLicense } = require('../controllers/licenseController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All users can view
router.get('/', authenticateToken, getPaginatedLicenses);

// Only admins can create, update and delete
router.post('/', authenticateToken, authorizeRoles('admin'), createLicense);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateLicense);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteLicense);

module.exports = router;
