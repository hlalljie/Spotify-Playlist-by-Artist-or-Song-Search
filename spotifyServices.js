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


async function test(){
    // let playlists = await getPlaylists();
    // console.log(playlists);
    // let playlistSongs = await getPlaylistSongIds('1IVwtXaUJUj04E31RlB6Dw');
    // console.log(playlistSongs);
    //let playlistsWithSong = await getPlaylistsBySong('4bQnTqI06ZRyl8QL2AmIMW'); // Returns Digital Fire and Thunderbird
    // let playlistsWithSong = await getPlaylistsBySong('6Vv0mO1JBb2rMj1iTm2buD'); // Returns Chilling in the lobby and Lofi megalist
    // console.log(playlistsWithSong);
    let playlistsWithArtist = await getPlaylistsByArtist('3JKd43oYlE7ifoodXetsuw');
    console.log(playlistsWithArtist);
    // let artistData = await getArtistData('2wY79sveU1spLqoDqtJeJh');
}

// GET PLAYLISTS \\
// Save all of the playlists for the user in an array
async function getPlaylists(){
    var newAccessToken = await getSpotifyAccessToken();
    var config = {
        headers: {
            'Authorization': 'Bearer ' + newAccessToken.access_token
        }
    }
    let playlists = [];
    await axios.get('https://api.spotify.com/v1/users/' + process.env.SPOTIFY_USER_ID + '/playlists?offset=0&limit=50', config)
    .then(response => {
        //console.log(response.data);
        // map response data to array of playlist objects containing the playlist name and id
        playlists = response.data.items;//.map(item => ({name: item.name, id: item.id}));
    })
    .catch(error => {
        console.error('Get Playlists Error:', error.message);
    });
    //console.log(playlists);
    return playlists;
}

// GET PLAYLIST SONGS \\
// Return an array of all the playlist songs
async function getPlaylistSongs(playlistId){
    var newAccessToken = await getSpotifyAccessToken();
    var config = {
        headers: {
            'Authorization': 'Bearer ' + newAccessToken.access_token
        }
    }
    let playlistSongs = [];
    await axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', config)
    .then(response => {
        //console.log(response.data);
        // map response data to get array of track ids
        playlistSongs = response.data.items;//.map(item => item.track.id);
    })
    .catch(error => {
        console.error('Get Playlist Songs Error:', error.message);
    });
    //console.log(playlistSongIds);
    return playlistSongs;
}

// GET PLAYLISTS BY SONG \\
// Return all user playlists that containing a given song id
async function getPlaylistsBySong(songId){
    let playlists = await getPlaylists();
    let playlistsWithSong = [];
    for(let i = 0; i < playlists.length; i++){
        let playlistSongs = await getPlaylistSongs(playlists[i].id);
        if (playlistSongs.some(song => song.track.id === songId)){
            playlistsWithSong.push({name: playlists[i].name, id: playlists[i].id});
        }
    }
    return playlistsWithSong;
    
}

// GET PLAYLISTS BY ARTIST \\
// Return all user playlists that containing a given artist id
async function getPlaylistsByArtist(artistId){
    let playlists = await getPlaylists();
    let playlistsWithArtist = [];
    for(let i = 0; i < playlists.length; i++){
        let playlistSongs = await getPlaylistSongs(playlists[i].id);
        if (playlistSongs.some(song => song.track.artists[0].id === artistId)){
            playlistsWithArtist.push({name: playlists[i].name, id: playlists[i].id});
        }
    }
    return playlistsWithArtist;
}

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
        //console.log(response.data);
        artistData = response.data;
    })
    .catch(error => {
        console.error('Get Artist Error:', error.message);
    });
    return artistData;
}
// END GET ARTIST DATA \\

test();

module.exports = {
    getArtistData,
    getPlaylists,
    getPlaylistsBySong
};
