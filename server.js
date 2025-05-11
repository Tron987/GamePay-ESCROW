const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Import morgan
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a write stream (in append mode) for logging to a file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), // Log file name
  { flags: 'a' } // Append mode
);

// Use morgan to log requests to the console and save them to the file
app.use(morgan('combined', { stream: accessLogStream })); // Logs to file
app.use(morgan('dev')); // Logs to console

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
