require("dotenv").config();
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var command = process.argv[2];
var media = process.argv[3];
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

function movie(media) {
    axios.get("http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy").then(
    function(response) {
        if (response.data.Title === "Undefined") {
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/. It's on Netflix!")
        }
        else {
            
            console.log("Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nIMDB Rating: "
            + response.data.imdbRating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + 
            response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot +
            "\nActors: " + response.data.Actors);
        }   
    });
}

function concert(media) {
    axios.get("https://rest.bandsintown.com/artists/" + media + "/events?app_id=codingbootcamp").then(
    function(response) {
        console.log("Venue: " + response.data[0].venue.name + "\nLocation: " + response.data[0].venue.city + ", " + response.data[0].venue.country + "\nDate: " + moment(response.data[0].datetime).format('MM/DD/YYYY'));
    });
}

function song(media) {
    if (!media) {
        spotify.search({ type: 'track', query: 'ace of base the sign' }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            
           
          console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nName: " + data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name); 
          });
    }
    else {
        spotify.search({ type: 'track', query: media }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            
           
          console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nName: " + data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name); 
          });
    }
}

if (command === "movie-this") {
    movie(media);
}

if (command === "concert-this") {
    concert(media);
}

if (command === "spotify-this-song") {
    song(media);
}

if (command === "do-what-it-says") {
    fs.readFile('random.txt', 'utf8', (err, data) => {
        if (err) throw err;
        var input = data.split(",");
        command = input[0];
        media = input[1];
        if (command === "movie-this") {
            movie(media);
        }
        if (command === "concert-this") {
            concert(media);
        }
        if (command === "spotify-this-song") {
            song(media);
        }
      });
}