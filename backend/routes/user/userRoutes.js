const express = require('express');
const { getUserInfoController, updateUserInfoController, addLocalAccountController, deleteUserController, getUserByInputController,
  getUserPublicProfileController, resetPasswordController
} = require('../../controllers/user/userController');
const authenticateUser = require('../../middleware/user/authenticateUser');
const router = express.Router();

router.get('/', authenticateUser, getUserPublicProfileController)

router.post('/', authenticateUser, getUserInfoController);

// 아이디/비밀번호 찾기 & 이메일 중복체크
router.post('/find',  getUserByInputController);

router.put('/', authenticateUser, updateUserInfoController);

router.put('/password', resetPasswordController);

// 소셜 계정 -> 일반 계정 전환
router.post('/change-local', authenticateUser, addLocalAccountController);

router.delete('/', authenticateUser, deleteUserController);

module.exports = router;