const Mongoose = require("mongoose");
const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    playlists: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    // songs: [
    //   {
    //     type: Mongoose.Schema.Types.ObjectId,
    //     ref: "Song",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
