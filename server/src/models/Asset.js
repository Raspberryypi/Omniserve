const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  note: { type: String, required: true },
  cost: { type: Number, default: 0 },
  performedBy: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'In Use', 'Under Maintenance', 'Decommissioned'],
    default: 'Available' 
  },
  location: { type: String, required: true },
  maintenanceLogs: [MaintenanceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);