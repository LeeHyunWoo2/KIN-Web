const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis');

// 블랙리스트 토큰 확인 함수
const isBlacklisted = async (token) => {
  return !!(await redisClient.get(`blacklist:${token}`));
};

// 인증 미들웨어
const authenticateUser = async (req, res, next) => {
  const skipInterceptor = req.headers['x-skip-interceptor'] || false;

  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      if (skipInterceptor) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ message: 'Access token missing.' });
    }

    if (await isBlacklisted(token)) {
      return res.status(401).json({ message: 'Access denied (blacklisted).' });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // 알고리즘 고정
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT 인증 실패:', error.message);
    if (skipInterceptor) {
      req.user = null;
      return next();
    }
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateUser;