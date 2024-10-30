// roles: 허용된 역할 배열
const checkRole = (roles) => {
  return (req, res, next) => {
    // 사용자 역할 확인 (req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    next(); // 권한이 있으면 다음 미들웨어 또는 컨트롤러로 진행
  };
};

module.exports = checkRole;