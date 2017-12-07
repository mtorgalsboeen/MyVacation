var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var Vacation = mongoose.model('Vacation');
var functions = require('./functions.js');
var sanitizeUser = functions.sanitizeUser;

// module.exports = function(app) {

router.get("/", function(req, res) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
            return;
        }
        user = sanitizeUser(user);
        res.render('entertainment', {
            title: 'Entertainment',
            user: JSON.stringify(user)
        });
    });
});

router.post("/yelpSearch", function(req, res) {
    // console.log("Get info",req.body)

    // yelp.search({term: 'food', location: '90210', price: '1,2,3', limit: 10})
    yelp.search({ term: req.body.term, location: req.body.location, limit: req.body.limit })
        .then(function(data) {
            // console.log(data);
            // res.json({ "status": true, "data": JSON.parse(data) });
            res.send(data);
        })
        .catch(function(err) {
            // console.error(err);
            // res.json({ "status": false, "error": err });
            res.send(JSON.stringify({
                error: "Error finding locations"
            }));
        });

});


/*
    Create a favorite (location)
*/
router.post('/createFavorite', function(req, res, next) {

    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
            return;
        }
        var addedLocation = user.favorites.create(new Location({
            'yelpApiId': req.body.yelpApiId
        }));
        user.favorites.push(addedLocation);
        user.save(function(err, user) {
            if (err) {
                res.send(JSON.stringify({
                    error: "Error saving favorite location"
                }));
            }
            else {
                res.send(JSON.stringify(addedLocation));
            }
        });
    });
});


router.get("/getYelpLocation/:id", function(req, res) {

    // console.log(req.params.id);
    yelp.get('businesses/' + req.params.id, undefined)
        .then(function(response) {
            // console.log(response);
            res.send(response);
        })
        .catch(function(err) {
            // console.log(err);
            res.send(JSON.stringify({
                error: "Error finding business"
            }));
        });
});

module.exports = router;