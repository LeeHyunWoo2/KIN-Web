const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/notes/noteController');
const authenticateUser = require('../../middleware/user/authenticateUser');

// 노트 리스트
router.get('/', authenticateUser, noteController.getNotes);

// 노트 생성
router.post('/', authenticateUser, noteController.createNote);

// 노트 업데이트
router.put('/', authenticateUser, noteController.updateNotes);

// 노트 삭제
router.delete('/', authenticateUser, noteController.deleteNotes);

module.exports = router;
