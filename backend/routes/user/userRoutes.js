const express = require('express');
const { getUserInfoController, updateUserInfoController, addLocalAccountController, deleteUserController, getUserByInputController,
  getUserPublicProfileController, resetPasswordController
} = require('../../controllers/user/userController');
const injectAuthenticatedUser = require('../../middleware/user/injectAuthenticatedUser');
const router = express.Router();

router.get('/', injectAuthenticatedUser, getUserPublicProfileController)

router.post('/', injectAuthenticatedUser, getUserInfoController);

// 아이디/비밀번호 찾기 & 이메일 중복체크
router.post('/find',  getUserByInputController);

router.put('/', injectAuthenticatedUser, updateUserInfoController);

router.put('/password', resetPasswordController);

// 소셜 계정 -> 일반 계정 전환
router.post('/change-local', injectAuthenticatedUser, addLocalAccountController);

router.delete('/', injectAuthenticatedUser, deleteUserController);

module.exports = router;