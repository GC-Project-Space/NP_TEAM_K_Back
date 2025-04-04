// models/Status.js

const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  message: { type: String, required: true },
  emoji: { type: String },
  location: {
    latitude: Number,
    longitude: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Status', statusSchema);