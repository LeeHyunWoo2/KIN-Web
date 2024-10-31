// 토큰 발행 & 리다이렉트 공통 함수
const jwt = require('jsonwebtoken');

const issueTokensAndRedirect = (user, res) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return res.redirect(`${process.env.FRONTEND_URL}/social-login-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
};

module.exports =  issueTokensAndRedirect ;