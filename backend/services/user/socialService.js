const User = require('../../models/user');
const axios = require('axios');
const tokenService = require('./tokenService');

// 소셜 계정 연동 해제 함수 개선
const unlinkAccount = async (userId, provider) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 마지막 소셜 계정 연동 해제 방지
    const socialAccounts = user.socialAccounts.filter(acc => acc.provider !== provider);
    if (socialAccounts.length === 0 && !user.password) {
      throw new Error('최소 하나의 로그인 수단이 필요합니다.');
    }

    // OAuth 토큰으로 소셜 플랫폼 연동 해제 요청
    const oauthToken = await tokenService.generateOAuthToken(user, provider);
    await revokeSocialAccess(provider, oauthToken);

    // DB에서 소셜 계정 정보 제거
    user.socialAccounts = socialAccounts;
    await user.save();

    return user;
  } catch (error) {
    console.error('소셜 계정 연동 해제 실패:', error);
    throw error;
  }
};

// 소셜 플랫폼 연동 해제 요청 함수
const revokeSocialAccess = async (provider, token) => {
  try {
    if (provider === 'google') {
      await axios.post(`https://oauth2.googleapis.com/revoke?token=${token}`);
    } else if (provider === 'kakao') {
      await axios.post('https://kapi.kakao.com/v1/user/unlink', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else if (provider === 'naver') {
      await axios.post('https://nid.naver.com/oauth2.0/token', null, {
        params: {
          grant_type: 'delete',
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          access_token: token
        }
      });
    }
  } catch (error) {
    console.error(`${provider} 연동 해제 요청 실패:`, error);
    throw error;
  }
};

module.exports = {
  unlinkAccount,
  revokeSocialAccess,
};
