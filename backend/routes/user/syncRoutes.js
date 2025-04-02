const express = require('express');
const injectAuthenticatedUser = require('../../middleware/user/injectAuthenticatedUser');
const {updateUserActivityTimeController, getLastActivityController, syncAllController} = require("../../controllers/user/syncController");
const router = express.Router();

router.put('/', injectAuthenticatedUser, updateUserActivityTimeController);

router.get('/', injectAuthenticatedUser, getLastActivityController);

// 통합 데이터 요청
router.get('/all', injectAuthenticatedUser, syncAllController);

module.exports = router;