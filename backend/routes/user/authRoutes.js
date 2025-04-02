const express = require('express');
const { registerController, loginController, logoutController,
  renewTokenController
} = require('../../controllers/user/authController');
const { checkSession, checkAdminSessionAs404 } = require('../../controllers/user/checkSessionController');
const injectAuthenticatedUser = require("../../middleware/user/injectAuthenticatedUser");
const router = express.Router();
const validateTurnstile = require('../../middleware/validateTurnstile');

router.post('/register', validateTurnstile, registerController);

router.post('/login', validateTurnstile, loginController);

router.post('/logout', logoutController);

// 세션 유효성 체크
router.get('/session', injectAuthenticatedUser, checkSession);

// 관리자 세션 유효성 체크(injectAuthenticatedUser) 는 따로 처리
router.get('/admin-session', checkAdminSessionAs404);

// Access Token 재발급
router.post('/refresh', renewTokenController)

module.exports = router;