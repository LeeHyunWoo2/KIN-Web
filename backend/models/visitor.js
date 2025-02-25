const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true
  },
  ipHistory: [
    {
      ip: {
        type: String,
        required: true
      },
      changedAt: {
        type: Date,
        default: Date.now
      }, // IP 변경 시점
    }
  ],
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
  visitCount: {
    type: Number,
    default: 1
  }, // 방문 횟수
  lastVisit: {
    type: Date,
    default: Date.now
  }, // 마지막 방문 시간
  createdAt: {
    type: Date,
    default: Date.now
  }, // 방문 시간
});

module.exports = mongoose.model('Visitor', visitorSchema);