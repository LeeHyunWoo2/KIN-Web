const express = require('express');
const passport = require('passport');
const {handleSocialCallback, handleSocialLinkCallback, unlinkSocialAccount } = require('../../controllers/user/socialController');
const injectAuthenticatedUser = require('../../middleware/user/injectAuthenticatedUser');

const router = express.Router();

const providers = {
  google: { scope: ['profile', 'email'], strategy: 'google-link' },
  kakao: { scope: ['profile_nickname', 'account_email', 'profile_image'], strategy: 'kakao-link' },
  naver: { scope: 'profile', strategy: 'naver-link' },
};

// 소셜 로그인 진입
router.get('/:provider', (req, res) => {
  const provider = req.params.provider;
  if (['google', 'kakao', 'naver'].includes(provider)) {
    passport.authenticate(provider, {
      scope: providers[provider].scope,
      accessType: 'offline', // 리프레시 토큰 발급 요청 (연동 해제할때 사용함)
      prompt: 'consent' // 매번 사용자 동의 요청
    })(req, res);
  } else {
    res.status(400).send();
  }
});

// 소셜 로그인 콜백
router.get(
    '/:provider/callback',
    (req, res, next) => {
      const provider = req.params.provider;
      passport.authenticate(provider, { session: false }, (error, user) => {
        // req.authResult에 인증 결과를 넣고 넘김
        req.authResult = { error, user };
        next();
      })(req, res, next);
    },
    handleSocialCallback
);

// 일반 계정에 소셜 계정 추가 연동
router.get('/link/:provider', injectAuthenticatedUser, (req, res, next) => {
  const provider = req.params.provider;

  if (['google', 'kakao', 'naver'].includes(provider)) {
    passport.authenticate(providers[provider].strategy, {
      scope: providers[provider].scope,
      accessType: 'offline',
      prompt: 'consent'
    })(req, res, next);
  } else {
    res.status(400).send();
  }
});

// 추가 연동 콜백
router.get(
    '/link/:provider/callback',
    injectAuthenticatedUser,
    (req, res, next) => {
      const provider = req.params.provider;
      passport.authenticate(providers[provider].strategy, (error) => {
        req.authResult = { error };
        next();
      })(req, res, next);
    },
    handleSocialLinkCallback
);

// 소셜 계정 연동 해제
router.delete('/:provider', injectAuthenticatedUser, unlinkSocialAccount);

module.exports = router;
