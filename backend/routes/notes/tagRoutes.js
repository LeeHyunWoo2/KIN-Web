const express = require('express');
const authenticateUser = require("../../middleware/user/authenticateUser");
const tagController = require("../../controllers/notes/tagController");
const router = express.Router();

router.get('/', authenticateUser, tagController.getTags);

router.post('/', authenticateUser, tagController.createTag);

router.put('/:tagId', authenticateUser, tagController.updateTag);

router.delete('/:tagId', authenticateUser, tagController.deleteTag);

module.exports = router;