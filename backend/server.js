const express    = require('express');
const mongoose   = require('mongoose');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
require('dotenv').config();

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/warehouse',  require('./routes/warehouseRoutes'));
app.use('/api/receipts',   require('./routes/receiptRoutes'));
app.use('/api/delivery',   require('./routes/deliveryRoutes'));
app.use('/api/transfer',   require('./routes/transferRoutes'));
app.use('/api/adjustment', require('./routes/adjustmentRoutes'));
app.use('/api/dashboard',  require('./routes/dashboardRoutes'));

app.set('io', io);
app.get('/', (req, res) => res.send('CoreInventory API running'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected → localhost:27017');
    server.listen(process.env.PORT || 5000, () =>
      console.log('Backend running → http://localhost:5000')
    );
  })
  .catch(err => console.error(err));
