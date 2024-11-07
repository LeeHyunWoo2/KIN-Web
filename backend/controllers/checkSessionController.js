const tokenService = require('../services/tokenService');

const checkSession = async (req, res) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  // 토큰 유효성 확인
  const decoded = tokenService.verifyToken(accessToken);
  if (!decoded) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다. 로그아웃이 필요합니다.' });
  }

  // 토큰이 유효하다면 인증된 사용자 정보 반환
  res.status(200).json({ message: '인증된 세션입니다.', user: decoded });
};

module.exports = { checkSession };

/*백엔드에서는 계정 전환 시 세션을 확인하는 엔드포인트를 추가하여, 클라이언트가 현재 인증된 계정을 백엔드에서 확인할 수 있도록 합니다.
이를 통해 전환된 계정의 세션이 유효한지 확인하고, 만료된 세션일 경우 로그아웃 처리하는 로직을 포함할 수 있습니다.

verifyToken 함수는 기존에 작성된 대로 JWT의 유효성을 검증합니다.
이를 통해 accessToken이 유효한지 검사하고, 만료된 경우 클라이언트에서 로그아웃 요청을 유도할 수 있습니다.

 전체 흐름 정리

1. 계정 전환 시 클라이언트에서 새로운 accessToken과 refreshToken을 쿠키로 설정합니다.
2. 백엔드 세션 확인: GET /auth/check-session 요청을 통해 새로운 계정의 accessToken이 유효한지 확인합니다.
3. 인증 상태 확인 후 응답:
   - 토큰이 유효하면 200 상태와 사용자 정보를 반환합니다.
   - 토큰이 만료되거나 유효하지 않다면 401 상태를 반환하여, 클라이언트가 해당 계정의 로그아웃 처리를 수행할 수 있도록 합니다.

이로써 백엔드에서 계정 전환 후 세션을 검증하고 유효성을 유지할 수 있는 로직이 완료됩니다.*/