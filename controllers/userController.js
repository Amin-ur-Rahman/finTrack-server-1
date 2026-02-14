const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const updateProfile = async (req, res) => {
  try {
    const { username, currency, imageUrl } = req.body;
    const db = getDB();
    const usersColl = db.collection("users");
    // console.log("user_ID", req.user.id);

    const filter = { _id: new ObjectId(req.user.id) };
    const updateDoc = {
      $set: {
        ...(username && { username }),
        ...(currency && { currency }),
        ...(imageUrl && { photoUrl: imageUrl }),
        updatedAt: new Date(),
      },
    };

    const result = await usersColl.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating profile", error: error.message });
  }
};

// ===========================================================

const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const usersColl = db.collection("users");
    const users = await usersColl.find().toArray();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).send({ message: "Invalid role type" });
    }
    const db = getDB();
    const usersColl = db.collection("users");
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: { role: role } };

    const result = await usersColl.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Role update failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const db = getDB();
    const usersColl = db.collection("users");

    const userToDelete = await usersColl.findOne({
      _id: new ObjectId(id),
    });

    if (userToDelete?.role === "admin") {
      return res.status(403).send({
        message:
          "Security violation: Admins cannot be deleted via this endpoint.",
      });
    }

    const result = await usersColl.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Account deletion failed" });
  }
};

module.exports = { updateProfile, getAllUsers, updateUserRole, deleteUser };
