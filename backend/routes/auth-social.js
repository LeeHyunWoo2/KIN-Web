const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Google 로그인 요청
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google 로그인 콜백 처리
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
  try {
    console.log(req.user)
    const email = req.user.email;

    // 사용자가 이미 등록된 경우
    let user = await User.findOne({ email });

    if (user) {
      // 기존 사용자: 로그인
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      // 프론트로 리다이렉트, 토큰 전달
      return res.redirect(`${process.env.FRONTEND_URL}/social-login-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } else {
      // 새 사용자: 회원가입
      user = new User({
        name: req.user.displayName,
        email,
        profileIcon: req.user.photos[0].value,
        provider: 'google',
      });

      await user.save();

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      console.log('가입 or 로그인 성공 : ', user.name)
      return res.redirect(`${process.env.FRONTEND_URL}/social-login-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '서버 오류', error });
  }
});



module.exports = router;