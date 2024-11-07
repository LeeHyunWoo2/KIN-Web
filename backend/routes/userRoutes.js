// routes/userRoutes.js
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

/*userRoutes.js 파일은 사용자 정보 조회, 수정, 삭제와 같은 CRUD 경로를 정의하고, 각 경로에서 userController의 함수들을 호출하여 실제 동작을 수행합니다. 모든 경로는 authenticateUser 미들웨어를 통해 JWT 기반 인증을 확인하여, 인증된 사용자만 접근할 수 있게 합니다.

 11번 작업: userRoutes.js 파일 구성

 구현할 주요 경로
1. 사용자 정보 조회: GET /user/profile
2. 사용자 정보 수정: PUT /user/profile
3. 회원 탈퇴: DELETE /user/profile


 기능 설명

1. 사용자 정보 조회 (GET /user/profile)
   - authenticateUser 미들웨어를 통해 사용자 인증을 확인한 후 getUserInfo를 호출하여 사용자 정보를 조회합니다.
   - 사용자 정보(예: 이름, 이메일, 프로필 아이콘)를 클라이언트에 반환합니다.

2. 사용자 정보 수정 (PUT /user/profile)
   - authenticateUser 미들웨어를 통해 사용자 인증을 확인한 후 updateUserInfo를 호출하여 사용자 정보 수정 요청을 처리합니다.
   - 클라이언트가 전송한 수정된 사용자 정보(예: 이름, 프로필 아이콘)를 서버에서 업데이트합니다.

3. 회원 탈퇴 (DELETE /user/profile)
   - authenticateUser 미들웨어를 통해 사용자 인증을 확인한 후 deleteUser를 호출하여 회원 탈퇴 요청을 처리합니다.
   - 데이터베이스에서 사용자 정보를 삭제하고, 토큰을 무효화하여 로그아웃을 완료합니다.

이제 userRoutes.js에서 사용자 관련 CRUD 기능을 userController와 연결하여 관리할 수 있습니다.*/