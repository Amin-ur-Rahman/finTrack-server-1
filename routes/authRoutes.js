const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", registerUser);
router.get("/me", verifyToken, async (req, res) => {
  res.send(req.user);
});
module.exports = router;
