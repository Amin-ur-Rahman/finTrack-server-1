require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const { connectDB } = require("./config/db");
const auth = require("./routes/authRoutes");

connectDB();

// global middlware

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/api/auth", auth);

app.listen(port, () => {
  console.log("server is running at port:", port);
});
