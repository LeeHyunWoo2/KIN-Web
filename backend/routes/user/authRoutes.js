const express = require('express');
const { registerController, loginController, logoutController,
  renewTokenController
} = require('../../controllers/user/authController');
const { checkSession, checkAdminSession } = require('../../controllers/user/checkSessionController');
const authenticateUser = require("../../middleware/user/authenticateUser");
const router = express.Router();
const validateTurnstile = require('../../middleware/validateTurnstile');

router.post('/register', validateTurnstile, registerController);

router.post('/login', validateTurnstile, loginController);

router.post('/logout', logoutController);

// 세션 유효성 체크
router.get('/session', authenticateUser, checkSession);

// 관리자 세션 유효성 체크(authenticateUser) 는 따로 처리
router.get('/admin-session', checkAdminSession);

// Access Token 재발급
router.post('/refresh', renewTokenController)

module.exports = router;