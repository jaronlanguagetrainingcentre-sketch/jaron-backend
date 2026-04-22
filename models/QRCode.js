// ─────────────────────────────────────────────
//  models/QRCode.js
//  Mongoose schema for NayaQR_DB → qrcodes
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
  {
    // Human-readable title for this QR entry
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // The original URL or link the QR encodes
    originalLink: {
      type: String,
      trim: true,
      default: '',
    },

    // Cloud storage URL of the uploaded file (image / video / pdf / etc.)
    fileUrl: {
      type: String,
      trim: true,
      default: '',
    },

    // URL of the generated QR code image stored on cloud / CDN
    qrCodeUrl: {
      type: String,
      trim: true,
      default: '',
    },

    // What kind of content this QR points to
    type: {
      type: String,
      enum: ['link', 'image', 'video', 'pdf', 'text', 'file'],
      required: [true, 'Type is required'],
      default: 'link',
    },

    // How many times this QR code has been scanned
    scanCount: {
      type: Number,
      default: 0,
      min: [0, 'Scan count cannot be negative'],
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Index for faster queries on type and creation date
qrCodeSchema.index({ type: 1 });
qrCodeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('QRCode', qrCodeSchema);