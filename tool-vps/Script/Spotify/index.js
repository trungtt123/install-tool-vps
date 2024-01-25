const spotifySignUp = require('./SignUp/spotifySignUp');
const spotifyLogin = require('./Login/login');
const listen = require('./Listen/index');
const spotify = {
    spotifySignUp,
    spotifyLogin,
    listen
}
module.exports = spotify;