const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  addTransaction,
  getTransactions,
} = require("../controllers/transactionController");

router.post("/", verifyToken, addTransaction);
router.get("/", verifyToken, getTransactions);

module.exports = router;
