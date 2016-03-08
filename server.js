var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

// Load database URI
var dbConfig = require('./config/db.js');
var appConfig = require('./config/app.js');

// Load routes
var heroes = require('./routes/heroes');

var HEROES_COLLECTION = "heroes";

// CORS Middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

// Create a db variable outside of connection to reuse the connection
var db;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(allowCrossDomain);

// HEROES API ROUTES BELOW
// Apply heroes routes
//app.use('/heroes', heroes);

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

  // Initialize the app.
  var server = app.listen(appConfig.port || 8080, function() {
    var port = server.address().port;
    console.log('Accepting connections on port ' + port);
  });
});

// /* GET HOME PAGE */
app.get('/', function(req, res) {
  res.render('./index.html');
})

// API ROUTES
app.get("/hero/:id", function(req, res) {
  db.collection(HEROES_COLLECTION).find({ "_id" : req.params.id }).limit(1).toArray(function(err, doc) {
    if(err) {
      handleError(err.message, "Failed to get contact.");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/heroes", function(req, res) {
  db.collection(HEROES_COLLECTION).find({}).toArray(function(err, docs) {
    if(err) {
      handleError(err.message, "Failed to retrieve list of heroes.");
    } else {
      res.status(200).json(docs);
    }
  })
});

app.post("/heroes", function(req, res) {
  var newHero = req.body;

  if(!( req.body.name )) {
    handleError("Invalid user input.", "Must provide a hero name", 400);
  }

  db.collection(HEROES_COLLECTION).insertOne(newHero, function(err, doc) {
    if(err) {
      handleError(err.message, "Failed to insert the new hero.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// DEBUG ONLY
// Print out all registered routes.
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log(r.route.path)
    }
  });

// Generic error handler used by all endpoints.
function handleError(reason, message, code) {
  console.log('ERROR: ', reason);
  res.status(code || 500).json({"error" : message});
}
