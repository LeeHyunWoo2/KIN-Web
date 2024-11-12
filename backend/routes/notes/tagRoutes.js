const express = require('express');
const authenticateUser = require("../../middleware/user/authenticateUser");
const tagController = require("../../controllers/notes/tagController");
const router = express.Router();

// 태그 조회
router.get('/', authenticateUser, tagController.getTags);

// 태그 생성
router.post('/', authenticateUser, tagController.createTag);

// 태그 수정
router.put('/:tagId', authenticateUser, tagController.updateTag);

// 태그 삭제
router.delete('/:tagId', authenticateUser, tagController.deleteTag);

module.exports = router;