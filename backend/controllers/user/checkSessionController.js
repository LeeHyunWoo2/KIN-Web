const tokenService = require('../../services/user/tokenService');
const redisClient = require('../../config/redis');

// 세션이 유효한지 검증 (일반 사용자용)
const checkSession = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json();
    }
    console.log(user)
    res.status(200).json({ user });
  } catch (error) {
    console.error('세션 검증 실패:', error.message);
    res.status(500).json({ message: '세션 확인 중 오류가 발생했습니다.' });
  }
};

// 관리자 세션 검증
const checkAdminSession = async (req, res) => {
  try{
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(404).json();
    }

    // 블랙리스트에 있는지 확인
    const isInvalidated = await redisClient.get(`blacklist:${accessToken}`);
    if (isInvalidated) {
      return res.status(404).json();
    }

    const decoded = await tokenService.verifyToken(accessToken);
    if (!decoded) {
      return res.status(404).json();
    }

    if (decoded.role === 'admin'){
      return res.status(200).json({isAdmin: true});
    } else {
      return res.status(404).json();
    }
  } catch (error){
    // 접속 시도 시 관리자 증명 이외에 어떤 경우에도 의도적으로 404를  출력해 없는 페이지처럼 보이게 함
    res.status(404).json();
  }
}

module.exports = { checkSession, checkAdminSession };