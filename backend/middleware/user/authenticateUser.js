const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // 쿠키에서 액세스 토큰 추출
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // 블랙리스트에 있는지 확인
    const isInvalidated = await redisClient.get(`blacklist:${token}`);
    if (isInvalidated) {
      return res.status(401).json({ message: '이미 로그아웃된 유저입니다..' });
    }

    // JWT 검증 및 사용자 정보 설정
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next(); // 인증 성공, 다음 미들웨어로 이동
  } catch (error) {
    return res.status(401).json();
  }
};


module.exports = authenticateUser;