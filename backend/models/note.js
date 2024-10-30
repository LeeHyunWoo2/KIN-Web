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
      name: String // 태그 이름 (최대 5개)
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
  }
});

// 태그는 최대 5개까지만 허용
NoteSchema.path('tags').validate(function (value) {
  return value.length <= 5;
}, '최대 5개의 태그만 허용됩니다.');

module.exports = mongoose.model('Note', NoteSchema);
