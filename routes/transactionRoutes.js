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
const { getDashboardStats } = require("../controllers/dashboardController");

router.get("/user-stats/:email", verifyToken, getDashboardStats); //order matters here, at first it was hitting the /:email route
router.post("/", verifyToken, addTransaction);
router.get("/admin", verifyAdmin, getTransactionsForAdmin);
router.get("/:email", verifyToken, getMyTransactions);
router.patch("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
