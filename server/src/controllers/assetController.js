const Asset = require('../models/Asset');

// @desc    Get all assets
// @route   GET /api/assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({}).populate('assignedTo', 'name email role');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assets.', error: error.message });
  }
};

// @desc    Create a new asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
  try {
    const { name, serialNumber, category, status, location, assignedTo } = req.body;

    const assetExists = await Asset.findOne({ serialNumber });
    if (assetExists) {
      return res.status(400).json({ message: 'Asset with this serial number already exists.' });
    }

    const asset = await Asset.create({
      name,
      serialNumber,
      category,
      status: status || 'Available',
      location,
      assignedTo: assignedTo || null
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating asset.', error: error.message });
  }
};

// @desc    Update asset details or status
// @route   PUT /api/assets/:id
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating asset.', error: error.message });
  }
};

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    await asset.deleteOne();
    res.json({ message: 'Asset removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting asset.', error: error.message });
  }
};

module.exports = { getAssets, createAsset, updateAsset, deleteAsset };