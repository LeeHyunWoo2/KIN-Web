// 실제 비즈니스 로직을 처리, DB와 상호작용하는 파일

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 회원가입
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // 비밀번호 해시 처리
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 새로운 사용자 생성
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    socialAccounts: [
      {
        provider: 'local',
        providerId: email, // 로컬 로그인에서는 이메일을 고유 ID처럼 사용
      },
    ],
  });

  return await newUser.save();
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('해당 유저 정보가 없습니다.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('비밀번호를 틀렸습니다.');
  }

  // Access Token 및 Refresh Token 생성
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  // Refresh Token을 DB에 저장
  user.refreshToken = refreshToken;
  await user.save();

  // 사용자 정보 및 토큰 반환
  return {
    user: {
      name: user.name,
      email: user.email,
      profileIcon: user.profileIcon,
    },
    accessToken,
    refreshToken
  };
};


// 회원 정보 조회
const getUserProfile = async (userId) => {
  return User.findById(userId).select('-password -refreshToken');
};

// 정보 수정
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('해당 유저 정보가 없습니다.');
  }

  // 비밀번호 처리
  if (updateData.newPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(updateData.newPassword, salt);
    delete updateData.newPassword; // 비밀번호는 따로 처리했으므로 삭제 (혹시나 나중에 일괄수정 기능 만들게 될거 대비해서)
  }

  // 나머지 필드 업데이트 (동적 할당)
  Object.assign(user, updateData);

  await user.save();
  return user;
};

// 탈퇴
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('해당 유저 정보가 없습니다.');
  }
  await user.remove();
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};