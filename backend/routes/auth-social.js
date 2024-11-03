const express = require('express');
const passport = require('passport');
const issueTokensAndRedirect = require('../utils/authHelper');
const {linkSocialAccount, unlinkSocialAccount } = require('../controllers/socialAuthController');
const router = express.Router();


const providers = {
  google: { scope: ['profile', 'email'], strategy: 'google-link' },
  kakao: { scope: ['profile_nickname', 'account_email', 'profile_image'], strategy: 'kakao-link' },
  naver: { scope: 'profile', strategy: 'naver-link' },
};

// 동적 라우팅을 통해 소셜 로그인 요청
router.get('/:provider', (req, res, next) => {
  const provider = req.params.provider;
  if (!providers[provider]) {
    return res.status(400).json({ message: '지원하지 않는 소셜 로그인 제공자입니다.' });
  }
  passport.authenticate(provider, { scope: providers[provider].scope })(req, res, next);
});

// 소셜 로그인 콜백 처리
router.get('/:provider/callback', (req, res, next) => {
  const provider = req.params.provider;
  if (!providers[provider]) {
    return res.status(400).json({ message: '지원하지 않는 소셜 로그인 제공자입니다.' });
  }
  passport.authenticate(provider, { failureRedirect: '/login' }, async (err, user) => {
    if (err || !user) {
      console.error(`${provider} 로그인 실패`, err || '사용자 정보가 유효하지 않음');
      return res.status(401).json({ message: `${provider} 로그인 실패` });
    }
    try {
      console.log(`${provider} 로그인 성공`, user);
      await issueTokensAndRedirect(user, res);
    } catch (error) {
      console.error('서버 오류:', error);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  })(req, res);
});


// 소셜 계정 연동 추가
router.get('/link/:provider', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const provider = req.params.provider;

  if (!providers[provider]) {
    return res.status(400).json({ message: '지원하지 않는 소셜 로그인 제공자입니다.' });
  }

  // 세션 객체에 데이터 추가
  req.session.userId = req.user._id;
  req.session.isInitialized = true;   // 초기화 상태 명시
  passport.authenticate(providers[provider].strategy, { scope: providers[provider].scope })(req, res, next);
});

// 추가 연동 콜백 라우트
router.get('/link/:provider/callback', (req, res, next) => {
  const provider = req.params.provider;

  passport.authenticate(providers[provider].strategy, { failureRedirect: '/settings' }, async (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: `${provider} 계정 연동 실패` });
    }

    try {
      // 연동 성공 시 소셜 계정 추가 처리
      await linkSocialAccount(req, res);
    } catch (error) {
      console.error('연동 처리 중 서버 오류:', error);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  })(req, res);
});



// 소셜 계정 연동 해제 엔드포인트
router.post('/unlink', passport.authenticate('jwt', { session: false }), unlinkSocialAccount);

module.exports = router;
