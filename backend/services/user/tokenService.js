const axios = require('axios');
const redisClient = require('../../config/redis');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  JWT_EXPIRATION,
  REFRESH_TOKEN_SECRET,
  REFRESH_EXPIRATION,
  REMEMBER_REFRESH_EXPIRATION,
  RENEW_REFRESH_TTL_LIMIT,
  REMEMBER_RENEW_REFRESH_TTL_LIMIT
} = process.env;

// 1. JWT 토큰 발급
const generateTokens = async (user, rememberMe = false, existingTTL = null) => {

  let refreshTokenTTL;

  // 환경변수에서 TTL 로드
  const accessTokenTTL = parseInt(JWT_EXPIRATION, 10); // 3600초 = 1시간

  if(existingTTL){
    // TTL값을 받았을경우엔 기존의 TTL유지 (accessToken 갱신 로직)
    refreshTokenTTL = existingTTL;
  } else {
  // 일반 TTL 계산 로직 (로그인과 같은 경우)
  // 604800초 = 7일 or 2592000 = 30일 (로그인 기억하기)REFRESH_EXPIRATION
  refreshTokenTTL = parseInt(rememberMe ? REMEMBER_REFRESH_EXPIRATION : REFRESH_EXPIRATION, 10);
  }

  // 액세스 토큰 생성
  const accessToken = jwt.sign(
      {id: user._id, email: user.email, role: user.role},
      JWT_SECRET,
      {expiresIn: accessTokenTTL}
  );

  // 리프레시 토큰 생성
  const refreshToken = jwt.sign(
      {id: user._id},
      REFRESH_TOKEN_SECRET,
      {expiresIn: refreshTokenTTL}
  );

  // Redis에 리프레시 토큰 저장 (TTL은 JWT와 같은걸로)
  await saveRefreshTokenToRedis(user._id, refreshToken, refreshTokenTTL, rememberMe);

  return {accessToken, refreshToken, refreshTokenTTL};
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
    // JWT 검증
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    // Redis에서 확인
    const storedTokenString = await redisClient.get(`refreshToken:${userId}`);
    // 한줄로 통합하면 비동기함수(redisClient.get)가 객체를 내보냄
    // 하지만 JSON.parse는 문자열을 요구하기 때문에 오류발생
    const storedToken = JSON.parse(storedTokenString);

    // Redis에 저장된 토큰과 비교
    if (!storedToken.token || storedToken.token !== refreshToken) {
      throw new Error('유효하지 않은 Refresh Token입니다.');
    }

    // Redis의 TTL 확인
    let existingTokenTTL = await redisClient.ttl(`refreshToken:${userId}`);

    if (existingTokenTTL < 0) {
      throw new Error('리프레시 토큰 만료')

      // 자동로그인 유저의 리프레시 토큰의 만료가 3일 미만일경우
      // REMEMBER_RENEW_REFRESH_TTL_LIMIT = 259200초 = 3일
    } else if (storedToken.rememberMe && existingTokenTTL < REMEMBER_RENEW_REFRESH_TTL_LIMIT) {
      existingTokenTTL = REMEMBER_REFRESH_EXPIRATION;

      // 일반 로그인 유저의 만료가 3시간 미만일경우
      // RENEW_REFRESH_TTL_LIMIT = 10800초 = 3시간
    } else if (!storedToken.rememberMe && existingTokenTTL < RENEW_REFRESH_TTL_LIMIT) {
      existingTokenTTL = REFRESH_EXPIRATION;
    }

    const decodedData = {
      id: userId,
      rememberMe: storedToken.rememberMe,
      ttl: existingTokenTTL,
    };

    return decodedData; // 검증된 토큰 반환
  } catch (error) {
    console.error('Refresh Token 검증 실패:', error.message);
    const customError = new Error('세션이 만료되었습니다.');
    customError.status = 419;
    throw customError;
  }
};

// 4. OAuth 토큰 발급 (소셜 연동 해제 시 사용)
const generateOAuthToken = async (user, provider) => {
  const socialAccount = user.socialAccounts.find(
      account => account.provider === provider);
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
      const response = await axios.post('https://kauth.kakao.com/oauth/token',
          null, {
            params: {
              grant_type: 'refresh_token',
              client_id: process.env.KAKAO_CLIENT_ID,
              client_secret: process.env.KAKAO_CLIENT_SECRET,
              refresh_token: socialAccount.socialRefreshToken,
            },
          });
      return response.data.access_token;

    } else if (provider === 'naver') {
      const response = await axios.post('https://nid.naver.com/oauth2.0/token',
          null, {
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
    console.log(error)
    throw new Error;
  }
};

// 5. 메일인증용 토큰
const generateEmailVerificationToken = (email) => {
  return jwt.sign({email}, JWT_SECRET, {expiresIn: '10m'});
};

const verifyEmailVerificationToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

// redis 관련 로직
const saveRefreshTokenToRedis = async (userId, refreshToken, ttl, rememberMe) => {
  // 토큰에 rememberMe 여부를 함께 저장, 이후 갱신할때 활용
  try {
    await redisClient.set(
        `refreshToken:${userId}`, // ${userId}:${deviceId} 이런식으로 하면 기기정보도 함께 저장해서 다중로그인 가능
        JSON.stringify({ token: refreshToken, rememberMe:rememberMe }),
        'EX',
        ttl // 남은시간
    );
  } catch (error) {
    console.error('Redis에 Refresh Token 저장 중 오류:', error.message);
    throw new Error('Redis 오류로 Refresh Token 저장 실패');
  }
};

const deleteRefreshTokenFromRedis = async (userId) => {
  await redisClient.del(`refreshToken:${userId}`, `publicProfile:${userId}`);
};

// TODO : 관리자는 리프레시 토큰도 함께 폐기하는 로직 만들기
// 블랙리스트 로직 / 로그아웃 했을때 그냥 삭제를 하면 누군가 탈취하거나, 타 기기에 등록된걸로 재인증이 성공할 수 있음
const invalidateAccessToken = async (accessToken) => {
  const decoded = jwt.decode(accessToken);
  const ttl = Math.floor((decoded.exp * 1000 - Date.now()) / 1000); // 서버 기준 TTL
  if (ttl > 0) {
    await redisClient.set(`blacklist:${accessToken}`, true, 'EX', ttl);
  }
}

const isAccessTokenInvalidated = async (accessToken) => {
  const isBlacklisted = await redisClient.get(`blacklist:${accessToken}`);
  return !!isBlacklisted; // 블랙리스트에 존재하면 true 반환 (!! 쓰면 true)
};

module.exports = {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  generateOAuthToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  saveRefreshTokenToRedis,
  deleteRefreshTokenFromRedis,
  invalidateAccessToken,
  isAccessTokenInvalidated,
};