const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const tokenService = require('./tokenService');

// 회원가입 (로컬 계정)
const registerUser = async ({ username, email, password, name, phone, marketingConsent }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error("이미 사용 중인 이메일 혹은 ID입니다.");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    name,
    phone,
    marketingConsent,
    socialAccounts: [
      {
        provider: 'local',
        providerId: username,
      },
    ],
    termsAgreed: true,
  });

  await user.save();

  return user;
};

const loginUser = async (username, password, rememberMe) => {

  const user = await User.findOne({ username });
  const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !isPasswordValid) {
    const error = new Error("ID 또는 비밀번호가 일치하지 않습니다.");
    error.status = 400;
    throw error;
  }

  const tokens = await tokenService.generateTokens(user, rememberMe);
  return { user, tokens };
};

// 사용자 정보 조회 (토큰 갱신용)
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