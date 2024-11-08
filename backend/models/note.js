const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 작성자 참조
    required: true,
  },
  category: {
    _id: mongoose.Schema.Types.ObjectId, // 카테고리 ID
    name: String, // 카테고리 이름
  },
  tags: [
    {
      name: String // 태그 이름 (최대 5개로 제한 할 예정)
    }
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  is_archived: {
    type: Boolean,
    default: false,
  },
  is_pinned: {
    type: Boolean,
    default: false,
  },
  isTrashed: {
    type: Boolean,
    default:false,
  },
  trashedAt: {
    type:Date,
    default: null,
  }
});

module.exports = mongoose.model('Note', NoteSchema);
