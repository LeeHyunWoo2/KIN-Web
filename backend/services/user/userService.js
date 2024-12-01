const User = require('../../models/user');
const Note = require('../../models/note');
const Category = require('../../models/category');
const Tag = require('../../models/tag');
const bcrypt = require('bcryptjs');
const tokenService = require('./tokenService');
const { revokeSocialAccess } = require('./socialService'); // 연동 해제를 위한 서비스 호출
const redisClient = require('../../config/redis');


// 1. 사용자 공개 데이터 조회
const getUserPublicProfile = async (userId) => {
  try {
    // Redis에서 프로필 정보 조회
    const cachedProfile = await redisClient.get(`publicProfile:${userId}`);
    if (cachedProfile) {
      return JSON.parse(cachedProfile);
    }

    // Redis에 없을 경우 DB에서 조회
    const user = await User.findById(userId).select('name email profileIcon');
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const publicProfile = {
      name: user.name,
      email: user.email,
      profileIcon: user.profileIcon,
      userId: userId,
    };

    // Redis에 프로필 정보 저장 (TTL: 1시간)
    await redisClient.set(
        `publicProfile:${userId}`,
        JSON.stringify(publicProfile),
        'EX',
        3600 // 1시간
    );

    return publicProfile;
  } catch (error) {
    console.error('프로필 정보 처리 중 오류:', error.message);
    throw error;
  }
};

// 2. 사용자 정보 조회
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error;
  }
  return user;
};

// 3. 사용자 정보 수정
const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error;
    }
    // 변경사항이 있는 항목은 db에 업데이트
    if (updateData.name) user.name = updateData.name;
    if (updateData.profileIcon) user.profileIcon = updateData.profileIcon;
    await user.save();

    // redis에서 유저 정보 ttl 로드
    const redisKey = `publicProfile:${userId}`;
    const ttl = await redisClient.ttl(redisKey);

    // redis 기존 데이터 로드
    const cachedProfile = await redisClient.get(redisKey);
    let updatedProfile = {}; // 업데이트용 빈객체

    if (cachedProfile) {
      // 기존 데이터가 있으면 병합
      const parsedProfile = JSON.parse(cachedProfile);
      updatedProfile = {
        ...parsedProfile,
        name: updateData.name || parsedProfile.name,
        profileIcon: updateData.profileIcon || parsedProfile.profileIcon,
      };
    } else {
      // 기존 데이터가 없으면 생성 (절묘하게 ttl 만기될수도 있기 때문에)
      updatedProfile = {
        name: user.name,
        email: user.email,
        profileIcon: user.profileIcon,
      };
    }

    // Redis에 수정된 데이터 저장 (기존 TTL 유지)
    await redisClient.set(redisKey, JSON.stringify(updatedProfile));
    if (ttl > 0) {
      await redisClient.expire(redisKey, ttl);
    }

    return updatedProfile;
  } catch (error) {
    console.error('사용자 정보 수정 중 오류:', error.message);
    throw error;
  }
};

// 4. 로컬 계정 추가 (소셜 Only 계정용)
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

// 5. 회원 탈퇴
const deleteUserById = async (userId) => {
  const user = await User.findById(userId);
  console.log(user)
  if (!user) {
    throw new Error;
  }

  for (const account of user.socialAccounts) {
    if (account.provider !== 'local') {
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
  getUserPublicProfile,
  getUserById,
  updateUser,
  addLocalAccount,
  deleteUserById,
};