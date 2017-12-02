var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Models
var User = mongoose.model('User');

// New User Creation
router.post('/loginOrCreate', function(req, res, next) {
    // console.log("Reached User Creation Page");
    // Middleware has assured that user token is genuine, create the user
    
    // Check if user exists
    User.findOne({userToken:req.body.userToken}).exec(function(err,user) {
        if (user != null) { // If this user exists in the database, set up the session
            req.session.userToken = user.userToken;
            res.send(JSON.stringify({
                status: "User Logged In"
            }));
        } else {    // Otherwise create a new user and the set up the session
            var newUser = new User({
                userToken: req.body.userToken,
                vacations:[],
                favorites:[]
            });
            newUser.save(function(err) {
                if(err) {
                    res.send(JSON.stringify({
                        error: "Error creating user"
                    }));
                } else {
                    req.session.userToken = newUser.userToken;
                    res.send(JSON.stringify({
                        status: "User Created"
                    }));
                }
            });
        }
    });
});





router.post('/testCreate', function(req, res, next) {
    // Verify the id_token easily using google's tokeninfo endpoint
    var id_token = req.body.id_token;
    var url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+id_token;
    
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .done(function(response) {
        res.send(response);
    })
    .fail(function(err) {
        res.send("Ajax Error");
    })
    .always(function() {
        // console.log( "Completed" );
    });
});


module.exports = router;
