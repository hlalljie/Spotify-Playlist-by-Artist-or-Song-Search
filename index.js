// Load modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

// Initialize the Express application
const app = express();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// GET ACCESS TOKEN \\
// Initialize variable to hold access token
var accessToken = {
    access_token: '',
    expiration: 0
}

// Set config data
const spotifyApiConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

// Get Spotify credentials from .env file
const spotifyClientData = {
    grant_type: 'client_credentials',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
}

// Get access token from Spotify, if previoustoken is still valid, return it

async function getSpotifyAccessToken(){
    // Check if access token is still valid
    if(accessToken.expiration > Date.now()){
        return accessToken;
    }
    // Send post request for access token
    await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams(spotifyClientData), spotifyApiConfig)
    .then(response => {
        console.log('Access Token:', response.data.access_token);
        accessToken.access_token = response.data.access_token;
        accessToken.expiration = Date.now() + (response.data.expires_in * 1000);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
    return accessToken;
}
// END GET ACCESS TOKEN \\

// ROUTES \\
// Home route for testing
app.get('/', async function(req, res) {
    try {
        var newAccessToken = await getSpotifyAccessToken();
        res.send(newAccessToken);
    } catch (error) {
        // Handle errors here
        res.status(500).send('Internal Server Error');
    }
});

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