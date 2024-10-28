const mongoose = require('mongoose');

const SocialAccountSchema = new mongoose.Schema({
  provider: {
    type: String, // 'google', 'facebook', 'github' 등 소셜 로그인 제공자
    required: true,
  },
  providerId: {
    type: String, // 소셜 로그인 제공자의 고유 ID
    required: true,
  },
});

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
    type: String,
    required: false, // 소셜 로그인 사용자는 비밀번호가 없을 수 있음
  },
  phone: {
    type: String,
    required: false, // 선택사항
  },
  termsAgreed: {
    type: Boolean,
    required: true, // 이용 약관 동의는 필수
  },
  marketingConsent: {
    type: Boolean,
    required: false,
    default: false,
  },
  socialAccounts: [SocialAccountSchema], // 여러 소셜 계정을 연결할 수 있는 배열
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  refreshToken: { // 발급된 Refresh Token을 저장
    type: String,  // 로그인 시 발급되므로 초기에는 없음
    required: false,
  },
  otpEnabled: {
    type: Boolean,
    default: false,
  },
  otpSecret: {
    type: String, // OTP 설정 시 사용되는 비밀키
    required: false,
  },
  createdAt: {
    type: Date, // 유저 생성 시 자동으로 현재 시간 저장
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);