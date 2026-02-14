const { getDB } = require("../config/db");

const getBudgets = async (req, res) => {
  const { email } = req.params;
  const db = getDB();

  const budgets = await db
    .collection("budgets")
    .find({ userEmail: email })
    .toArray();

  const spending = await db
    .collection("transactions")
    .aggregate([
      {
        $match: {
          userEmail: email,
          type: "expense",
          // filter for current month/year
        },
      },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
    ])
    .toArray();

  const report = budgets.map((b) => {
    const spentObj = spending.find((s) => s._id === b.category);
    return {
      category: b.category,
      limit: b.limit,
      spent: spentObj ? spentObj.totalSpent : 0,
      percent: spentObj ? (spentObj.totalSpent / b.limit) * 100 : 0,
    };
  });

  res.send(report);
};

const setBudget = async (req, res) => {
  const { category, limit } = req.body;
  const userEmail = req.user.email;
  const db = getDB();

  try {
    const result = await db
      .collection("budgets")
      .updateOne(
        { userEmail, category },
        { $set: { limit: parseFloat(limit), updatedAt: new Date() } },
        { upsert: true },
      );
    res.status(201).send({ message: "Budget saved successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to save budget" });
  }
};

module.exports = { getBudgets, setBudget };
