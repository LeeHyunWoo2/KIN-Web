const tokenService = require('../../services/user/tokenService');
const redisClient = require('../../config/redis');

// 세션이 유효한지 검증
const checkSession = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json();
    }

    // 블랙리스트에서 토큰 상태 확인
    const isInvalidated = await redisClient.get(`blacklist:${accessToken}`);
    if (isInvalidated) {
      return res.status(401).json();
    }

    // 액세스 토큰 검증
    const decoded = await tokenService.verifyToken(accessToken);
    if (!decoded) {
      return res.status(401).json();
    }

    // 사용자 정보 반환
    res.status(200).json({ user: decoded });
  } catch (error) {
    console.error('세션 검증 실패:', error.message);
    res.status(500).json({ message: '세션 확인 중 오류가 발생했습니다.', code: 500 });
  }
};

module.exports = { checkSession };