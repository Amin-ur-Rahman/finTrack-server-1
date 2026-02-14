const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const verifyAdmin = require("../middleware/verifyAdmin");
router.get("/", verifyToken, getCategories);

router.post("/", verifyToken, verifyAdmin, addCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);
router.patch("/:id", verifyToken, verifyAdmin, updateCategory);

module.exports = router;
