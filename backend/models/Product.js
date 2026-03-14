const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  category: String,
  unit: {
    type: String,
    default: "pcs"
  },
  stock: {
    type: Number,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);