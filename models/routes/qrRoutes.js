// ─────────────────────────────────────────────
//  routes/qrRoutes.js
//  All API endpoints for NayaQR
// ─────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const QRCode  = require('../models/QRCode');

// ──────────────────────────────────────────────
//  POST /create
//  Save a new QR code record into MongoDB
// ──────────────────────────────────────────────
router.post('/create', async (req, res) => {
  try {
    const { title, originalLink, fileUrl, qrCodeUrl, type } = req.body;

    // Basic validation
    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title and type are required fields.',
      });
    }

    // Create and save the new document
    const newQR = await QRCode.create({
      title,
      originalLink,
      fileUrl,
      qrCodeUrl,
      type,
    });

    res.status(201).json({
      success: true,
      message: 'QR Code saved successfully!',
      data: newQR,
    });
  } catch (error) {
    console.error('POST /create error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while saving QR code.',
      error: error.message,
    });
  }
});

// ──────────────────────────────────────────────
//  GET /all
//  Fetch all QR code records (newest first)
// ──────────────────────────────────────────────
router.get('/all', async (req, res) => {
  try {
    // Optional: filter by type via query param → GET /all?type=link
    const filter = req.query.type ? { type: req.query.type } : {};

    const allQRCodes = await QRCode.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allQRCodes.length,
      data: allQRCodes,
    });
  } catch (error) {
    console.error('GET /all error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching QR codes.',
      error: error.message,
    });
  }
});

// ──────────────────────────────────────────────
//  GET /single/:id
//  Fetch one QR code record by its MongoDB ID
// ──────────────────────────────────────────────
router.get('/single/:id', async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found with that ID.',
      });
    }

    res.status(200).json({
      success: true,
      data: qrCode,
    });
  } catch (error) {
    console.error('GET /single/:id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching QR code.',
      error: error.message,
    });
  }
});

// ──────────────────────────────────────────────
//  PUT /scan/:id
//  Increment scanCount by 1 each time QR is scanned
// ──────────────────────────────────────────────
router.put('/scan/:id', async (req, res) => {
  try {
    const updated = await QRCode.findByIdAndUpdate(
      req.params.id,
      { $inc: { scanCount: 1 } }, // atomic increment — safe for concurrent scans
      { new: true }               // return the updated document
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found with that ID.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scan count updated!',
      data: updated,
    });
  } catch (error) {
    console.error('PUT /scan/:id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating scan count.',
      error: error.message,
    });
  }
});

// ──────────────────────────────────────────────
//  DELETE /delete/:id
//  Permanently remove a QR code record
// ──────────────────────────────────────────────
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await QRCode.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found with that ID.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'QR Code deleted successfully.',
      data: deleted,
    });
  } catch (error) {
    console.error('DELETE /delete/:id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting QR code.',
      error: error.message,
    });
  }
});

module.exports = router;