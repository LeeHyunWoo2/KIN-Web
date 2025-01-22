const express = require('express');
const passport = require('passport');
const { unlinkSocialAccount } = require('../../controllers/user/socialController');
const tokenService = require('../../services/user/tokenService');
const authenticateUser = require('../../middleware/user/authenticateUser');
const setCookie = require("../../utils/setCookie");
const {accessTokenMaxAge, refreshTokenMaxAge} = require("../../config/cookie");
const router = express.Router();


const providers = {
  google: { scope: ['profile', 'email'], strategy: 'google-link' },
  kakao: { scope: ['profile_nickname', 'account_email', 'profile_image'], strategy: 'kakao-link' },
  naver: { scope: 'profile', strategy: 'naver-link' },
};

// 소셜 로그인 진입
router.get('/:provider', (req, res, next) => {
  const provider = req.params.provider;
  if (['google', 'kakao', 'naver'].includes(provider)) {
    passport.authenticate(provider, {
      scope: providers[provider].scope,
      accessType: 'offline', // 리프레시 토큰 발급 요청
      prompt: 'consent' // 매번 사용자 동의 요청
    })(req, res, next); // 해당 provider로 인증 시작
  } else {
    res.status(400).send();
  }
});

// 소셜 로그인 콜백
router.get('/:provider/callback', (req, res, next) => {
  const provider = req.params.provider;
  passport.authenticate(provider, { session: false }, async (error, user) => {
    if (error || !user) {
      // 소셜 로그인을 시도할때 소셜 연동이 되진 않았으나,
      // 동일한 이메일로 로컬 아이디를 가입한 상황이 발생할경우(매우 특수케이스)
      if(error.code === 11000){
        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(
                "해당 이메일로 가입된 일반계정이 있습니다.")}`);
      }
      return res.redirect(`${process.env.FRONTEND_URL}/login`); // 로그인 실패 시 리다이렉트
    }

    try {
      // 토큰 발급
      const tokens = await tokenService.generateTokens(user);
      // 토큰을 HTTP-Only 쿠키로 설정
      setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge, domain: 'noteapp.org' });
      setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge, domain: 'noteapp.org' });

      // 로그인 성공 후 리다이렉트
      return res.redirect(`${process.env.FRONTEND_URL}/loginSuccess`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  })(req, res, next);
});


// 추가 연동 라우트 설정
router.get('/link/:provider', authenticateUser, (req, res, next) => {
  const provider = req.params.provider;

  if (['google', 'kakao', 'naver'].includes(provider)) {
    passport.authenticate(providers[provider].strategy, {
      scope: providers[provider].scope,
      accessType: 'offline', // OAuth 2.0 refreshToken 요청 (구글때문에)
      prompt: 'consent' // 매번 사용자 동의 요청
    })(req, res, next); // 해당 provider로 인증 시작
  } else {
    res.status(400).send();
  }
});

// 추가 연동 콜백
router.get('/link/:provider/callback', authenticateUser, (req, res, next) => {
  const provider = req.params.provider;

  passport.authenticate(providers[provider].strategy, { failureRedirect: '/userinfo' }, (error) => {
    if (error) {
      // 에러 발생 시 메시지 포함
      return res.redirect(`${process.env.FRONTEND_URL}/userinfo?error=${encodeURIComponent("이미 연동된 계정입니다.")}`);
    }
    res.redirect(`${process.env.FRONTEND_URL}/userinfo`);
  })(req, res, next);
});


// 소셜 계정 연동 해제
router.delete('/unlink/:provider', authenticateUser, unlinkSocialAccount);

module.exports = router;
