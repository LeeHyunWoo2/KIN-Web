const authService = require('../../services/user/authService');
const tokenService = require('../../services/user/tokenService');
const {createErrorResponse} = require("../../middleware/errorHandler");

// 1. 회원가입
const registerController = async (req, res) => {
  try {
    const { id, email, password, name, phone, marketingConsent } = req.body;

    // 회원가입 로직을 서비스에서 처리하고, 생성된 사용자와 토큰을 반환
    const user = await authService.registerUser({ id, email, password, name, phone, marketingConsent });

    res.status(201).json(user);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "회원가입 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 2. 로그인 (로컬)
const loginController = async (req, res) => {
  try {
    const { id, password } = req.body;

    // 로그인 로직을 서비스에서 처리하고, 사용자와 토큰 반환
    const { user, tokens } = await authService.loginUser(id, password);

    // 쿠키에 JWT와 리프레시 토큰 설정
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json(user);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로그인 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 3. 로그아웃
const logoutController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // 리프레시 토큰 검증 및 폐기를 서비스에서 처리
    await tokenService.verifyRefreshToken(refreshToken);

    // 모든 로그인 관련 쿠키 삭제
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });

    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로그아웃 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 4. 토큰 갱신
const newTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // 리프레시 토큰 검증하고 새 토큰 발급
    const decoded = await tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json();
    }

    const user = await authService.getUserById(decoded.id);
    const tokens = tokenService.generateTokens(user);

    // 새롭게 발급된 토큰을 쿠키에 설정
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json(tokens);
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "토큰 갱신 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  newTokenController,
};