const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");

const { getFinancialInsights } = require("../controllers/insightsController");

router.get("/:email", verifyToken, getFinancialInsights);

module.exports = router;
