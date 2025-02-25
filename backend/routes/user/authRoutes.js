const express = require('express');
const { registerController, loginController, logoutController,
  newTokenController
} = require('../../controllers/user/authController');
const { checkSession, checkAdminSession } = require('../../controllers/user/checkSessionController');
const authenticateUser = require("../../middleware/user/authenticateUser");
const router = express.Router();
const validateTurnstile = require('../../middleware/validateTurnstile');

// 회원가입
router.post('/register',  registerController);

// 로그인
router.post('/login',  loginController);

// 로그아웃
router.post('/logout', logoutController);

// 세션 유효성 체크
router.get('/session', authenticateUser, checkSession);

// 관리자 세션 유효성 체크 (authenticateUser 는 인증 실패시 프론트에서 자동으로 login 페이지로 이동하게 만들어놔서
// 의도적인 404 페이지를 못보여주기 때문에 생략)
router.get('/admin-session', checkAdminSession);

// Access Token 재발급
router.post('/refresh', newTokenController)

module.exports = router;