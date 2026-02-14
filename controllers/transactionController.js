const { ObjectId } = require("mongodb");
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

const getTransactionsForAdmin = async (req, res) => {
  try {
    const db = getDB();

    const transactions = await db.collection("transactions").find().toArray();
    res.send(transactions);
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getMyTransactions = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const query = { userEmail: userEmail };
    const db = getDB();

    const result = await db
      .collection("transactions")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error fetching your transactions" });
  }
};

// =============================

const updateTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ message: "Invalid or missing Transaction ID" });
    }

    const userEmail = req.user.email;
    const { title, amount, category, type, date, note } = req.body;

    console.log(req.body);

    const db = getDB();

    const filter = {
      _id: new ObjectId(id),
      userEmail: userEmail,
    };

    const updateDoc = {
      $set: {
        ...(title && { title }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(category && { category }),
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(note !== undefined && { note }),
        updatedAt: new Date(),
      },
    };

    const result = await db
      .collection("transactions")
      .updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ message: "Record not found or unauthorized" });
    }

    res.send(result);
    console.log(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update transaction" });
  }
};

module.exports = {
  addTransaction,
  getTransactionsForAdmin,
  getMyTransactions,
  updateTransaction,
};
