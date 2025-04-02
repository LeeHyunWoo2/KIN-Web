const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/notes/noteController');
const injectAuthenticatedUser = require('../../middleware/user/injectAuthenticatedUser');

router.get('/', injectAuthenticatedUser, noteController.getNotes);

router.post('/', injectAuthenticatedUser, noteController.createNote);

router.put('/', injectAuthenticatedUser, noteController.updateNotes);

router.delete('/', injectAuthenticatedUser, noteController.deleteNotes);

module.exports = router;