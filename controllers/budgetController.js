const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getBudgets = async (req, res) => {
  const email = req.user.email;

  console.log("Fetching budgets for email:", email);

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const db = getDB();

  try {
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
          },
        },
        { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
      ])
      .toArray();

    const report = budgets.map((b) => {
      const spentObj = spending.find((s) => s._id === b.category);
      return {
        _id: b._id,
        category: b.category,
        limit: b.limit,
        spent: spentObj ? spentObj.totalSpent : 0,
        percent: spentObj ? (spentObj.totalSpent / b.limit) * 100 : 0,
      };
    });

    res.send(report);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const setBudget = async (req, res) => {
  const { category, limit } = req.body;
  const userEmail = req.user.email;
  const db = getDB();

  try {
    //   if budget already exists for this category
    const existingBudget = await db
      .collection("budgets")
      .findOne({ userEmail, category });

    if (existingBudget) {
      return res.status(400).send({
        message: "Budget already exists for this category. Use edit instead.",
      });
    }

    const result = await db.collection("budgets").insertOne({
      userEmail,
      category,
      limit: parseFloat(limit),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).send({
      message: "Budget created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).send({ message: "Failed to save budget" });
  }
};

const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { limit } = req.body;
  const userEmail = req.user.email;
  const db = getDB();

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid budget ID" });
    }

    if (!limit || parseFloat(limit) <= 0) {
      return res.status(400).send({ message: "Invalid limit amount" });
    }

    const result = await db.collection("budgets").updateOne(
      {
        _id: new ObjectId(id),
        userEmail: userEmail,
      },
      {
        $set: {
          limit: parseFloat(limit),
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: "Budget not found or you don't have permission to edit it",
      });
    }

    res.status(200).send({
      message: "Budget updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).send({ message: "Failed to update budget" });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;
  const db = getDB();

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid budget ID" });
    }

    const result = await db.collection("budgets").deleteOne({
      _id: new ObjectId(id),
      userEmail: userEmail,
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Budget not found or you don't have permission to delete it",
      });
    }

    res.status(200).send({
      message: "Budget deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).send({ message: "Failed to delete budget" });
  }
};

module.exports = {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget,
};
