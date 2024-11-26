const express = require('express');
const { registerController, loginController, logoutController,
  newTokenController, recaptchaController
} = require('../../controllers/user/authController');
const { checkSession } = require('../../controllers/user/checkSessionController');
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

// 액세스 토큰 갱신 라우트
router.post('/refresh-token', newTokenController)

// reCAPTCHA 라우트
router.post('/verify-recaptcha', recaptchaController);



module.exports = router;