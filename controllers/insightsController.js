const { getDB } = require("../config/db");

const getFinancialInsights = async (req, res) => {
  const { email } = req.params;
  const db = getDB();

  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await db
      .collection("transactions")
      .aggregate([
        { $match: { userEmail: email } },
        {
          $facet: {
            // total income vs expense
            summary: [
              {
                $group: {
                  _id: "$type",
                  total: { $sum: "$amount" },
                },
              },
            ],
            // spent by category
            categories: [
              { $match: { type: "expense" } },
              {
                $group: {
                  _id: "$category",
                  amount: { $sum: "$amount" },
                },
              },
              { $sort: { amount: -1 } },
            ],
            //balance up and down
            trend: [
              { $match: { date: { $gte: startOfMonth } } },
              {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  netChange: {
                    $sum: {
                      $cond: [
                        { $eq: ["$type", "income"] },
                        "$amount",
                        { $multiply: ["$amount", -1] },
                      ],
                    },
                  },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ])
      .toArray();

    const result = stats[0];

    // calculating total balance from summary
    const income = result.summary.find((s) => s._id === "income")?.total || 0;
    const expense = result.summary.find((s) => s._id === "expense")?.total || 0;

    res.send(
      {
        totals: { income, expense, balance: income - expense },
        categories: result.categories,
        trend: result.trend,
        hasEnoughData: result.categories.length > 0,
      } || {},
    );
  } catch (error) {
    console.error("Insight Error:", error);
    res.status(500).send({ message: "Error generating insights" });
  }
};

module.exports = { getFinancialInsights };
