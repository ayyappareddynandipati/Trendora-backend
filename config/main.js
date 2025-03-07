const { MongoClient } = require("mongodb");

// MongoDB Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("myDatabase");
    const users = db.collection("users");

    // Insert a document
    await users.insertOne({ name: "Vin", age: 21, city: "Hyderabad" });

    // Fetch documents
    const result = await users.find().toArray();
    console.log("Users:", result);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
