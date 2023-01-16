const Mongoose = require("mongoose");
const playlistSchema = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  PlaylistName: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Song",
    },
  ],
});

module.exports = Mongoose.model("Playlist", playlistSchema);
