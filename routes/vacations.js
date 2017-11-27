var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Vacation = mongoose.model('Vacation');

var User = mongoose.model('User');



router.post('/create', function(req, res, next) {
    var newVacation = new Vacation({
        'vacationTitle' : req.body.vacationTitle,
        'locations' : req.body.locations,
        'toDoLists' : req.body.toDoLists
    });
    User.findOne({"userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { res.send(err); }
        else {
            var addedVacation = user.vacations.create(newVacation);
            user.vacations.push(addedVacation);
            user.save(function(err,user) {
                if(err) {
                    res.send("Database Error");
                } else {
                    res.send(JSON.stringify(addedVacation));
                }
            });
        }
    });
});

module.exports = router;
