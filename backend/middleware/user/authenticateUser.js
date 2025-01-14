const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis');
const cache = new Map(); // 메모리 캐시 (token => { user, expires })

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // 쿠키에서 액세스 토큰 추출
    const skipInterceptor = req.headers['x-skip-interceptor'];

    if (!token) {
      if (skipInterceptor) {
        // withAuth에서 요청한 경우엔 checkSessionController로 넘김
        req.user = null;
        return next();
      }
      return res.status(401).json();
    }

    // 블랙리스트 확인
    const isInvalidated = await redisClient.get(`blacklist:${token}`);
    if (isInvalidated) {
      return res.status(401).json({ message: '이미 로그아웃된 유저입니다.' });
    }

    // 캐시 확인
    const cached = cache.get(token);
    if (cached && cached.expires > Date.now()) {
      req.user = cached.user; // 캐싱된 유저 정보 사용
      return next(); // 다음 미들웨어 실행
    }

    // JWT 검증
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // 캐시에 저장 (유효기간 1초)
    cache.set(token, { user, expires: Date.now() + 1000 });

    req.user = user; // 요청 데이터에 유저 정보 추가
    next(); // 다음 미들웨어 이동
  } catch (error) {
    if(skipInterceptor){
      req.user = null;
      return next();
    }
    return res.status(401).json();
  }
};

// TTL이 지난 캐시 데이터 삭제
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expires <= now) {
      cache.delete(key); // 만료된 캐시 제거
    }
  }
}, 5000); // 5초마다 정리

module.exports = authenticateUser;