const uri = process.env.DB_URI;
const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  const client = new MongoClient(uri);

  await client.connect();
  console.log("mongoDB connected with fintrack DB");

  db = client.db("fintrackDB");
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
