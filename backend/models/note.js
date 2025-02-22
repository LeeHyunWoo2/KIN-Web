const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: Buffer, // 바이너리 데이터를 저장하는 Buffer 타입 필드
    default: Buffer.alloc(0), // 빈 Buffer 를 기본값으로 설정
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 작성자 참조
    required: true,
  },
  uploadedFiles:{
    type:[String],
    default:[],
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
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tag',
        },
        name: {
          type: String,
        }
      }
    ],
    default: [], // 태그가 없는 경우 빈 배열
  },
  mode: {
    type: String,
    enum: ["editor", "text"],
    default: "editor", // 기본값 에디터 모드
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
}, {
  versionKey: false // __v 필드 비활성화
});

module.exports = mongoose.model('Note', NoteSchema);