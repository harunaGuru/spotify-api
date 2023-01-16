const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    //mongoose.set("strictQuery", false);
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://haroon:BVpRzjFEytWoIbwG@cluster0.tx7vqpz.mongodb.net/spotifyDB?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database Connected");
  } catch (err) {
    console.log("Could not connect to MongoDB");
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
