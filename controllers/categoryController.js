const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const addCategory = async (req, res) => {
  try {
    const { name, type, icon } = req.body;
    const db = getDB();

    const existing = await db.collection("categories").findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return res.status(400).send({ message: "Category already exists" });
    }

    const newCategory = {
      name: name.toLowerCase(),
      type: type.toLowerCase(),
      icon: icon || "FaTag",
      createdBy: new ObjectId(req.user._id),
      createdAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(newCategory);
    res.status(201).send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: "Error creating category" });
  }
};

const getCategories = async (req, res) => {
  try {
    const db = getDB();
    const categories = await db.collection("categories").find().toArray();
    res.send(categories);
  } catch (error) {
    res.status(500).send({ message: "Error fetching categories" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const result = await db
      .collection("categories")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error deleting category" });
  }
};

module.exports = { addCategory, getCategories, deleteCategory };
