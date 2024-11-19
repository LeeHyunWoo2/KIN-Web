const express = require('express');
const router = express.Router();
const {sendVerificationEmail, verifyEmail} = require('../../controllers/user/emailController');

// 이메일 인증 링크 전송
router.post('/send-verification-email', sendVerificationEmail);

// 이메일 인증 확인
router.get('/verify-email', verifyEmail);

module.exports = router;