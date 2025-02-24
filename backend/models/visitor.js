const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true
  },
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: "KR"
  },
  device: {
    type: String
  },
  browser: {
    type: String
  }, // 브라우저 정보
  createdAt: {
    type: Date,
    default: Date.now
  }, // 방문 시간
});

module.exports = mongoose.model('Visitor', visitorSchema);