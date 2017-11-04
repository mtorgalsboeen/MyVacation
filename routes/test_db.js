var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var assert = require('assert');

// URL FOR ACCESSING THE DATABASE (Sensitive Information)
let url = process.env.MONGODB_URL;

// USEFULL LINK FOR MONGODB TERMONOLOGY:
//  https://docs.mongodb.com/manual/reference/sql-comparison/


router.get('/', function(req, res, next) {
  mongo.connect(url, function(err, db) {
    if(err) {
      // If there was an error print it
      res.send("There was an error connecting to the database: " + err);
    } else {
      // Get all documents (sql: rows) in the collection (sql: table) 'test-collection'
      let collection = db.collection('test-collection').find({});
      
      // iterate through collection and add all documents to an array
      // feed a callback function to happen after this iteration
      // So that we know all of our data is there (async troubleshooting)
      collection.toArray(function(err, result) {
        if(err) {
          res.send("There was an error: "+err);
        } else if (result.length) {
          res.render('test_db', {items: JSON.stringify(result)});
        } else {
          // res.send('No documents found');
          res.render('test_db', {items: "" });
        }
        db.close();
      }); 
    }
  });
});

// When a post request is made to the /test_db/insert page
router.post('/insert', function(req, res, next) {
  let item = {
    title: req.body.title,      // form data with name of title
    content: req.body.content   // form data with name of content
  };
  // Sanitization and validation of post request data goes here
  
  // Connect to the database
  mongo.connect(url, function(err, db) {
    if(err) {
      res.send("There was an error connecting to the database: "+err);
    } else {
      
      // Insert into collection 'test-collection', the 
      // Collections are like tables in sql databases
      db.collection('test-collection').insertOne(item, function(err, result) {
        if(err) {
          res.send("There was an error: "+err);
        } else {
          console.log('Item inserted');
          db.close();
          res.redirect('/test_db'); 
        }
      }); 
    }
    
  });
  
});

module.exports = router;
var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var assert = require('assert');

// URL FOR ACCESSING THE DATABASE (Sensitive Information)
let url = process.env.MONGODB_URL;

// USEFULL LINK FOR MONGODB TERMONOLOGY:
//  https://docs.mongodb.com/manual/reference/sql-comparison/


router.get('/', function(req, res, next) {
  mongo.connect(url, function(err, db) {
    if(err) {
      // If there was an error print it
      res.send("There was an error connecting to the database: " + err);
    } else {
      // Get all documents (sql: rows) in the collection (sql: table) 'test-collection'
      let collection = db.collection('test-collection').find({});
      
      // iterate through collection and add all documents to an array
      // feed a callback function to happen after this iteration
      // So that we know all of our data is there (async troubleshooting)
      collection.toArray(function(err, result) {
        if(err) {
          res.send("There was an error: "+err);
        } else if (result.length) {
          res.render('test_db', {items: JSON.stringify(result)});
        } else {
          res.send('No documents found');
        }
        db.close();
      }); 
    }
  });
});

// When a post request is made to the /test_db/insert page
router.post('/insert', function(req, res, next) {
  let item = {
    title: req.body.title,      // form data with name of title
    content: req.body.content   // form data with name of content
  };
  // Sanitization and validation of post request data goes here
  
  // Connect to the database
  mongo.connect(url, function(err, db) {
    if(err) {
      res.send("There was an error connecting to the database: "+err);
    } else {
      
      // Insert into collection 'test-collection', the 
      // Collections are like tables in sql databases
      db.collection('test-collection').insertOne(item, function(err, result) {
        if(err) {
          res.send("There was an error: "+err);
        } else {
          console.log('Item inserted');
          db.close();
          res.redirect('/test_db'); 
        }
      }); 
    }
    
  });
  
});

module.exports = router;
