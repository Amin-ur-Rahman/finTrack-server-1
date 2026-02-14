const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  addTransaction,
  getMyTransactions,
  getTransactionsForAdmin,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.post("/", verifyToken, addTransaction);
router.get("/admin", verifyAdmin, getTransactionsForAdmin);
router.get("/:email", verifyToken, getMyTransactions);
router.patch("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
