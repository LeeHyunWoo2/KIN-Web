const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/notes/categoryController');
const injectAuthenticatedUser = require('../../middleware/user/injectAuthenticatedUser');

router.get('/', injectAuthenticatedUser, categoryController.getCategories);

router.post('/', injectAuthenticatedUser, categoryController.createCategory);

router.put('/:categoryId', injectAuthenticatedUser, categoryController.updateCategory);

router.delete('/', injectAuthenticatedUser, categoryController.deleteCategory);

module.exports = router;
