const express = require("express");
const visitorController = require("../../controllers/visitor/visitorController");
const injectAuthenticatedUser = require("../../middleware/user/injectAuthenticatedUser");
const router = express.Router();

router.get("/", injectAuthenticatedUser, visitorController.getVisitorListController);

router.post("/", visitorController.recordVisitorInfoController);

router.put("/", visitorController.trackVisitorActivityController);

module.exports = router;