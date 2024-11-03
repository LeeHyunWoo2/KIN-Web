const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// 액세스 토큰 갱신 라우트 (POST)
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 Refresh Token 추출

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh Token이 없음' });
  }

  try {
    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 사용자 찾기
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: '유효하지 않은 Refresh Token' });
    }

    // 새로운 Access Token 발급
    const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // 새로운 Access Token을 HTTP-Only 쿠키로 설정
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1시간
    });

    res.status(200).json({ message: 'Access Token 갱신 성공' });
  } catch (error) {
    return res.status(403).json({ message: '유효하지 않은 Refresh Token' });
  }
});


// 로그아웃 라우트 (POST)
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 Refresh Token 추출

  if (!refreshToken) {
    console.log("로그아웃 실패: Refresh Token이 누락되었습니다.");
    return res.status(400).json({ message: 'Refresh Token이 없습니다.' });
  }

  try {
    // 사용자 찾기 및 Refresh Token 제거
    const user = await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
    );

    if (!user) {
      console.log("로그아웃 실패: 유효하지 않은 Refresh Token입니다.");
      return res.status(400).json({ message: '유효하지 않은 Refresh Token입니다.' });
    }

    // 쿠키에서 토큰 삭제
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    console.log(`로그아웃 성공: 사용자 ${user.email} (ID: ${user._id})`);
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.error("로그아웃 중 서버 오류:", error);
    res.status(500).json({ message: '서버 오류', error });
  }
});

module.exports = router;