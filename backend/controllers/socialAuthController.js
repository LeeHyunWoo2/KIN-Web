const User = require('../models/user');
const axios = require('axios');

// 소셜 계정 연동 추가
const linkSocialAccount = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 이미 연동된 소셜 계정만 확인하고, 중복된 경우 에러 반환
    const existingAccount = user.socialAccounts.find(account => account.provider === req.body.provider);
    if (existingAccount) {
      return res.status(400).json({ message: `${req.body.provider} 계정이 이미 연동되어 있습니다.` });
    }
    const frontendUrl = process.env.FRONTEND_URL
    res.redirect(`${frontendUrl}/userinfo`);
  } catch (error) {
    console.error('소셜 계정 연동 중 오류 발생:', error);
    res.status(500).json({ message: '소셜 계정 연동 중 오류가 발생했습니다.', error: error.message });
  }
};



// 소셜 연동 해제
const unlinkSocialAccount = async (req, res) => {
  const { provider } = req.body; // 소셜 제공자 정보
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 연동된 계정이 있는지 확인
    const accountIndex = user.socialAccounts.findIndex(account => account.provider === provider);
    if (accountIndex === -1) {
      return res.status(400).json({ message: `${provider} 계정이 연동되어 있지 않습니다.` });
    }

    // 소셜 플랫폼 연동 해제 요청
    const accessToken = req.user.accessToken; // 사용자의 소셜 플랫폼 토큰이 필요
    let unlinkSuccess = false;

    if (provider === 'google') {
      unlinkSuccess = await revokeGoogleAccess(accessToken);
    } else if (provider === 'kakao') {
      unlinkSuccess = await revokeKakaoAccess(accessToken);
    } else if (provider === 'naver') {
      unlinkSuccess = await revokeNaverAccess(accessToken);
    }

    if (!unlinkSuccess) {
      return res.status(500).json({ message: `${provider} 계정 연동 해제에 실패했습니다.` });
    }

    // 소셜 계정 정보 제거
    user.socialAccounts.splice(accountIndex, 1);
    await user.save();
    res.status(200).json({ message: `${provider} 계정이 성공적으로 연동 해제되었습니다.`, socialAccounts: user.socialAccounts });
  } catch (error) {
    console.error('소셜 계정 연동 해제 중 오류 발생:', error);
    res.status(500).json({ message: '소셜 계정 연동 해제 중 오류가 발생했습니다.', error: error.message });
  }
};

// 구글 연동 해제
const revokeGoogleAccess = async (accessToken) => {
  try {
    await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`);
    return true;
  } catch (error) {
    console.error('Google 연동 해제 오류:', error);
    return false;
  }
};

// 카카오 연동 해제
const revokeKakaoAccess = async (accessToken) => {
  try {
    await axios.post(
        'https://kapi.kakao.com/v1/user/unlink',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return true;
  } catch (error) {
    console.error('Kakao 연동 해제 오류:', error);
    return false;
  }
};

// 네이버 연동 해제
const revokeNaverAccess = async (accessToken) => {
  try {
    await axios.get(
        'https://nid.naver.com/oauth2.0/token',
        {
          params: {
            grant_type: 'delete',
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            access_token: accessToken,
            service_provider: 'NAVER',
          },
        }
    );
    return true;
  } catch (error) {
    console.error('Naver 연동 해제 오류:', error);
    return false;
  }
};


module.exports = {
  linkSocialAccount,
  unlinkSocialAccount,
};