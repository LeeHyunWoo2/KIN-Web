// 소셜 토큰 발행 & 리다이렉트 공통 함수
const jwt = require('jsonwebtoken');

const issueTokensAndRedirect = async (user, res) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  // Refresh Token을 DB에 저장
  user.refreshToken = refreshToken;
  await user.save();

  // HTTP-Only 쿠키로 토큰 저장
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1시간
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });

  // 유저 프로필 정보는 간단하게 쿼리스트링으로 전달
  const redirectUrl = `${process.env.FRONTEND_URL}/social-login-success?name=${user.name}&email=${user.email}&profileIcon=${user.profileIcon}`;
  return res.redirect(redirectUrl);
};

module.exports = issueTokensAndRedirect;
