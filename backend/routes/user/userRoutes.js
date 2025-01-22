const express = require('express');
const { getUserInfoController, updateUserInfoController, addLocalAccountController, deleteUserController, getUserByInputController,
  getUserPublicProfileController, resetPasswordController
} = require('../../controllers/user/userController');
const authenticateUser = require('../../middleware/user/authenticateUser');
const router = express.Router();

// 공개 프로필
router.get('/', authenticateUser, getUserPublicProfileController)

// 비공개 데이터 포함 데이터 (내정보보기)
router.post('/', authenticateUser, getUserInfoController);

// 사용자 정보 찾기 (아이디/비밀번호 찾기 + 이메일 중복체크)
router.post('/find',  getUserByInputController);

// 사용자 정보 수정
router.put('/', authenticateUser, updateUserInfoController);

// 비밀번호 변경(비밀번호 찾기)
router.put('/password', resetPasswordController);

// 소셜 계정 -> 일반 계정 전환
router.post('/change-local', authenticateUser, addLocalAccountController);

// 회원 탈퇴
router.delete('/', authenticateUser, deleteUserController);

module.exports = router;