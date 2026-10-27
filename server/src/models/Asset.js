const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  serialNumber: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'In Use', 'Under Maintenance', 'Decommissioned'], 
    default: 'Available' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  location: { type: String, required: true }
}, { timestamps: true });

// Adds text indexing so we can build fast search bars later
assetSchema.index({ name: 'text', serialNumber: 'text', category: 'text' });

module.exports = mongoose.model('Asset', assetSchema);