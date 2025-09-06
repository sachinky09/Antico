import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import interestRoutes from './routes/interests.js';
import biddingRoutes from './routes/bidding.js';
import bidRoutes from './routes/bids.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/interests', interestRoutes);
app.use('/bidding', biddingRoutes);
app.use('/bids', bidRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Antico Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Antico Backend running on port ${PORT}`);
});