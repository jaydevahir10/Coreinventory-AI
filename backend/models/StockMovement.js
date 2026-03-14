const { Schema, model } = require('mongoose');

const movementSchema = new Schema({
  productId:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  type:         { type: String, enum: ['receipt','delivery','transfer','adjustment'], required: true },
  quantity:     { type: Number, required: true },
  fromLocation: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  toLocation:   { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  status:       { type: String, enum: ['pending','validated','cancelled'], default: 'pending' },
  createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
  note:         String,
}, { timestamps: true });

module.exports = model('StockMovement', movementSchema);
