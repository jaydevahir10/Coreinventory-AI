const Product       = require('../models/Product');
const StockMovement = require('../models/StockMovement');

exports.getStats = async (req, res) => {
  try {
    const [totalProducts, lowStockItems, pendingReceipts, pendingDeliveries] = await Promise.all([
      Product.countDocuments(),
      Product.find({ $expr: { $lt: ['$stock', '$reorderLevel'] } }).select('name sku stock reorderLevel'),
      StockMovement.countDocuments({ type: 'receipt',  status: 'pending' }),
      StockMovement.countDocuments({ type: 'delivery', status: 'pending' }),
    ]);

    // Stock trend — last 6 months grouped by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trend = await StockMovement.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'validated' } },
      { $group: {
        _id: { month: { $month: '$createdAt' }, type: '$type' },
        total: { $sum: '$quantity' }
      }},
      { $sort: { '_id.month': 1 } }
    ]);

    res.json({ totalProducts, lowStock: lowStockItems.length, pendingReceipts, pendingDeliveries, lowStockItems, trend });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.getAlerts = async (req, res) => {
  try {
    const items = await Product.find({ $expr: { $lt: ['$stock', '$reorderLevel'] } });
    const alerts = items.map(p => ({
      id: p._id, type: p.stock === 0 ? 'critical' : 'low',
      product: p.name, sku: p.sku,
      current: p.stock, reorder: p.reorderLevel,
      daysLeft: p.stock === 0 ? 0 : Math.floor(p.stock / 5)
    }));
    res.json(alerts);
  } catch (e) { res.status(500).json({ msg: e.message }); }
};
