const mongoose = require("mongoose");

const mongoDB = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB database:", error);
  });

module.exports = mongoDB;
