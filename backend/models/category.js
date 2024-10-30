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
    unique: true, // 사용자 별로 카테고리 이름은 고유해야 함
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

module.exports = mongoose.model('Category', CategorySchema);