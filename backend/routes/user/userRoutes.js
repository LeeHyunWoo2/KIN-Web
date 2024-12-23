const express = require('express');
const { getUserInfoController, updateUserInfoController, addLocalAccountController, deleteUserController, getUserByEmailController,
  getUserPublicProfileController
} = require('../../controllers/user/userController');
const authenticateUser = require('../../middleware/user/authenticateUser');
const router = express.Router();

// 공개 프로필 데이터 조회
router.get('/public-profile', authenticateUser, getUserPublicProfileController)

// 사용자 정보 조회
router.get('/profile', authenticateUser, getUserInfoController);

// 사용자 정보 조회 (이메일)
router.get('/profile/findUserByEmail/:email',  getUserByEmailController);

// 사용자 정보 수정
router.put('/profile', authenticateUser, updateUserInfoController);

// 로컬 계정 추가 (소셜 Only 유저용 기능)
router.post('/add-local', authenticateUser, addLocalAccountController);

// 회원 탈퇴
router.delete('/profile', authenticateUser, deleteUserController);

module.exports = router;