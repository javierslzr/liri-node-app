// DEPENDENCIES
// =====================================
// Read and set environment variables
require("dotenv").config();

// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");

// Import the API keys
var keys = require("./keys");

// Import the axios npm package.
var axios = require("axios");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// Helper function that gets the artist name
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for running a Spotify search

var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

// Function for running a Movie Search
var getMeMovie = function (movieName) {

    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }

    var urlHit =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&6715d602=trilogy";

    axios.get(urlHit).then(
        function (response) {
            var jsonData = response.data;

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        }
    );
};

// Function for running a command based on text file
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

// Function for determining which command is executed
var pick = function (caseData, functionData) {
    switch (caseData) {
        case "concert-this":
            getMyBands(functionData);
            break;
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMeMovie(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI doesn't know that");
    }
};

// Function which takes in command line arguments and executes correct function accordingly
var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

// MAIN PROCESS
// =====================================
runThis(process.argv[2], process.argv.slice(3).join(" "));

