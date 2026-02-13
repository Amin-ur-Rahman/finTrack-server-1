const express = require("express");
const router = express.Router();
const {
  registerUser,
  logoutUser,
  loginUser,
} = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const { getDB } = require("../config/db");

router.post("/register", registerUser);
router.get("/me", verifyToken, async (req, res) => {
  const userEmail = req.user.email;
  const db = getDB();

  const userData = await db.collection("users").findOne({ email: userEmail });
  if (!userData) {
    return res.status(404).send({ message: "User not found" });
  }
  res.send(userData);
  // res.send(req.user);
});
router.post("/logout", logoutUser);
router.post("/login", loginUser);
module.exports = router;
