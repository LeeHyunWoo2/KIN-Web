// 실제 비즈니스 로직을 처리, DB와 상호작용하는 파일


const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 회원가입
const registerUser = async (userData) => {
  const { name, email, password, provider } = userData;

  // 비밀번호 해시 처리
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 새로운 사용자 생성
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    provider,
  });

  return await newUser.save();
};

// 로그인
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

// 전체 공개용 회원 정보 조회
const getPublicUserProfile = async (userId) => {
  return User.findById(userId).select('name email profileIcon'); // 전체 공개 필드만 선택
};

// 회원 정보 조회
const getUserProfile = async (userId) => {
  return User.findById(userId).select('-password -refreshToken');
};

// 정보 수정
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const { name, newPassword } = updateData;

  if (name) {
    user.name = name;
  }

  if (newPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  await user.save();
  return user;
};


// 유저가 직접 프사를 바꾸려고 할때 쓰는 로직, 소셜 가입할때는 자동처리됨
const updateUserProfileIcon = async (userId, profileIconUrl) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 프로필 아이콘 URL 업데이트
  user.profileIcon = profileIconUrl;

  await user.save();
  return user;
};


// 탈퇴
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await user.remove();
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getPublicUserProfile,
  updateUserProfile,
  deleteUser,
  updateUserProfileIcon,
};
