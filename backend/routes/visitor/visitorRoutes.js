const express = require("express");
const visitorController = require("../../controllers/visitor/visitorController");
const authenticateUser = require("../../middleware/user/authenticateUser");
const router = express.Router();

router.get("/", authenticateUser, visitorController.getVisitorListController);

router.post("/", visitorController.recordVisitorInfoController);

router.put("/", visitorController.trackVisitorActivityController);

module.exports = router;