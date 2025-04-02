const express = require('express');
const injectAuthenticatedUser = require("../../middleware/user/injectAuthenticatedUser");
const tagController = require("../../controllers/notes/tagController");
const router = express.Router();

router.get('/', injectAuthenticatedUser, tagController.getTags);

router.post('/', injectAuthenticatedUser, tagController.createTag);

router.put('/:tagId', injectAuthenticatedUser, tagController.updateTag);

router.delete('/:tagId', injectAuthenticatedUser, tagController.deleteTag);

module.exports = router;