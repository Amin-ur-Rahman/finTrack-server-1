const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const verifyAdmin = require("../middleware/verifyAdmin");

const {
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

router.patch("/update-profile", verifyToken, updateProfile);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.patch("/role/:id", verifyToken, verifyAdmin, updateUserRole);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;
