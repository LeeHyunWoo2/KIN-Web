const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 작성자 참조
    required: true,
  },
  category: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // 카테고리가 없는 경우 null
    },
    name: {
      type: String,
      default: '', // 카테고리 이름이 없는 경우 빈 문자열
    },
  },
  tags: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      }
    ],
    default: [], // 태그가 없는 경우 빈 배열
  },
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