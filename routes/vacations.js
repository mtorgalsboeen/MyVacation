var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Vacation = mongoose.model('Vacation');
var User = mongoose.model('User');


/*
    Create a vacation
*/
router.post('/create', function(req, res, next) {
    var newVacation = new Vacation({
        'vacationTitle' : req.body.vacationTitle,
        'locations' : req.body.locations,
        'toDoLists' : req.body.toDoLists
    });
    User.findOne({"userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { 
            res.send(JSON.stringify({
                error: "Error finding user"
            })); 
        } else {
            var addedVacation = user.vacations.create(newVacation);
            user.vacations.push(addedVacation);
            user.save(function(err,user) {
                if(err) {
                    res.send(JSON.stringify({
                        error: "Error saving vacation"
                    }));
                } else {
                    res.send(JSON.stringify(addedVacation));
                }
            });
        }
    });
});

/*
    Delete a vacation
*/
router.post('/delete', function(req, res, next) {
    User.findOne({"userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { 
            res.send(JSON.stringify({
                error: "Error finding user"
            })); 
        } else {
            // We have a user, check if there is a vacation with supplied id
            var vacation = user.vacations.id(req.body.vacationId);
            
            if(vacation != null) {   // If so, delete and save
                vacation.remove();
                user.save(function (err) {
                    if(err) { 
                        res.send(JSON.stringify({
                            error: "Error saving vacation"
                        })); 
                    } else {
                        res.send(JSON.stringify({
                            success: vacation.isFulfilled
                        }));
                    }
                });
            } else {
                res.send(JSON.stringify({
                    error: "Vacation not found"
                })); 
            }
        }
    });
});


/*
    Update a vacation (An overwrite update)
*/
router.post('/update', function(req, res, next) {
    User.findOne({"userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { 
            res.send({
                error: "Error finding user"
            }); 
        } else {
            // We have a user, check if there is a vacation with supplied id
            var vacation = user.vacations.id(req.body.vacationId);
            if(vacation != null) {   // If so, update and save
            
                // Set the vacation details
                vacation.vacationTitle = req.body.vacationTitle; 
                vacation.locations = req.body.locations;
                vacation.toDoLists = req.body.toDoLists;
                
                user.save(function (err) {  // Save the changes 
                    if(err) {
                        res.send(JSON.stringify({
                            error: "Error saving vacation"
                        })); 
                    } else {
                        res.send(JSON.stringify(vacation));
                    }
                });
            } else {
                res.send(JSON.stringify({
                    error: "Vacation not found"
                })); 
            }
        }
    });
});
module.exports = router;
