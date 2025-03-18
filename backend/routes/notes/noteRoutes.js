const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/notes/noteController');
const authenticateUser = require('../../middleware/user/authenticateUser');

router.get('/', authenticateUser, noteController.getNotes);

router.post('/', authenticateUser, noteController.createNote);

router.put('/', authenticateUser, noteController.updateNotes);

router.delete('/', authenticateUser, noteController.deleteNotes);

module.exports = router;