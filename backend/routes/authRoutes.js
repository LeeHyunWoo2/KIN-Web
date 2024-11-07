const express = require('express');
const { registerController, loginController, logoutController,
  newTokenController
} = require('../controllers/authController');
const { checkSession } = require('../controllers/checkSessionController');
const router = express.Router();

// 회원가입 라우트
router.post('/register', registerController);

// 로그인 라우트
router.post('/login', loginController);

// 로그아웃 라우트
router.post('/logout', logoutController);

// 세션 확인 라우트
router.get('/check-session', checkSession);

// 액세스 토큰 갱신 라우트
router.post('/refresh-token', newTokenController)

module.exports = router;

/*authRoutes.js 파일은 로그인, 로그아웃, 회원가입 관련 경로를 정의하고, 각 경로에서 authController의 함수들을 호출하여 실제 동작을 수행합니다.

 10번 작업: authRoutes.js 파일 구성

 구현할 주요 경로
1. 회원가입 경로: POST /auth/register
2. 로그인 경로: POST /auth/login
3. 로그아웃 경로: POST /auth/logout


 기능 설명

1. 회원가입 경로 (POST /auth/register)
   - registerController를 호출하여 새로운 사용자 회원가입 요청을 처리합니다.
   - 클라이언트가 사용자 정보(예: 이메일, 비밀번호, 사용자명)를 전송하면, 서버는 이를 registerController로 전달하여 회원가입을 처리합니다.

2. 로그인 경로 (POST /auth/login)
   - loginController를 호출하여 사용자 로그인 요청을 처리합니다.
   - 클라이언트가 로그인 정보(예: 이메일, 비밀번호)를 전송하면, 서버는 이를 loginController로 전달하여 인증을 수행합니다.

3. 로그아웃 경로 (POST /auth/logout)
   - logoutController를 호출하여 사용자의 로그아웃 요청을 처리합니다.
   - 로그아웃 시 토큰을 무효화하고 모든 인증 쿠키를 삭제하여 세션을 만료합니다.

이제 authRoutes.js에서 회원가입, 로그인, 로그아웃 기능을 각각 authController와 연결하여 간단하게 관리할 수 있습니다.*/