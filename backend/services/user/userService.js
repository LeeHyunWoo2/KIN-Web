const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const tokenService = require('./tokenService');
const { revokeSocialAccess } = require('./socialService'); // 연동 해제를 위한 서비스 호출

// 1. 사용자 정보 조회
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return user;
};

// 2. 사용자 정보 수정
const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  if (updateData.name) user.name = updateData.name;
  if (updateData.profileIcon) user.profileIcon = updateData.profileIcon;
  await user.save();
  return user;
};

// 3. 로컬 계정 추가 (소셜 Only 계정용)
const addLocalAccount = async (userId, id, email, password) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  if (user.socialAccounts.some(account => account.provider === 'local')) {
    throw new Error('이미 로컬 계정이 등록되어 있습니다.');
  }

  user.id = id;
  user.email = email;
  user.password = await bcrypt.hash(password, 10);
  user.socialAccounts.push({ provider: 'local', providerId: id });
  await user.save();
};

// 4. 회원 탈퇴
const deleteUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  for (const account of user.socialAccounts) {
    if (account.provider !== 'local') {
      const accessToken = await tokenService.generateOAuthToken(user, account.provider);
      await revokeSocialAccess(account.provider, accessToken);
    }
  }

  await User.findByIdAndDelete(userId);
};

module.exports = {
  getUserById,
  updateUser,
  addLocalAccount,
  deleteUserById,
};