const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createGoal = async (req, res) => {
  try {
    const newGoal = {
      ...req.body,
      userEmail: req.user.email,
      currentAmount: 0,
      createdAt: new Date(),
    };
    console.log("newGoaldata", newGoal);

    const db = getDB();
    const result = await db.collection("savingGoals").insertOne(newGoal);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create goal" });
  }
};

const contributeToGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, title } = req.body;
    const userEmail = req.user.email;

    const db = getDB();
    const parsedAmount = parseFloat(amount);
    await db
      .collection("savingGoals")
      .updateOne(
        { _id: new ObjectId(id) },
        { $inc: { currentAmount: parsedAmount } },
      );

    //   creating backend transaction
    const transactionDoc = {
      userEmail,
      title: title || "Goal Contribution",
      amount: parsedAmount,
      category: "Savings",
      type: "expense",
      date: new Date(),
      note: `Added to goal: ${id}`,
      isSavingsContribution: true,
    };

    const result = await db
      .collection("transactions")
      .insertOne(transactionDoc);
    res.status(200).send({ message: "Contribution successful", result });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getGoals = async (req, res) => {
  try {
    const userEmail = req.params.email;
    if (!userEmail) {
      return res.status(400).send({ message: "invalid request" });
    }
    const db = getDB();
    const myGoals = await db.collection("savingGoals").find().toArray();
    res.send(myGoals);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { createGoal, contributeToGoal, getGoals };
