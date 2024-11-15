const axios = require('axios');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION, REFRESH_TOKEN_SECRET, REFRESH_EXPIRATION } = process.env;

// 1. JWT와 리프레시 토큰 발급
const generateTokens = (user) => {
  const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
  );

  const refreshToken = jwt.sign(
      { id: user._id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_EXPIRATION }
  );

  return { accessToken, refreshToken };
};

// 2. JWT 검증
const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null; // 유효하지 않은 토큰일 경우 null 반환
  }
};

// 3. 리프레시 토큰 검증
const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw new Error;
  }
};

// 4. OAuth 토큰 발급 (소셜 연동 해제 시 사용)
const generateOAuthToken = async (user, provider) => {
  const socialAccount = user.socialAccounts.find(account => account.provider === provider);
  if (!socialAccount) {
    throw new Error;
  }

  try {
    // 소셜 플랫폼별로 OAuth 토큰 발급 요청
    if (provider === 'google') {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: socialAccount.socialRefreshToken,
        grant_type: 'refresh_token',
      });
      return response.data.access_token;

    } else if (provider === 'kakao') {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.KAKAO_CLIENT_ID,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
          refresh_token: socialAccount.socialRefreshToken,
        },
      });
      return response.data.access_token;

    } else if (provider === 'naver') {
      const response = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          refresh_token: socialAccount.socialRefreshToken,
        },
      });
      return response.data.access_token;

    } else {
      throw new Error();
    }

  } catch (error) {
    throw new Error;
  }
};


module.exports = {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  generateOAuthToken,
};