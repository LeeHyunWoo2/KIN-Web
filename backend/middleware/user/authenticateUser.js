const jwt = require('jsonwebtoken');

// 인증 필요 페이지 진입 시 인증된 사용자인지 판별
const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // 쿠키에서 액세스토큰 가져옴
    if (!token) {
      return res.status(401).json({ message: '권한이 없습니다.', code: 401 });
    }

    // JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 인증된 사용자 정보 설정
    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 인증 정보입니다.', code: 401 });
  }
};

module.exports = authenticateUser;
