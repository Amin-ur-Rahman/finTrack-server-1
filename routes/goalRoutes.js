const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  createGoal,
  contributeToGoal,
  getGoals,
  getSingleGoalStats,
} = require("../controllers/goalController");

router.get("/single-goal-stats/:id", verifyToken, getSingleGoalStats);
router.get("/:email", verifyToken, getGoals);
router.post("/", verifyToken, createGoal);
router.patch("/:id", verifyToken, contributeToGoal);
module.exports = router;
