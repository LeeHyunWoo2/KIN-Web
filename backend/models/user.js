const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // 일반 사용자는 필수, 소셜 로그인 사용자는 null 따라서 백, 프론트에서 별도의 로직 필요
    required: false,
  },
  provider: {
    type: String, // 'local' (일반 가입), 'google', 'facebook' 등
    required: true,
  },
  providerId: {
    type: String, // 유저 소셜계정 고유 ID
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
