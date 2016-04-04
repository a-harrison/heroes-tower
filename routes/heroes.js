var express = require('express');
var router = express.Router();

/* "/api/heroes
*  GET : Find all heroes
*  POST : Create a new hero
*
* "/api/hero/:_id
* GET : Find hero by _id
*/

router.get("/hero/:_id", function(req, res) {
  db.collection(HEROES_COLLECTION).findOne({ "_id" : parseInt(req.params._id) }, function(err, doc) {
    if(err) {
      handleError(err.message, "Failed to get contact.");
    } else {
      res.status(200).json(doc);
    }
  });
});

router.get("/heroes", function(req, res) {
  db.collection(HEROES_COLLECTION).find({}).toArray(function(err, docs) {
    if(err) {
      handleError(err.message, "Failed to retrieve list of heroes.");
    } else {
      res.status(200).json(docs);
    }
  });
});

router.post("/heroes", function(req, res) {
  var newHero = req.body;

  if(!( req.body.name )) {
    handleError("Invalid user input.", "Must provide a heor name", 400);
  }

  db.collection(HEROES_COLLECTION).insertOne(newHero, function(err, doc) {
    if(err) {
      handleError(err.message, "Failed to insert the new hero.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

module.exports = router;
