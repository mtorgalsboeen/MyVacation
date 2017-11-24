var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Models
var User = mongoose.model('User');

// New User Creation
router.post('/create', function(req, res, next) {
    console.log("Reached User Creation Page");
    // Middleware has assured that user token is genuine, create the user
    
    // Check if user exists
    User.findOne({userToken:req.body.userToken}).exec(function(err,user) {
        if (user != null) { // If this user exists in the database, set up the session
            req.session.userToken = user.userToken;
            res.redirect("/");
        } else {    // Otherwise create a new user and the set up the session
            var newUser = new User({
                userToken: req.body.userToken,
                vacations:[]
            });
            newUser.save(function(err) {
                if(err) { 
                    res.render('login', { layout: 'plain', error: err });
                } else {
                    req.session.userToken = newUser.userToken;
                    res.redirect("/");
                }
            });
        }
    });
});

module.exports = router;
