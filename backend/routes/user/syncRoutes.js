const express = require('express');
const authenticateUser = require('../../middleware/user/authenticateUser');
const {updateUserActivityTimeController, getLastActivityController, syncAllController} = require("../../controllers/user/syncController");
const router = express.Router();

router.put('/', authenticateUser, updateUserActivityTimeController);

router.get('/', authenticateUser, getLastActivityController);

// 통합 데이터 요청
router.get('/all', authenticateUser, syncAllController);

module.exports = router;