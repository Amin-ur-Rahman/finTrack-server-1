const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const updateProfile = async (req, res) => {
  try {
    const { username, currency, imageUrl } = req.body;
    const db = getDB();
    const usersColl = db.collection("users");

    const filter = { _id: new ObjectId(req.user._id) };
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

module.exports = { updateProfile };
