const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Database Connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('WARNING: MONGODB_URI is not defined. Database connection will fail.');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB via Serverless Function');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

// For local testing, we can still listen on a port, but Vercel ignores this and exports the app
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Local dev server running on port ${PORT}`));
  });
}

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Export the Express API for Vercel Serverless
module.exports = app;
