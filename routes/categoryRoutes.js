const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  addCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/categoryController");

const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }
  next();
};

router.get("/", verifyToken, getCategories);

router.post("/", verifyToken, verifyAdmin, addCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
