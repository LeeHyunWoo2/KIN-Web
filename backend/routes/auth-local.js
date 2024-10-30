// 로그아웃 라우트는 auth-token.js 에서 확인

const express = require('express');
const passport = require('passport');
const {
  registerController,
  loginController,
  getUserProfileController,
  updateUserProfileController,
  deleteUserController,
  updateUserProfileIconController
} = require('../controllers/authController');
const {validateUserSignup, validateUserLogin, validateUserUpdate} = require(
    '../middleware/validateUser');

const router = express.Router();

// 회원가입 라우트 (POST)
router.post('/register', validateUserSignup, registerController);

// 로그인 (POST)
router.post('/login', validateUserLogin, loginController);

// 회원 정보 조회 (GET)
router.get('/profile',
    passport.authenticate('jwt', {session: false}), // JWT 인증 필요. 회원 가입과 로그인은 애초에 미인증 유저가 하는 작업이라 제외
    getUserProfileController
);

// 회원 정보 수정 (PUT)
router.put('/profile',
    passport.authenticate('jwt', {session: false}),
    validateUserUpdate,  // 수정 시 데이터 검증
    updateUserProfileController
);

// 프로필 아이콘 업데이트 요청
router.put('/profile/icon',
    passport.authenticate('jwt', {session: false}),
    updateUserProfileIconController
);

// 회원 탈퇴 (DELETE)
router.delete('/profile',
    passport.authenticate('jwt', {session: false}),
    deleteUserController
);

module.exports = router;