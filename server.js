// ─────────────────────────────────────────────
//  server.js
//  NayaQR — Express + MongoDB Atlas Backend
// ─────────────────────────────────────────────

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');

// Load environment variables from .env file
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
//  MIDDLEWARE
// ──────────────────────────────────────────────

// Allow cross-origin requests (so your frontend HTML can talk to this server)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data (for HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the /public folder
app.use(express.static(path.join(__dirname, 'public')));

// ──────────────────────────────────────────────
//  MONGODB CONNECTION
// ──────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'NayaQR_DB', // Explicitly targets this database inside your Atlas cluster
    });
    console.log('✅ MongoDB Atlas connected → NayaQR_DB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

connectDB();

// ──────────────────────────────────────────────
//  API ROUTES
// ──────────────────────────────────────────────

// Mount all QR code API routes under /api
app.use('/api', require('./routes/qrRoutes'));

// Health check route — useful for checking if server is running
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NayaQR server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Serve the frontend for any other GET request (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ──────────────────────────────────────────────
//  ERROR HANDLER (catches any unhandled errors)
// ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  });
});

// ──────────────────────────────────────────────
//  START SERVER
// ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 NayaQR server running at http://localhost:${PORT}`);
  console.log(`📡 API base URL: http://localhost:${PORT}/api`);
});