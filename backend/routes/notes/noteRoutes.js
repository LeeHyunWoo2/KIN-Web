const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/notes/noteController');
const authenticateUser = require('../../middleware/user/authenticateUser');

// 노트 리스트
router.get('/', authenticateUser, noteController.getNotes);

// 노트 상세보기
router.get('/:noteId', authenticateUser, noteController.getNoteById);

// 노트 생성
router.post('/', authenticateUser, noteController.createNote);

// 노트 업데이트
router.put('/:noteId', authenticateUser, noteController.updateNote);

// 노트 삭제
router.delete('/:noteId', authenticateUser, noteController.deleteNote);

module.exports = router;
