// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.post("/", profileController.createProfile);
router.put("/:userId", profileController.updateProfile);

module.exports = router;
