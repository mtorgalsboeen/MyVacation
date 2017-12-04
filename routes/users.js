var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var cryptoJS = require('crypto-js');
var validator = require('validator');

var functions = require("./functions.js");
var hashPassword = functions.hashPassword;
var verifyPassword = functions.verifyPassword;
var createUserToken = functions.createUserToken;
var sanitizeUser = functions.sanitizeUser;
var isValidInput = functions.isValidInput;

// Models
var User = mongoose.model('User');

router.post('/create', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Validate Input
    if (!(isValidInput(username) && isValidInput(password))) {
        res.send(JSON.stringify({
            error: "Username and/or Password was formatted incorrectly"
        }));
        return;
    }
    
    console.log("Username: " + username + ", Password: " + password);
    
    // Check if user exists
    User.findOne({ 'username': username }).exec(function(err, user) {
        if (user != null) { // If this user exists in the database, error
            res.send(JSON.stringify({
                error: "The username supplied already exists in out database"
            }));
            return;
        }

        var hashedPassword = hashPassword(password);

        // Username is not taken in database
        var newUser = new User({
            username: username,
            password: hashedPassword,
            userToken: createUserToken(username),
            vacations: [],
            favorites: []
        });
        console.log(JSON.stringify(newUser));
        
        newUser.save(function(err) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({
                    error: "Error creating user: saving user failed"
                }));
            }
            else {
                req.session.userToken = newUser.userToken;
                console.log("User created, login successful");
                res.send(JSON.stringify({
                    status: "User created, login successful"
                }));
            }
        });

    });
});


router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Validate Input
    if (!(isValidInput(username) && isValidInput(password))) {
        res.send(JSON.stringify({
            error: "Username or Password was formatted incorrectly"
        }));
        return;
    }

    // Check if user exists
    User.findOne({ 'username': username }).exec(function(err, user) {
        if (user != null) { // If this user exists in the database, set up the session
            // verify password
            var isequal = verifyPassword(password, user.password);

            if (isequal) { // The password was correct
                req.session.userToken = user.userToken;
                console.log("User login successful");
                res.send(JSON.stringify({
                    success: "Login Successful"
                }));
            }
            else { // The password was incorrect
                res.send(JSON.stringify({
                    error: "Incorrect username or password"
                }));
            }
        }
        else {
            // User does not exist
            res.send(JSON.stringify({
                error: "The username supplied does not exists in out database"
            }))
        }
    });
});


router.get("/:text", function(req, res) {
    var text = req.params.text;
    var result = hashPassword(text);
    // var result = createUserToken(text);

    res.send(JSON.stringify(result));
});

module.exports = router;
