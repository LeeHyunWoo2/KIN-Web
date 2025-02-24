const express = require("express");
const { recordVisitorController } = require("../../controllers/visitor/visitorController");
const router = express.Router();

router.post("/", recordVisitorController);

module.exports = router;