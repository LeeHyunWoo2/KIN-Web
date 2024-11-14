const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 태그 소유자 참조
    required: true,
  },
});
module.exports = mongoose.model('Tag', TagSchema);