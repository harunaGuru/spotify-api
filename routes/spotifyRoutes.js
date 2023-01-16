const express = require("express");
const isAuthenticated = require("../middlewares/auth");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();
const router = express.Router();
// Initialize the Spotify Web API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log(data.body);
  })
  .catch((error) => {
    console.log("Error getting token", error);
  });

router.get("/songs", isAuthenticated, (req, res) => {
  spotifyApi
    .getNewReleases({ limit: 5, offset: 0, country: "NG" })
    .then((data) => {
      res.send(data.body);
    })
    .catch((error) => {
      console.log("Error getting artist", error);
    });
});

router.get("/songs/:song_id", isAuthenticated, (req, res) => {
    const { song_id } = req.params;
  spotifyApi
    .getAlbum(song_id)
      .then((data) => {
        console.log(data.body);
      res.send(data.body);
    })
    .catch((error) => {
      console.log("Error getting album", error);
    });
}
)

router.get("/songs/search", isAuthenticated, (req, res) => {
    const { term } = req.query;
    spotifyApi
      .searchTracks(term)
      .then((data) => {
        return res.send(data.body);
      })
      .catch((error) => {
        console.log("Error getting Search", error);
      });
})
module.exports = router