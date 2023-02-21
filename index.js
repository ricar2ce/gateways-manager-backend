const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db/mongo');
// Import the necessary routes
const gatewayRoutes = require('./routes/gateways');

dotenv.config();

const app = express();

// Setting CORS
app.use(cors());

// Middleware to handle JSON requests
app.use(express.json());

// Routes for API Rest
app.use('/api/gateways', gatewayRoutes);

// Connect to the database
if (require.main === module) {
  connectToDatabase();
}

// Port in which the server will be executed
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app;
