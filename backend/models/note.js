const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '새 노트',
  },
  content: {
    type: String,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 작성자 참조
    required: true,
  },
  category: {
    _id: mongoose.Schema.Types.ObjectId, // 카테고리 ID
    name: String,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,  // 전역 태그 ID
      ref: 'Tag',
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
  is_locked: {
    type: Boolean,
    default: false,
  },
  is_pinned: {
    type: Boolean,
    default: false,
  },
  is_trashed: {
    type: Boolean,
    default:false,
  },
  trashedAt: {
    type:Date,
    default: null,
  }
});

module.exports = mongoose.model('Note', NoteSchema);