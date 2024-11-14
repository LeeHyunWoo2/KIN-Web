const tokenService = require('../../services/user/tokenService');

// 세션이 유효한지 검증용
const checkSession = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json();
    }
    // 토큰 검증
    const decoded = tokenService.verifyToken(accessToken);
    if (!decoded) {
      return res.status(401).json();
    }

    res.status(200).json({user: decoded});
  } catch (error) {
    res.status(500).json();
  }
};

module.exports = { checkSession };