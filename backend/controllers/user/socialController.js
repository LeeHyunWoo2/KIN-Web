const tokenService = require('../../services/user/tokenService');
const setCookie = require('../../utils/setCookie');
const socialService = require('../../services/user/socialService');
const {createErrorResponse} = require("../../utils/errorFormat");

const accessTokenMaxAge = 60 * 60 * 1000; // 1시간

const handleSocialCallback = async (req, res) => {
  const { error, user } = req.authResult || {};

  if (error || !user) {
    if (error?.code === 11000) {
      return res.redirect(
          `${process.env.FRONTEND_ORIGIN}/login?error=${encodeURIComponent(
              '해당 이메일로 가입된 일반계정이 있습니다.'
          )}`
      );
    }
    return res.redirect(`${process.env.FRONTEND_ORIGIN}/login`);
  }

  try {
    const tokens = await tokenService.generateTokens(user);

    setCookie(res, 'accessToken', tokens.accessToken, {
      maxAge: accessTokenMaxAge,
      domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined
    });

    setCookie(res, 'refreshToken', tokens.refreshToken, {
      maxAge: tokens.refreshTokenTTL * 1000,
      domain: process.env.NODE_ENV === 'production' ? 'noteapp.org' : undefined
    });

    return res.redirect(`${process.env.FRONTEND_ORIGIN}/loginSuccess`);
  } catch (err) {
    return res.redirect(`${process.env.FRONTEND_ORIGIN}/login`);
  }
};

const handleSocialLinkCallback = (req, res) => {
  const { error } = req.authResult || {};
  if (error) {
    return res.redirect(
        `${process.env.FRONTEND_ORIGIN}/userinfo?error=${encodeURIComponent('이미 연동된 계정입니다.')}`
    );
  }
  return res.redirect(`${process.env.FRONTEND_ORIGIN}/userinfo`);
};

const unlinkSocialAccount = async (req, res) => {
  try {
    const { provider } = req.body;
    await socialService.unlinkAccount(req.user.id, provider);
    res.status(200).json();
  } catch (error) {
    const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "소셜 계정 연동 해제 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

module.exports = {
  handleSocialCallback,
  handleSocialLinkCallback,
  unlinkSocialAccount,
};