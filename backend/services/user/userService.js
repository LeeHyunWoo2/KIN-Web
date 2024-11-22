const User = require('../../models/user');
const Note = require('../../models/note');
const Category = require('../../models/category');
const Tag = require('../../models/tag');
const bcrypt = require('bcryptjs');
const tokenService = require('./tokenService');
const { revokeSocialAccess } = require('./socialService'); // 연동 해제를 위한 서비스 호출

// 1. 사용자 정보 조회
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error;
  }
  return user;
};

// 2. 사용자 정보 수정
const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error;
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
    throw new Error;
  }
  if (user.socialAccounts.some(account => account.provider === 'local')) {
    const error = new Error("이미 로컬 계정이 등록되어 있습니다.");
    error.status = 400;
    throw error;
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
  console.log(user)
  if (!user) {
    throw new Error;
  }

  for (const account of user.socialAccounts) {
    if (account.provider !== 'local') {
      console.log('아오')
      console.log(account.provider)
      const accessToken = await tokenService.generateOAuthToken(user, account.provider);
      await revokeSocialAccess(account.provider, accessToken);
    }
  }

    await Tag.deleteMany({ user_id: userId });
  console.log('태그삭제')
    await Category.deleteMany({ user_id: userId });
  console.log('카테고리삭제')
  await Note.deleteMany({ user_id: userId });
  console.log('노트삭제')
  await User.findByIdAndDelete(userId);
  console.log('탈퇴')

};

module.exports = {
  getUserById,
  updateUser,
  addLocalAccount,
  deleteUserById,
};