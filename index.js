require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const goalRoutes = require("./routes/goalRoutes");
const insightsRoutes = require("./routes/insightRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

connectDB();

// global middlware

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/transactions", transactionRoutes);
app.use("/goals", goalRoutes);
app.use("/insights", insightsRoutes);
app.use("/budgets", budgetRoutes);

app.listen(port, () => {
  console.log("server is running at port:", port);
});
