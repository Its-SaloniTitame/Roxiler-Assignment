const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const appRoutes = require('./src/routes/appRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use the unified appRoutes
app.use('/api', appRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully!' });
});

// Fallback Route for 404 Errors
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
