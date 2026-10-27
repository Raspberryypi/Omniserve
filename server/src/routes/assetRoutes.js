const express = require('express');
const router = express.Router();
const { 
  getAssets, 
  createAsset, 
  updateAsset, 
  deleteAsset, 
  addMaintenanceLog 
} = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAssets);
router.post('/', protect, authorize('Admin', 'Manager'), createAsset);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateAsset);
router.delete('/:id', protect, authorize('Admin'), deleteAsset);
router.post('/:id/maintenance', protect, authorize('Admin', 'Manager', 'Operator'), addMaintenanceLog);

module.exports = router;