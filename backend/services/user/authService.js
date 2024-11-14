const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const tokenService = require('./tokenService');

// 1. 회원가입 (로컬 계정 생성)
const registerUser = async ({ id, email, password, name, phone, marketingConsent }) => {
  // 기존 사용자 중복 확인
  const existingUser = await User.findOne({ $or: [{ email }, { id }] });
  if (existingUser) {
    const error = new Error("이미 사용 중인 이메일 혹은 ID입니다.");
    error.status = 400;
    throw error;
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 사용자 생성
  const user = new User({
    id,
    email,
    password: hashedPassword,
    name,
    phone,
    marketingConsent,
    socialAccounts: [
      {
        provider: 'local',
        providerId: id,
      },
    ],
    termsAgreed: true,
  });

  await user.save();
  return user;
};

// 2. 로그인 검증
const loginUser = async (id, password) => {

  // 사용자 확인
  const user = await User.findOne({ id });
  const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !isPasswordValid) {
    const error = new Error("ID 또는 비밀번호가 일치하지 않습니다.");
    error.status = 400;
    throw error;
  }

  // 로그인 성공 시 토큰 발급
  const tokens = tokenService.generateTokens(user);
  return { user, tokens };
};

// 3. 사용자 정보 조회 (토큰 갱신용)
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error;
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};