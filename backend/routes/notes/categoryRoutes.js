const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/notes/categoryController');
const authenticateUser = require('../../middleware/user/authenticateUser');

router.get('/', authenticateUser, categoryController.getCategories);

router.post('/', authenticateUser, categoryController.createCategory);

router.put('/:categoryId', authenticateUser, categoryController.updateCategory);

router.delete('/', authenticateUser, categoryController.deleteCategory);

module.exports = router;
