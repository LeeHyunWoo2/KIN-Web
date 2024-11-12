const express = require('express');
const authenticateUser = require('../../middleware/user/authenticateUser');
const {updateActivityTimeController, getLastActivityController} = require("../../controllers/user/syncController");
const router = express.Router();

// 유저 활동 시간 갱신
router.put('/activity', authenticateUser, updateActivityTimeController);

// 유저 마지막 활동 시간 조회
router.get('/activity', authenticateUser, getLastActivityController);

module.exports = router;