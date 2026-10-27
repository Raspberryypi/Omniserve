const Asset = require('../models/Asset');

// @desc    Get all assets
// @route   GET /api/assets
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching assets.' });
  }
};

// @desc    Create new asset
// @route   POST /api/assets
exports.createAsset = async (req, res) => {
  const { name, serialNumber, category, status, location } = req.body;
  try {
    const existing = await Asset.findOne({ serialNumber });
    if (existing) {
      return res.status(400).json({ message: 'Serial number already exists.' });
    }

    const asset = new Asset({ name, serialNumber, category, status, location });
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Server error while creating asset.' });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating asset.' });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    res.json({ message: 'Asset deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting asset.' });
  }
};

// @desc    Add maintenance log entry
// @route   POST /api/assets/:id/maintenance
exports.addMaintenanceLog = async (req, res) => {
  const { note, cost, performedBy } = req.body;
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });

    asset.maintenanceLogs.push({
      note,
      cost: cost || 0,
      performedBy: performedBy || req.user.name,
      date: new Date()
    });

    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Server error adding maintenance record.' });
  }
};