// models/Status.js
//m

const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  message: { type: String, required: true },
  emoji: { type: String },
  location: {
    latitude: Number,
    longitude: Number,
  },
  views: [
    {
      userId: { type: String }, // 조회한 사용자 (optional)
      timestamp: { type: Date, default: Date.now },
    }
  ],
  reactions: {
    like: { type: Number, default: 0 },     // ❤️
    laugh: { type: Number, default: 0 },    // ㅋ
    sad: { type: Number, default: 0 },      // ㅠ
    thumsup: { type: Number, default: 0 },  // 👍
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Status', statusSchema);