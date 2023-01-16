const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

app.set(cors());
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/spotify", spotifyRoutes);
app.use("/api", playlistRoutes);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
