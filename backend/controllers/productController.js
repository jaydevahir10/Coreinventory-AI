const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, warehouse } = req.query;
    const query = {};
    if (category)  query.category = category;
    if (warehouse) query.warehouseLocation = warehouse;
    if (search)    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku:  { $regex: search, $options: 'i' } },
    ];
    const products = await Product.find(query);
    res.json(products);
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};
