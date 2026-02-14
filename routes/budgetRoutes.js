const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { getBudgets, setBudget } = require("../controllers/budgetController");

router.get("/", verifyToken, getBudgets);
router.post("/", verifyToken, setBudget);

module.exports = router;
