const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // 유저별 태그 이름이 고유하도록 설정
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 태그 소유자 참조
    required: true,
  },
});

TagSchema.index({ user_id: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Tag', TagSchema);