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
  getMonthlySavingsStats,
} = require("../controllers/transactionController");
const { getDashboardStats } = require("../controllers/dashboardController");

router.post("/", verifyToken, addTransaction);
router.get("/admin", verifyToken, verifyAdmin, getTransactionsForAdmin);
router.get("/savings-stats", verifyToken, getMonthlySavingsStats);
router.get("/user-stats/:email", verifyToken, getDashboardStats); //order matters here, at first it was hitting the /:email route
router.get("/:email", verifyToken, getMyTransactions);
router.patch("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
