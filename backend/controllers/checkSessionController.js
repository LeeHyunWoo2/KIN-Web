const tokenService = require('../services/tokenService');

// 세션이 유효한지 검증용
const checkSession = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }
    // 토큰 검증
    const decoded = tokenService.verifyToken(accessToken);
    if (!decoded) {
      return res.status(401).json({ message: '유효하지 않은 토큰, 로그아웃합니다.' });
    }

    res.status(200).json({ message: '인증된 세션입니다.', user: decoded });
  } catch (error) {
    res.status(500).json({ message: '세션 확인 중 오류가 발생했습니다.', error: error.message });
  }
};

module.exports = { checkSession };