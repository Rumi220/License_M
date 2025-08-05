// Load all the packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Load route files
const authRoutes = require('./routes/authRoutes');
const licenseRoutes = require('./routes/licenseRoutes');

dotenv.config(); // Load the .env file
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Handle JSON input

// Prevent too many requests from same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/licenses', licenseRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log('MongoDB Error:', err));
