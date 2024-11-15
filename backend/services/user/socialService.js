const User = require('../../models/user');
const axios = require('axios');
const tokenService = require('./tokenService');

// 소셜 계정 연동 해제 함수
const unlinkAccount = async (userId, provider) => {
  try {
    // 사용자 조회
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('사용자를 찾을 수 없습니다.');
      error.status = 404; // 상태 코드 설정
      throw error;
    }

    // 마지막 소셜 계정 연동 해제 방지
    const socialAccounts = user.socialAccounts.filter(acc => acc.provider !== provider);
    if (socialAccounts.length === 0 && !user.password) {
      const error = new Error("마지막 계정은 해제할 수 없습니다. 로컬 계정을 먼저 추가해 주세요.");
      error.status = 400;
      throw error;
    }

    // OAuth 토큰 생성 및 소셜 플랫폼 연동 해제 요청
    const oauthToken = await tokenService.generateOAuthToken(user, provider);
    await revokeSocialAccess(provider, oauthToken);

    // DB에서 소셜 계정 정보 제거
    user.socialAccounts = socialAccounts;
    await user.save();

    return user;
  } catch (error) {
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
    throw error;
  }
};

module.exports = {
  unlinkAccount,
  revokeSocialAccess,
};
