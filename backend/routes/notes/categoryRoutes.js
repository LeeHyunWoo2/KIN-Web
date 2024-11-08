const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/notes/categoryController');
const authenticateUser = require('../../middleware/user/authenticateUser');

// 카테고리 리스트
router.get('/', authenticateUser, categoryController.getCategories);

// 카테고리 생성
router.post('/', authenticateUser, categoryController.createCategory);

// 카테고리 업데이트
router.put('/:categoryId', authenticateUser, categoryController.updateCategory);

// 카테고리 삭제
router.delete('/:categoryId', authenticateUser, categoryController.deleteCategory);

module.exports = router;
