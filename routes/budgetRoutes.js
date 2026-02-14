const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.get("/:email", verifyToken, getBudgets);
router.post("/", verifyToken, setBudget);
router.patch("/:id", verifyToken, updateBudget);
router.delete("/:id", verifyToken, deleteBudget);

module.exports = router;
