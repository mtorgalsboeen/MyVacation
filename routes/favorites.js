var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


var functions = require('./functions.js');
var sanitizeUser = functions.sanitizeUser;

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({"userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { 
            res.send(JSON.stringify({
                error: "Error finding user"
            })); 
        } else {
            // Do not pass the userToken to client side (security)
            user = sanitizeUser(user);
            res.render('favorites', {
                title: 'Favorites',
                user: JSON.stringify(user)
            });
        }
    });
});

module.exports = router;
