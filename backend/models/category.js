const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 사용자 참조
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId, // 상위 카테고리
    ref: 'Category',
    required: false,
  }
});

// 복합 인덱스 설정 각 사용자마다 카테고리 이름이 고유하도록 설정 (타 사용자간의 중복은 허용)
CategorySchema.index({ user_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
