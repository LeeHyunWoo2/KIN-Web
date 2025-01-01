const express = require('express');
const { registerController, loginController, logoutController,
  newTokenController, recaptchaController
} = require('../../controllers/user/authController');
const { checkSession, checkAdminSession } = require('../../controllers/user/checkSessionController');
const authenticateUser = require("../../middleware/user/authenticateUser");
const router = express.Router();

// 회원가입 라우트
router.post('/register', registerController);

// 로그인 라우트
router.post('/login', loginController);

// 로그아웃 라우트
router.post('/logout', logoutController);

// 세션 확인 라우트
router.get('/check-session', authenticateUser, checkSession);

// 관리자 세션 확인 라우트 (authenticateUser 는 인증 실패시 프론트에서 자동으로 login 페이지로 이동하게 만들어놔서
// 의도적인 404 페이지를 못보여주기 때문에 생략)
router.get('/check-admin-session', checkAdminSession);

// 액세스 토큰 갱신 라우트
router.post('/refresh-token', newTokenController)

// reCAPTCHA 라우트
router.post('/verify-recaptcha', recaptchaController);



module.exports = router;