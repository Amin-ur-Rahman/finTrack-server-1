const { getDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const db = await getDB();
    console.log("password", userData.password);

    const usersColl = db.collection("users");

    const userExists = await usersColl.findOne({ email: userData.email });

    if (userExists) {
      return res.status(400).send({ message: "user already exists" });
    }

    // hashing the password

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await usersColl.insertOne({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      photoUrl: userData.profile,
      photoUrl: userData.imageUrl,
      role: "user",
    });
    // creating the token
    const payload = { email: userData.email, id: result.insertedId };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    console.log("token", token);

    // setting up jwt with http-only cookie method
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
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

// logout user funciton===================

const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .send({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Logout failed" });
  }
};

// -==============login function==============

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await getDB();
    const usersColl = db.collection("users");

    // email validation---------
    const user = await usersColl.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Invalid Email, account doesn't exist" });
    }

    // --------password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // creating token
    const payload = { email: user.email, id: user._id };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // sending cookie as response
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .send({
        success: true,
        user: { username: user.username, email: user.email },
      });
  } catch (error) {
    res.status(500).send({ message: "Server Error: " + error.message });
  }
};

module.exports = { registerUser, logoutUser, loginUser };
