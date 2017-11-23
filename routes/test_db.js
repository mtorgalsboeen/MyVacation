var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var mongoose = require("mongoose");

router.get('/users', function(req, res, next) {
    mongoose.model('User').find({}).exec(function(err,items) {
        if(err) { res.send(err); }
        else {res.render('test_db',{items:JSON.stringify(items)});}
    });
});

router.get('/users-insert', function(req, res, next) {
    var User = mongoose.model('User');
    var newUser = new User({
        userToken: "njisdf89dfsf",
        vacations:[]
    });
    newUser.save(function(err) {
       if(err) { res.send("Error"); } // Incorrect format or invalid input (ex: duplication of unique values) (see schema)
       else {
        res.send("Saved!");
       }
    });
    
});


module.exports = router;
