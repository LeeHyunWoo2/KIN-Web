const express = require('express');
const { getUserInfo, updateUserInfo, addLocalAccount, deleteUser } = require('../controllers/userController');
const authenticateUser = require('../middleware/authenticateUser');
const router = express.Router();

// 사용자 정보 조회
router.get('/profile', authenticateUser, getUserInfo);

// 사용자 정보 수정
router.put('/profile', authenticateUser, updateUserInfo);

// 로컬 계정 추가 (소셜 Only 유저용 기능)
router.post('/add-local', authenticateUser, addLocalAccount);

// 회원 탈퇴
router.delete('/profile', authenticateUser, deleteUser);

module.exports = router;