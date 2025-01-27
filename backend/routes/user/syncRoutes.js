const express = require('express');
const authenticateUser = require('../../middleware/user/authenticateUser');
const {updateActivityTimeController, getLastActivityController, syncAllController} = require("../../controllers/user/syncController");
const router = express.Router();

// 유저 활동 시간 갱신
router.put('/', authenticateUser, updateActivityTimeController);

// 유저 마지막 활동 시간 조회
router.get('/', authenticateUser, getLastActivityController);

// 통합 데이터 요청
router.get('/all', authenticateUser, syncAllController);

module.exports = router;