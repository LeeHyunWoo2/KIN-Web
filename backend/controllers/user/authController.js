const authService = require('../../services/user/authService');
const tokenService = require('../../services/user/tokenService');
const {createErrorResponse} = require("../../middleware/errorHandler");
const setCookie = require("../../utils/setCookie");
const {accessTokenMaxAge, refreshTokenMaxAge} = require("../../config/cookie");
const jwt = require('jsonwebtoken');

// 1. 회원가입
const registerController = async (req, res) => {
  try {
    const { id, email, password, name, phone, marketingConsent } = req.body;

    // 회원가입 로직을 서비스에서 처리하고, 생성된 사용자와 토큰을 반환
    const user = await authService.registerUser({ id, email, password, name, phone, marketingConsent });

    res.status(201).json({user});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "회원가입 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 2. 로그인 (로컬)
const loginController = async (req, res) => {
  try {
    const { id, password, rememberMe } = req.body;
   // const user_ip = req.headers['cf-connecting-ip'] || '127.0.0.1';

    // 로그인 로직을 서비스에서 처리하고, 사용자와 토큰 반환
   // const { user, tokens } = await authService.loginUser(id, password, rememberMe, user_ip);
    const { user, tokens } = await authService.loginUser(id, password, rememberMe);

    // 쿠키에 JWT와 리프레시 토큰 설정
    setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
    setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge });

    res.status(200).json({user});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로그인 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 3. 로그아웃
const logoutController = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (refreshToken) {
      // 리프레시 토큰이 있으면 Redis에서 삭제 (만료 여부 상관없이 삭제)
      const decoded = await jwt.decode(refreshToken);// 검증 대신 디코딩만
      await tokenService.deleteRefreshTokenFromRedis(decoded.id);
    }

    if (accessToken) {
      // 액세스 토큰이 있으면 블랙리스트에 추가
      await tokenService.invalidateAccessToken(accessToken);
    }

    // 모든 로그인 관련 쿠키 삭제
    res.clearCookie('accessToken', { httpOnly: true, domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined });
    res.clearCookie('refreshToken', { httpOnly: true, domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined });

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

    // 리프레시 토큰 검증
    const decodedData = await tokenService.verifyRefreshToken(refreshToken);

    // 사용자 조회
    const user = await authService.getUserById(decodedData.id);

    // 토큰 갱신
    const tokens = await tokenService.generateTokens(user, decodedData.rememberMe, decodedData.ttl);

    // 새로 발급된 토큰을 쿠키에 설정
    setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
    setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge });

    res.status(200).json({tokens});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "토큰 갱신 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  newTokenController
};