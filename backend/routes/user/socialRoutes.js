const express = require('express');
const passport = require('passport');
const { unlinkSocialAccount } = require('../../controllers/user/socialController');
const tokenService = require('../../services/user/tokenService');
const authenticateUser = require('../../middleware/user/authenticateUser');
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
    res.status(400).send('지원하지 않는 소셜 플랫폼입니다..');
  }
});

// 소셜 로그인 콜백
router.get('/:provider/callback', (req, res, next) => {
  const provider = req.params.provider;
  passport.authenticate(provider, { session: false }, async (error, user) => {
    if (error || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`); // 로그인 실패 시 리다이렉트
    }

    try {
      // 토큰 발급
      const tokens = tokenService.generateTokens(user);
      // 토큰을 HTTP-Only 쿠키로 설정
      res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1시간
      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7일

      // 로그인 성공 후 리다이렉트, 유저 프로필 정보는 간단하게 쿼리스트링으로 전달
      const redirectUrl = `${process.env.FRONTEND_URL}/social-login-success?name=${user.name}&email=${user.email}&profileIcon=${user.profileIcon}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('토큰 발급 오류:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  })(req, res, next);
});


// 추가 연동 라우트 설정
router.get('/link/:provider', authenticateUser, (req, res, next) => {
  req.session.userId = String(req.user.id);
  console.log('추가연동 라우트')
  const provider = req.params.provider;

  if (['google', 'kakao', 'naver'].includes(provider)) {
    passport.authenticate(providers[provider].strategy, {
      scope: providers[provider].scope,
      accessType: 'offline', // OAuth 2.0 refreshToken 요청 (구글때문에)
      prompt: 'consent' // 매번 사용자 동의 요청
    })(req, res, next); // 해당 provider로 인증 시작
  } else {
    res.status(400).send('지원하지 않는 소셜 플랫폼입니다.');
  }
});

// 추가 연동 콜백
router.get('/link/:provider/callback', authenticateUser, (req, res, next) => {
  console.log(req.user)
  console.log('추가연동 콜백')
  const provider = req.params.provider;

  passport.authenticate(providers[provider].strategy, { failureRedirect: '/userinfo' }, (err) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/userinfo?error=duplicated`);
    }
    res.redirect(`${process.env.FRONTEND_URL}/userinfo`);
  })(req, res, next);
});


// 소셜 계정 연동 해제
router.delete('/unlink/:provider', authenticateUser, unlinkSocialAccount);
module.exports = router;