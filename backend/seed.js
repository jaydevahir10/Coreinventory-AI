require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const User     = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Product.deleteMany();
  await User.deleteMany();
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'password123', role: 'admin' });
  await Product.insertMany([
    { name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', unit: 'pcs', stock: 142, reorderLevel: 20 },
    { name: 'USB-C Hub 7-Port',    sku: 'UC-002', category: 'Electronics', unit: 'pcs', stock: 67,  reorderLevel: 15 },
    { name: 'Cotton T-Shirt L',    sku: 'CT-003', category: 'Apparel',     unit: 'pcs', stock: 310, reorderLevel: 50 },
    { name: 'Running Shoes M',     sku: 'RS-004', category: 'Apparel',     unit: 'pcs', stock: 8,   reorderLevel: 25 },
    { name: 'Organic Almonds 1kg', sku: 'OA-005', category: 'Food',        unit: 'kg',  stock: 5,   reorderLevel: 30 },
    { name: 'Smart Watch Pro',     sku: 'SW-006', category: 'Electronics', unit: 'pcs', stock: 34,  reorderLevel: 10 },
  ]);
  console.log('Seeded: 1 admin user + 6 products');
  console.log('Login: admin@test.com / password123');
  process.exit();
}).catch(console.error);
