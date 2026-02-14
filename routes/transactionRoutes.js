const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  addTransaction,
  getMyTransactions,
  getTransactionsForAdmin,
  updateTransaction,
} = require("../controllers/transactionController");

router.post("/", verifyToken, addTransaction);
router.get("/admin", verifyAdmin, getTransactionsForAdmin);
router.get("/:email", verifyToken, getMyTransactions);
router.patch("/:id", verifyToken, updateTransaction);

module.exports = router;
