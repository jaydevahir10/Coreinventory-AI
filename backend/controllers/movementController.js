const StockMovement = require('../models/StockMovement');
const Product       = require('../models/Product');

// RECEIPTS
exports.createReceipt = async (req, res) => {
  try {
    const movement = await StockMovement.create({ ...req.body, type: 'receipt', createdBy: req.user._id });
    res.status(201).json(movement);
  } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.validateReceipt = async (req, res) => {
  try {
    const m = await StockMovement.findById(req.params.id);
    if (!m || m.type !== 'receipt') return res.status(404).json({ msg: 'Receipt not found' });
    if (m.status !== 'pending') return res.status(400).json({ msg: 'Already processed' });
    await Product.findByIdAndUpdate(m.productId, { $inc: { stock: m.quantity } });
    m.status = 'validated';
    await m.save();
    req.app.get('io').emit('stock:updated', { productId: m.productId, type: 'receipt' });
    res.json({ success: true, movement: m });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await StockMovement.find({ type: 'receipt' })
      .populate('productId', 'name sku').populate('createdBy', 'name').sort('-createdAt');
    res.json(receipts);
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

// DELIVERIES
exports.createDelivery = async (req, res) => {
  try {
    const movement = await StockMovement.create({ ...req.body, type: 'delivery', createdBy: req.user._id });
    res.status(201).json(movement);
  } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.validateDelivery = async (req, res) => {
  try {
    const m = await StockMovement.findById(req.params.id);
    if (!m || m.type !== 'delivery') return res.status(404).json({ msg: 'Delivery not found' });
    if (m.status !== 'pending') return res.status(400).json({ msg: 'Already processed' });
    const product = await Product.findById(m.productId);
    if (product.stock < m.quantity) return res.status(400).json({ msg: 'Insufficient stock' });
    await Product.findByIdAndUpdate(m.productId, { $inc: { stock: -m.quantity } });
    m.status = 'validated';
    await m.save();
    req.app.get('io').emit('stock:updated', { productId: m.productId, type: 'delivery' });
    res.json({ success: true, movement: m });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await StockMovement.find({ type: 'delivery' })
      .populate('productId', 'name sku').populate('createdBy', 'name').sort('-createdAt');
    res.json(deliveries);
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

// TRANSFER
exports.createTransfer = async (req, res) => {
  try {
    const movement = await StockMovement.create({ ...req.body, type: 'transfer', createdBy: req.user._id });
    await Product.findByIdAndUpdate(req.body.productId, { $inc: { stock: 0 } }); // stock total unchanged
    req.app.get('io').emit('stock:updated', { type: 'transfer' });
    res.status(201).json(movement);
  } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.getTransfers = async (req, res) => {
  try {
    const transfers = await StockMovement.find({ type: 'transfer' })
      .populate('productId', 'name sku').sort('-createdAt');
    res.json(transfers);
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

// ADJUSTMENT
exports.createAdjustment = async (req, res) => {
  try {
    const { productId, actualStock, note } = req.body;
    const product = await Product.findById(productId);
    const diff = actualStock - product.stock;
    await Product.findByIdAndUpdate(productId, { stock: actualStock });
    const movement = await StockMovement.create({
      productId, type: 'adjustment', quantity: diff,
      status: 'validated', note, createdBy: req.user._id
    });
    req.app.get('io').emit('stock:updated', { productId, type: 'adjustment' });
    res.status(201).json(movement);
  } catch (e) { res.status(400).json({ msg: e.message }); }
};
