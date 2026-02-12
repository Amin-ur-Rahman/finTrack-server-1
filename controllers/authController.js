const { getDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const db = await getDB();

    const usersColl = db.collection("users");

    const userExists = await usersColl.findOne({ email: userData.email });

    if (userExists) {
      return res.status(400).send({ message: "user already exists" });
    }

    // hashing the password

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await usersColl.insertOne({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      photoUrl: userData.profile,
      photoUrl: userData.imageUrl,
    });
    // creating the token
    const payload = { email: userData.email };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    // setting up jwt with http-only cookie method
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({
        success: true,
        message: "Registration successfel and logged in",
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error", error });
  }
};

module.exports = { registerUser };
