const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false, // 소셜 유저가 로컬 등록을 안하면 id와 pw란이 비워져있어야함
    unique: true,
    sparse: true, // null 값은 무시함 (소셜 id 빈칸이 중복이라고 해서 추가)
  },
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
  passwordHistory: {
    type: [
      {
        password: {
          type: String,
          required: false,
        }, // 변경 전 비밀번호 저장
        changedAt: {
          type: Date,
          default: Date.now
        } // 변경 날짜
      }
    ],
    default: [],
  },
  termsAgreed: {
    type: Boolean,
    required: false, // 이용 약관 동의는 필수
  },
  marketingConsent: {
    type: Boolean,
    required: false,
    default: false,
  },
  socialAccounts: [
    { // 없으면 둘다 local로 저장됨
      provider: {
        type: String, // 'google', 'kakao', 'naver' 등 소셜 로그인 제공자
        required: true,
      },
      providerId: {
        type: String, // 소셜 로그인 제공자의 고유 ID
        required: true,
        unique: true,
      },
      socialRefreshToken: {
        type: String,
        required: false,
      }
    }
  ], // 여러 소셜 계정을 연결할 수 있는 배열
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profileIcon: { // 프로필 아이콘 url 혹은 선택한 아이콘 정보
    type: String,
    default: 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg'
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
  lastActivity: {
    type: Date,
    default: Date.now,
    required: false,
  }
}, {
  versionKey: false // __v 필드 비활성화
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);