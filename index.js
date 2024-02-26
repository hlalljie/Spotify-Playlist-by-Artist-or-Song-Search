// Load modules
const express = require('express');
const services = require('./spotifyServices');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

// Initialize the Express application
const app = express();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// ROUTES \\
// Home route for testing
app.get('/', async function(req, res) {
    try {
        var newAccessToken = await getSpotifyAccessToken();
        res.send(newAccessToken);
    } catch (error) {
        // Handle errors here
        res.status(500).send('Internal Server Error requesting /');
    }
});

// GET PLAYLISTS BY SONG \\
// Get playlists from a user that contains a certain song
app.get('/playlists/song/:songId', async function(req, res){
    try {
        let playlists = await services.getPlaylistsBySong(req.params.songId);
        res.send(playlists);
    } catch (error) {
        // Handle errors here
        res.status(500).send('Internal Server Error requesting /playlists/' + req.params.songId);
    }
})

// GET PLAYLISTS \\
// Get playlists from a user
app.get('/playlists', async function(req, res){
    try {
        let playlists = await services.getPlaylists();
        res.send(playlists);
    } catch (error) {
        // Handle errors here
        res.status(500).send('Internal Server Error requesting /playlists');
    }
})

app.get('/artist/:artistId', async function(req, res){
    try {
        let artistData = await services.getArtistData(req.params.artistId)
        res.send(artistData);
    } catch (error) {
        // Handle errors here
        res.status(500).send('Internal Server Error requesting /artist/' + req.params.artistId);
    }
})

// callback route for after spotify sign in and authorization
app.get('/callback', function(req, res) {
    res.send("callback");
});
// END ROUTES \\


// Set port and listen
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});