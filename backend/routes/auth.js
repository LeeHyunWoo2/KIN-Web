const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();
// Express 인스턴스 라우트 정의


// 액세스 토큰 갱신 라우트
// 클라이언트가 만료된 Access Token을 갱신하기 위해 Refresh Token을 보낼 때 사용
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  // 클라이언트가 요청한 Refresh Token을 요청 본문(req.body)에서 추출.

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh Token이 없음' });
    // Refresh Token이 없으면 403 상태 코드를 반환하고 처리 중단.
  }

  try {
    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // 클라이언트에서 넘어온 Refresh Token이 유효한지 JWT를 사용해 검증

    // Refresh Token의 페이로드에 기록된 userId로 사용자 찾기
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh Token이 유효하지 않음' });
    }

    // 새로운 Access Token 발급
    const newAccessToken = jwt.sign(
        { userId: user._id }, // 새 토큰에 id 저장
        process.env.JWT_SECRET, // 비밀키 서명
        { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken: newAccessToken });
    // 새 Access Token 발급 성공 후 클라이언트에 반환
  } catch (error) {
    // Refresh Token이 유효하지 않으면 403
    return res.status(403).json({ message: '유효하지 않은 Refresh Token입니다.' });
  }
});

// 회원가입 로그인 처리 컨트롤러
const { registerUser, loginUser } = require('../controllers/authController');
const {validateUserSignup} = require("../middleware/validateUser");


// 로그아웃 라우트
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh Token이 없습니다.' });
  }

  try {
    // Refresh Token을 사용하는 사용자를 찾아서 삭제
    const user = await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null } // Refresh Token을 null로 설정
    );

    if (!user) {
      return res.status(400).json({ message: '유효하지 않은 Refresh Token입니다.' });
    }

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
});

// Google 로그인 처리 라우트
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 콜백 처리 라우트
router.get(process.env.GOOGLE_CALLBACK_URL,
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // 로그인 성공 시 JWT 토큰 발급
      const accessToken = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
          { userId: req.user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '7d' }
      );

      res.status(200).json({
        message: '로그인 성공',
        accessToken,
        refreshToken
      });
    }
);



// 회원가입 라우트 (POST)
router.post('/register', validateUserSignup, registerUser);

// 로그인 라우트 (POST)
router.post('/login', loginUser);

module.exports = router;
// router 객체를 모듈로 내보내 다른 파일(server.js)에서 사용할 수 있게 함.