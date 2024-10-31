const express = require('express');
const passport = require('passport');
const issueTokensAndRedirect = require('../utils/authHelper')
const User = require('../models/user');
const router = express.Router();


// kakao 로그인 요청
router.get('/', passport.authenticate('kakao', { scope: ['profile_nickname', 'account_email', 'profile_image'] }));

// kakao 로그인 콜백 처리
router.get('/callback', passport.authenticate('kakao', { failureRedirect: '/login' }), async (req, res) => {
  try {
    console.log(req.user);
    const profileData = req.user._json;
    const email = profileData?.kakao_account?.email;
    const profileIcon = profileData?.properties?.profile_image;

    // 사용자가 이미 등록된 경우
    let user = await User.findOne({ email });

    if (!user) {
      // 새 사용자: 회원가입
      user = new User({
        name: req.user.displayName,
        email,
        profileIcon,
        provider: 'kakao',
      });
      await user.save();
    }

    // 토큰 발행 및 리다이렉트
    issueTokensAndRedirect(user, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '서버 오류', error });
  }
});

module.exports = router;