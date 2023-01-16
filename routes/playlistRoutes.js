const express = require("express");
const User = require("../models/userModel");
//const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");
const isAuthenticated = require("../middlewares/auth");
const playlistModel = require("../models/playlistModel");
//const fetch = require("node-fetch");
require("dotenv").config();
const router = express.Router();

router.post("/playlists", isAuthenticated, async (req, res) => {
  try {
    const { PlaylistName, description } = req.body;
    const user = req.user.id;
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }
    const existingPlaylist = await playlistModel.findOne({ PlaylistName });
    if (existingPlaylist) {
      res.status(403).json({
        err: "playlist already exist",
      });
    }
    const { id } = req.user;
    const newPlaylist = {
      userId: id,
      PlaylistName,
      description,
    };
    console.log(newPlaylist);
    const createdPlaylist = new playlistModel(newPlaylist);
    await createdPlaylist.save();
    foundUser.playlists.push(newPlaylist);
    await foundUser.save();
    res.status(201).json({
      message: "Playlist created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.get("/playlists", isAuthenticated, async (req, res) => {
  try {
    const user = req.user.id;
    const foudUser = await User.findById(user);
    if (!foudUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }
    const authUserPlayList = await playlistModel.find({ userId: foudUser });
    if (!authUserPlayList) {
      return res.status(404).json({ err: "You do not have a playlist" });
    }
    return res.status(200).json({ authUserPlayList });
  } catch (error) {
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.get("/playlists/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const user = req.user.id;
    const foudUser = await User.findById(user);
    if (!foudUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }
    const existingPlaylist = await playlistModel.findById(playlistId);
    console.log(existingPlaylist);
    if (!existingPlaylist) {
      return res.status(404).json({
        err: "Playlist not found",
      });
    }
    res.status(200).json(existingPlaylist);
  } catch (error) {
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.put("/playlists/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const foundPlaylist = await playlistModel.findById(req.params.playlistId);
    if (!foundPlaylist) {
      return res.status(404).json({
        err: "Playlist cannot be found",
      });
    }
    if (foundPlaylist.songs.length > 0) {
      return res.status(403).json({
        err: " Cannot delete Playlist with songs",
      });
    }
    const { PlaylistName, description } = req.body;
    const updatedPlaylist = await playlistModel.updateOne(
      { _id: req.params.id },
      { PlaylistName, description }
    );
    res.status(200).json(updatedPlaylist);
  } catch (e) {
    res.status(500).json({
      err: e.message,
    });
  }
});

router.delete("/playlists/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const user = req.user.id;
    const foudUser = await User.findById(user);
    console.log(foudUser);
    if (!foudUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }
    const foundPlaylist = await playlistModel.findById(req.params.playlistId);
    console.log(foundPlaylist);
    if (!foundPlaylist) {
      return res.status(404).json({
        err: "Playlist cannot be found",
      });
    }
    if (foundPlaylist.songs.length > 0) {
      return res.status(403).json({
        err: " Cannot delete Playlist with songs",
      });
    }

    foudUser.playlists.pull(req.params.playlistId);
    await foudUser.save();
    await playlistModel.findByIdAndDelete(foundPlaylist);
    res.status(200).json({ msg: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({
      err: error.message,
    });
  }
});

router.post(
  "/playlists/:playlistId/songs",
  isAuthenticated,
  async (req, res) => {
    try {
      const user = req.user.id;
      const foudUser = await User.findById(user);
      if (!foudUser) {
        return res.status(404).json({
          err: "User cannot be found",
        });
      }

      const foundPlaylist = await playlistModel.findById(req.params.playlistId);
      if (!foundPlaylist) {
        return res.status(404).json({
          err: "Playlist cannot be found",
        });
      }
      const { song_id } = req.body;
      const existingSong = await Song.findOne({ song_id });
      if (existingSong) {
        res.status(403).json({
          err: "Song already exist in Playlist",
        });
      }
      const newSong = new Song({
        userId: user,
        song_id,
      });
      await newSong.save();
      // foudUser.songs.push(newSong);
      // await foudUser.save();
      foundPlaylist.songs.push(newSong);
      await foundPlaylist.save();
      res.status(201).json({
        message: "Song created successfully",
      });
    } catch (error) {
      res.status(500).json({
        err: error.message,
      });
    }
  }
);

router.delete("/playlists/:playlistId/songs", isAuthenticated, async (req, res) => {
    try {
      const user = req.user.id;
      const foudUser = await User.findById(user);
      if (!foudUser) {
        return res.status(404).json({
          err: "User cannot be found",
        });
      }
      const foundPlaylist = await playlistModel.findById(req.params.playlistId);
      if (!foundPlaylist) {
        return res.status(404).json({
          err: "Playlist cannot be found",
        });
      }
      const { song_id } = req.body;
      const existingSong = await Song.findOne({ song_id });
      if (!existingSong) {
        res.status(403).json({
          err: "Song not in the Playlist",
        });
      }
      await foundPlaylist.songs.pull(existingSong);
      await foundPlaylist.save();
      await existingSong.delete();
      res.status(201).json({
        message: "Song deleted",
      });
    } catch (error) {
      res.status(500).json({
        err: error.message,
      });
    }
  }
);

router.get("/songs", isAuthenticated, async (req, res) => {
  try {
    const api_url = "	https://api.spotify.com/v1/browse/featured-playlists";
    const fecth_response = await fetch(api_url);
    const jsonData = await fecth_response.json();
    console.log(jsonData);
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({
      err: error.message,
    });
  }
});

module.exports = router;
