var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Vacation = mongoose.model('Vacation');
var User = mongoose.model('User');
var Location = mongoose.model('Location');

/*
    Go to vacation creation page (GET)
*/
router.get('/create', function(req, res, next) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if(err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
            return;
        }
        res.render('vacationCreation', {
           title: "Vacation Creation" 
           // Anything else to send? 
        });
    });
});


/*
    Create a vacation
*/
router.post('/create', function(req, res, next) {
    var newVacation = new Vacation({
        'vacationTitle': req.body.vacationTitle,
        'vacationDescription': req.body.vacationDescription,
        'locations': req.body.locations,
        'toDoLists': req.body.toDoLists
    });
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
            return;
        }
        var addedVacation = user.vacations.create(newVacation);
        user.vacations.push(addedVacation);
        user.save(function(err, user) {
            if (err) {
                res.send(JSON.stringify({
                    error: "Error saving vacation"
                }));
            }
            else {
                res.send(JSON.stringify(addedVacation));
            }
        });
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

            if (vacation != null) { // If so, delete and save
                vacation.remove();
                user.save(function(err) {
                    if (err) {
                        res.send(JSON.stringify({
                            error: "Error saving vacation"
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
                            success: vacation.isFulfilled
                        }));
                    }
                });
            }
            else {
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
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send({
                error: "Error finding user"
            });
            return;
        }
        
        // We have a user, check if there is a vacation with supplied id
        var vacation = user.vacations.id(req.body.vacationId);
        if (vacation != null) { // If so, update and save

            // Set the vacation details
            vacation.vacationTitle = req.body.vacationTitle;
            vacation.vacationDescription = req.body.vacationDescription;
            vacation.locations = req.body.locations;
            vacation.toDoLists = req.body.toDoLists;

            user.save(function(err) { // Save the changes 
                if (err) {
                    res.send(JSON.stringify({
                        error: "Error saving vacation"
                    }));
                }
                else {
                    res.send(JSON.stringify(vacation));
                }
            });
        }
        else {
            res.send(JSON.stringify({
                error: "Vacation not found"
            }));
        }
    });
});


/**
 * Go to specific vacation page (GET)
 *      Was placed at bottom because id paramater takes any input
 *      and overwrites any other get requests
*/
router.get('/:vacationId', function(req, res, next) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if(err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
            return;
        }
        // We have a user, check if there is a vacation with supplied id
        var vacation = user.vacations.id(req.params.vacationId);
        if (vacation != null) { // If so, send data to manage page
            res.send(JSON.stringify(vacation));
            // render the manage page here (instead of above line)
        }
        else {
            res.send(JSON.stringify({
                error: "Vacation not found"
            }));
        }
    });
});

/*
    Add location to vacation
*/
router.post('/addLocation', function(req, res, next) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send({
                error: "Error finding user"
            });
            return;
        }
        
        // We have a user, check if there is a vacation with supplied id
        var vacation = user.vacations.id(req.body.vacationId);
        
        if (vacation != null) { // If so, update and save
            console.log("Received location add request of "+ req.body.yelpApiId);
            
            var newLocation = vacation.locations.create(new Location({
                'yelpApiId' : req.body.yelpApiId
            }));
            vacation.locations.push(newLocation);
            
            user.save(function(err) { // Save the changes 
                if (err) {
                    res.send(JSON.stringify({
                        error: "Error saving location"
                    }));
                }
                else {
                    res.send(JSON.stringify(newLocation));
                }
            });
        }
        else {
            res.send(JSON.stringify({
                error: "Vacation not found"
            }));
        }
    });
});
module.exports = router;
