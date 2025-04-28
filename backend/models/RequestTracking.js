// models/RequestTracking.js
const mongoose = require('mongoose');

const RequestTrackingSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true // For faster querying by time
  },
  endpoint: {
    type: String,
    trim: true
  },
  requestType: {
    type: String,
    enum: ['website', 'api'],
    required: true
  }
}, {
  timestamps: false, // We're using our own timestamp field
  autoIndex: true
});

// Index for faster time-based queries
RequestTrackingSchema.index({ timestamp: 1, requestType: 1 });

module.exports = mongoose.model('RequestTracking', RequestTrackingSchema);