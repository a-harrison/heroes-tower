var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

// Load database URI
var dbConfig = require('./config/db.js');
var appConfig = require('./config/app.js');

// Load routes
var heroes = require('./routes/heroes.js');

// CORS Middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

// Create a db variable outside of connection to reuse the connection
db = null;
HEROES_COLLECTION = "heroes";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(allowCrossDomain);

// Connect to the database before starting server.
mongodb.MongoClient.connect(dbConfig.uri, function(err, database) {
  if(err) {
    console.log('ERROR: Failed to establish connection to the database.');
    console.log(err);
    process.exit(1);
  }

  // Save the database object from the callback.
  db = database;
  console.log('Database connection established successfully.');

  // HEROES API ROUTES BELOW
  // Apply heroes routes
  app.use('/api', heroes);
  app.get('/*', function(req, res) {
    res.redirect('/');
  });

  // Initialize the app.
  var server = app.listen(appConfig.port || 8080, function() {
    var port = server.address().port;
    console.log('Accepting connections on port ' + port);
  });
});

// Generic error handler used by all endpoints.
function handleError(reason, message, code) {
  console.log('ERROR: ', reason);
  res.status(code || 500).json({"error" : message});
}
