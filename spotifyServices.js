require('dotenv').config();
const axios = require('axios');


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
        // console.log('Access Token:', response.data.access_token);
        accessToken.access_token = response.data.access_token;
        accessToken.expiration = Date.now() + (response.data.expires_in * 1000);
    })
    .catch(error => {
        console.error('Get Access Token Error:', error.message);
    });
    return accessToken;
}
// END GET ACCESS TOKEN \\

// GET ARTIST DATA (FOR TESTING) \\
async function getArtistData(artistId){
    var newAccessToken = await getSpotifyAccessToken();
    var config = {
        headers: {
            'Authorization': 'Bearer ' + newAccessToken.access_token
        }
    }
    let artistData = {};
    await axios.get('https://api.spotify.com/v1/artists/' + artistId, config)
    .then(response => {
        console.log(response.data);
        artistData = response.data;
    })
    .catch(error => {
        console.error('Get Artist Error:', error.message);
    });
    return artistData;
}
// END GET ARTIST DATA \\

module.exports = {
    getArtistData
  };
