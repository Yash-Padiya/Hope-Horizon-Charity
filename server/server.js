const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const volunteerRoutes = require('./src/routes/volunteerRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const supportRoutes = require('./src/routes/supportRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(
  {
    origin: "http://localhost:5173", 
    credentials: true,  
  }
));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json({limit: '5mb'}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/support', supportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
