const express = require('express');
const passport = require('passport');
const router = express.Router();
const { checkSession } = require('../controllers/sessionController');

// 인증 확인을 위한 라우트 (JWT 전략 사용)
router.get('/check-session', passport.authenticate('jwt', { session: false }), checkSession);

module.exports = router;