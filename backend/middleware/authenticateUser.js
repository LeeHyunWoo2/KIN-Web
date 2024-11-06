const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // 쿠키에서 accessToken 가져오기
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }

    // JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 인증된 사용자 정보 설정
    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 인증 토큰입니다.' });
  }
};

module.exports = authenticateUser;

/*authenticateUser.js 파일은 JWT 기반 인증 미들웨어로, 모든 보호된 경로에서 사용자 인증을 확인하는 역할을 합니다.
이 미들웨어는 사용자의 JWT를 검증하고 유효한 경우에만 요청을 처리합니다.

 5번 작업: authenticateUser.js 파일 구성

 구현할 주요 기능
1. JWT 검증: 요청의 accessToken 쿠키에서 JWT를 가져와 유효성을 검증합니다.
2. 사용자 정보 설정: 검증된 토큰에 있는 사용자 정보를 req.user에 설정하여 이후 컨트롤러에서 접근할 수 있게 합니다.
3. 인증 실패 처리: 유효하지 않은 토큰일 경우 401 응답을 반환하여 접근을 차단합니다.


 기능 설명

1. 토큰 추출 및 검증
   - 요청의 accessToken 쿠키에서 JWT를 가져옵니다. 토큰이 없으면 401 상태와 함께 "인증 토큰이 없습니다."라는 메시지를 반환합니다.
   - jwt.verify를 사용하여 토큰의 유효성을 확인하고, 유효한 경우 decoded 객체를 req.user에 설정하여 이후 미들웨어나 컨트롤러에서 사용자 정보를 참조할 수 있게 합니다.

2. 오류 처리 및 응답
   - 토큰이 유효하지 않거나 만료된 경우, 401 상태와 "유효하지 않은 인증 토큰입니다." 메시지를 반환하여 인증이 필요한 경로에 대한 접근을 차단합니다.

 추가 설명
- 에러 처리: 인증 실패 시 일관된 401 응답을 반환하여 클라이언트 측에서 적절히 인증 오류를 처리할 수 있습니다.
- 사용자 정보 공유: req.user에 저장된 사용자 정보는 이후 컨트롤러나 다른 미들웨어에서 참조할 수 있어 요청당 사용자 식별이 가능합니다.

이제 authenticateUser.js 미들웨어를 보호된 라우트에서 사용할 수 있습니다.*/