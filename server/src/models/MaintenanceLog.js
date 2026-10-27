const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);