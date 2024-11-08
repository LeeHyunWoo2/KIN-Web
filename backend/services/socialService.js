const User = require('../models/user');
const axios = require('axios');
const tokenService = require('./tokenService');

// 소셜 계정 연동 해제
const unlinkAccount = async (userId, provider) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const accountIndex = user.socialAccounts.findIndex(account => account.provider === provider);
  if (accountIndex === -1) {
    throw new Error(`${provider} 계정이 연동되어 있지 않습니다.`);
  }

  const oAuthToken = await tokenService.generateOAuthToken(user, provider);
  const unlinkSuccess = await revokeSocialAccess(provider, oAuthToken);

  if (!unlinkSuccess) {
    throw new Error(`${provider} 계정 연동 해제에 실패했습니다.`);
  }

  user.socialAccounts.splice(accountIndex, 1);
  await user.save();
};

// 소셜 플랫폼에 연동 해제 요청
const revokeSocialAccess = async (provider, accessToken) => {
  try {
    if (provider === 'google') {
      await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`);
    } else if (provider === 'kakao') {
      await axios.post('https://kapi.kakao.com/v1/user/unlink', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } else if (provider === 'naver') {
      await axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
          grant_type: 'delete',
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          access_token: accessToken,
          service_provider: 'NAVER',
        },
      });
    }
    return true;
  } catch (error) {
    console.error(`${provider} 연동 해제 오류:`, error);
    return false;
  }
};

module.exports = {
  unlinkAccount,
  revokeSocialAccess,
};
