const { getDB } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const db = getDB();
    const transactionsCollection = await db.collection("transactions");

    const stats = await transactionsCollection
      .aggregate([
        { $match: { userEmail: userEmail } },
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const formattedStats = {
      income: stats.find((s) => s._id === "income")?.totalAmount || 0,
      expense: stats.find((s) => s._id === "expense")?.totalAmount || 0,
      transactionCount: stats.reduce((acc, curr) => acc + curr.count, 0),
    };

    formattedStats.balance = formattedStats.income - formattedStats.expense;

    res.send(formattedStats);
    console.log(formattedStats);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch stats" });
  }
};

module.exports = { getDashboardStats };
