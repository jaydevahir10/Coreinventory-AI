const { Schema, model } = require('mongoose');

const warehouseSchema = new Schema({
  name:     { type: String, required: true },
  location: String,
  capacity: { type: Number, default: 1000 },
}, { timestamps: true });

module.exports = model('Warehouse', warehouseSchema);
