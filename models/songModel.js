const Mongoose = require("mongoose");
const songSchema = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  song_id: {
    type: String,
    required: true,
  },
  playlists: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
});
module.exports = Mongoose.model("Song", songSchema);