const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/notes/noteController');
const authenticateUser = require('../../middleware/user/authenticateUser');

// 메모 리스트
router.get('/', authenticateUser, noteController.getNotes);

// 메모 상세보기
router.get('/:noteId', authenticateUser, noteController.getNoteById);

// 메모 생성
router.post('/', authenticateUser, noteController.createNote);

// 메모 업데이트
router.put('/:noteId', authenticateUser, noteController.updateNote);

// 메모 삭제
router.delete('/:noteId', authenticateUser, noteController.deleteNote);

module.exports = router;
