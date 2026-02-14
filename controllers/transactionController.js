const { getDB, connectDB } = require("../config/db");

const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, date, note } = req.body;
    const userEmail = req.user.email;

    if (!title || !amount || !category || !type || !date) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const db = getDB();

    const newTransaction = {
      title,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date(date),
      note: note || "",
      userEmail,
      createdAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .insertOne(newTransaction);

    if (result.insertedId) {
      res.status(201).send(result);
    } else {
      res.status(500).send({ message: "Failed to save Transaction" });
    }
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const db = getDB();

    const transactions = await db.collection("transactions").find().toArray();
    res.send(transactions);
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { addTransaction, getTransactions };
