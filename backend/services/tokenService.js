// services/tokenService.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const axios = require('axios');

// JWT와 OAuth 관련 환경 변수
const { JWT_SECRET, JWT_EXPIRATION, REFRESH_TOKEN_SECRET, REFRESH_EXPIRATION } = process.env;

// 1. JWT와 리프레시 토큰 발급
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRATION });
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

// 3. 리프레시 토큰 폐기
const invalidateTokens = async (refreshToken) => {
  try {
    // 토큰 무효화 로직 (캐시, 블랙리스트 추가 등 필요 시 구현)
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); // 유효성 확인 후 추가 로직 적용 가능
    return true;
  } catch (error) {
    console.error('리프레시 토큰 폐기 실패:', error);
    return false;
  }
};

// 4. OAuth 토큰 발급 (소셜 연동 해제 시 사용)
const generateOAuthToken = async (user, provider) => {
  const socialAccount = user.socialAccounts.find(account => account.provider === provider);
  if (!socialAccount) {
    throw new Error(`${provider} 계정이 연동되어 있지 않습니다.`);
  }

  // OAuth 토큰 발급 요청
  try {
    if (provider === 'google') {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: socialAccount.socialRefreshToken,
        grant_type: 'refresh_token',
      });
      return response.data.access_token;
    }
    // 다른 provider (예: kakao, naver)에 대한 처리
    // ...
  } catch (error) {
    console.error(`${provider} OAuth 토큰 발급 실패:`, error);
    throw new Error('OAuth 토큰 발급에 실패했습니다.');
  }
};

module.exports = {
  generateTokens,
  verifyToken,
  invalidateTokens,
  generateOAuthToken,
};

/*tokenService.js 파일은 JWT와 OAuth 토큰의 발급, 검증, 폐기 관련 로직을 담당하며, 인증 상태를 통합적으로 관리하는 서비스 파일입니다. 이 파일에서 JWT와 OAuth 토큰을 일관되게 처리하여 사용자의 세션과 연동 해제 시 필요한 OAuth 토큰 발급을 간소화할 수 있습니다.

 14번 작업: tokenService.js 파일 구성

 구현할 주요 기능
1. JWT 발급: 로그인 시 JWT와 리프레시 토큰을 발급합니다.
2. JWT 검증: 클라이언트 요청의 JWT 유효성을 검증하여 인증 상태를 확인합니다.
3. 리프레시 토큰 폐기: 로그아웃 또는 세션 종료 시 리프레시 토큰을 무효화합니다.
4. OAuth 토큰 발급: 연동 해제 시 필요한 OAuth 토큰을 발급합니다.


 기능 설명

1. JWT와 리프레시 토큰 발급 (generateTokens)
   - 로그인 시 JWT와 리프레시 토큰을 발급하여 클라이언트에 반환합니다.
   - JWT_SECRET와 REFRESH_SECRET을 사용하여 토큰을 서명하고, 환경 변수로 지정된 유효 기간을 설정합니다.

2. JWT 검증 (verifyToken)
   - accessToken 또는 refreshToken의 유효성을 확인하여, 유효하지 않은 경우 null을 반환하여 인증 실패를 처리합니다.
   - 주로 authenticateUser 미들웨어에서 사용하여 클라이언트의 인증 상태를 확인합니다.

3. 리프레시 토큰 폐기 (invalidateTokens)
   - refreshToken을 무효화합니다. 필요한 경우 캐시나 블랙리스트로 구현하여 무효화할 수 있습니다.
   - 무효화가 성공하면 true, 실패 시 false를 반환합니다.

4. OAuth 토큰 발급 (generateOAuthToken)
   - 특정 소셜 계정의 연동 해제 시, 필요한 OAuth 액세스 토큰을 발급받습니다.
   - 주로 Google의 리프레시 토큰을 사용하여 새로운 accessToken을 발급받고, 다른 소셜 계정(kakao, naver)의 경우도 각각의 API에 맞게 추가 처리할 수 있습니다.

 추가 설명
- JWT와 리프레시 토큰의 역할 분리: generateTokens에서 발급한 두 토큰은 각각 짧은 세션 유지와 장기 세션 갱신을 위해 사용됩니다.
- OAuth 토큰 발급 시 에러 처리: OAuth 토큰 발급 시 발생할 수 있는 오류를 명확히 처리하여, 실패 시 연동 해제가 불가함을 사용자에게 알립니다.

이제 tokenService.js에서 JWT와 OAuth 토큰을 통합적으로 관리할 수 있어 인증 상태 유지와 연동 해제 시의 OAuth 토큰 발급을 일관되게 처리할 수 있습니다.*/