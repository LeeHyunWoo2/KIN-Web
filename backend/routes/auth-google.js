// auth-google.js
const express = require('express');
const passport = require('passport');
const issueTokensAndRedirect  = require('../utils/authHelper');
const User = require('../models/user');

const router = express.Router();

// Google 로그인 요청
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google 로그인 콜백 처리
router.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
  try {
    console.log('google');
    console.log(req.user);
    const email = req.user.emails[0].value;
    const profileIcon = req.user.photos[0].value;

    // 사용자가 이미 등록된 경우
    let user = await User.findOne({ email });

    if (!user) {
      // 새 사용자: 회원가입
      user = new User({
        name: req.user.displayName,
        email,
        profileIcon,
        provider: 'google',
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
