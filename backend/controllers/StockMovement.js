const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  type: {
    type: String,
    enum: ["receipt", "delivery", "transfer", "adjustment"],
    required: true
  },
  quantity: Number,
  status: {
    type: String,
    enum: ["pending", "validated"],
    default: "pending"
  },
  note: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("StockMovement", stockMovementSchema);