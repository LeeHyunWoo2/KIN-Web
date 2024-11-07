// 사용자 정보 조회, 수정, 삭제(탈퇴) 처리를 담당하는 컨트롤러

const User = require('../models/user');
const tokenService = require('../services/tokenService');
const axios = require('axios');

// 소셜 계정 연동 해제
const unlinkSocialAccount = async (req, res) => {
  console.log('연동 해제 로직 시작')
  const { provider } = req.body;
  const userId = req.user.id; // JWT에서 가져온 사용자 ID

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 연동된 계정이 있는지 확인
    const accountIndex = user.socialAccounts.findIndex(account => account.provider === provider);
    if (accountIndex === -1) {
      return res.status(400).json({ message: `${provider} 계정이 연동되어 있지 않습니다.` });
    }

    // OAuth 토큰 발급 (연동 해제용)
    const oAuthToken = await tokenService.generateOAuthToken(user, provider);

    // 소셜 플랫폼 해제 요청
    const unlinkSuccess = await revokeSocialAccess(provider, oAuthToken);
    console.log(oAuthToken)

    if (!unlinkSuccess) {
      return res.status(500).json({ message: `${provider} 계정 연동 해제에 실패했습니다.` });
    }

    // 연동 정보 삭제 후 사용자 저장
    user.socialAccounts.splice(accountIndex, 1);
    await user.save();
    res.status(200).json({ message: `${provider} 계정이 성공적으로 연동 해제되었습니다.` });
  } catch (error) {
    res.status(500).json({ message: '소셜 계정 연동 해제 중 오류가 발생했습니다.', error: error.message });
  }
};

// 소셜 연동 해제 API 호출 함수
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
  unlinkSocialAccount,
  revokeSocialAccess,
};

/*socialController.js 파일은 소셜 계정 연동 및 연동 해제 관련 기능을 담당합니다. 소셜 계정을 로컬 계정에 추가로 연동하거나, 기존 연동된 소셜 계정을 해제하는 역할을 합니다.

연동 해제 시에는 OAuth 토큰을 단발적으로 발급받아 소셜 플랫폼의 연동 해제 API에 요청한 후 토큰을 폐기합니다.

 6번 작업: socialController.js 파일 구성

 구현할 주요 기능
1. 소셜 계정 추가 연동: 사용자가 소셜 계정을 로컬 계정에 연동할 수 있도록 설정합니다.
2. 소셜 계정 연동 해제: 연동된 소셜 계정을 해제하고, 소셜 플랫폼의 연동 해제 API를 호출합니다.

 기능 설명

1. 소셜 계정 추가 연동 (linkSocialAccount)
   - req.user.id를 통해 JWT로부터 사용자 ID를 가져와, 로컬 계정에 소셜 계정을 연동합니다.
   - 소셜 계정이 user.socialAccounts에 추가되고, 사용자 정보를 업데이트하여 연동을 완료합니다.

2. 소셜 계정 연동 해제 (unlinkSocialAccount)
   - 연동 해제를 위해 provider에 맞는 OAuth 토큰을 tokenService에서 발급받아, 각 소셜 플랫폼의 API에 연동 해제 요청을 보냅니다.
   - revokeSocialAccess 함수에서 Google, Kakao, Naver의 연동 해제 API를 호출하여 해당 계정의 연동을 해제하고, 성공적으로 해제되면 사용자 데이터베이스에서 해당 소셜 계정 정보를 삭제합니다.

 추가 설명
- OAuth 토큰 발급: 연동 해제 시 필요한 OAuth 토큰은 tokenService에서 발급받아, 각 플랫폼 API에 단발성으로 사용됩니다.
- 소셜 연동 해제 API: 각 소셜 플랫폼별로 API URL이 다르므로 provider에 따라 올바른 URL을 호출하도록 합니다.

이제 socialController.js에서 소셜 계정의 추가 연동 및 연동 해제 기능을 완성할 수 있습니다.*/