const authService = require('../../services/user/authService');
const tokenService = require('../../services/user/tokenService');
const {createErrorResponse} = require("../../utils/errorFormat");
const setCookie = require("../../utils/setCookie");
const jwt = require('jsonwebtoken');

const accessTokenMaxAge = process.env.JWT_EXPIRATION * 1000;

const registerController = async (req, res) => {
  try {
    const { username, email, password, name, phone, marketingConsent } = req.body;

    await authService.registerUser({ username, email, password, name, phone, marketingConsent });

    res.status(201).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "회원가입 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

// 로그인 (로컬 계정용)
const loginController = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    const { tokens } = await authService.loginUser(username, password, rememberMe);

    setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
    setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: tokens.refreshTokenTTL * 1000 });

    res.status(200).json({success: true});
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로그인 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

const logoutController = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (refreshToken) {
      const decoded = await jwt.decode(refreshToken);
      await tokenService.deleteRefreshTokenFromRedis(decoded.id);
    }

    if (accessToken) {
      await tokenService.invalidateAccessToken(accessToken);
    }

    res.clearCookie('accessToken', { httpOnly: true, domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined });
    res.clearCookie('refreshToken', { httpOnly: true, domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined });

    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로그아웃 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

const renewTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const decodedData = await tokenService.verifyRefreshToken(refreshToken);
    const user = await authService.getUserById(decodedData.id);
    const tokens = await tokenService.generateTokens(user, decodedData.rememberMe, decodedData.ttl);

    setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
    setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: tokens.refreshTokenTTL * 1000 });

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
  renewTokenController
};