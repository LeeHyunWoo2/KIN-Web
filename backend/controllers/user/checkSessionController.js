const tokenService = require('../../services/user/tokenService');
const {createErrorResponse} = require("../../utils/errorFormat");

const checkSession = async (req, res) => {
  try {
    const skipInterceptor = req.headers['x-skip-interceptor'] === 'true';
    const user = req.user;
    if (!user && skipInterceptor) {
        return res.status(419).json({message: '로그인이 필요한 페이지 입니다.'});
    } else if (!user) {
      return res.status(401).json();
    }
    res.status(200).json({ user });
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "세션 확인 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

const checkAdminSessionAs404 = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    const decoded = await tokenService.verifyAccessToken(accessToken);

    if (decoded.role === 'admin') {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(404).json(); // 관리자 권한 아님
    }
  } catch (error) {
    // 어떤 이유든 관리자 인증 실패 → 404
    return res.status(404).json();
  }
};

module.exports = { checkSession, checkAdminSessionAs404 };