const express = require('express');
const passport = require('passport');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// 관리자 전용 라우트
router.get('/dashboard',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']), // 관리자 권한 체크
    (req, res) => {
      res.json({ message: '관리자 대시보드에 접근했습니다.' });
    }
);

module.exports = router;