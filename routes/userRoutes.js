const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const { updateProfile } = require("../controllers/userController");

router.patch("/update-profile", verifyToken, updateProfile);

module.exports = router;
