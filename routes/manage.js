var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('manage', {
        title: 'Manage Vacation'
    });
});

router.get('/:vacationId', function(req, res, next) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
        }
        else {
            // We have a user, check if there is a vacation with supplied id
            var vacation = user.vacations.id(req.params.vacationId);
            if (vacation != null) { // If so, update and save
                res.render('manage', {
                    title: 'Manage Vacation',
                    vacation: JSON.stringify(vacation), // Send the entire vacation (for later)
                    vacationTitle: vacation.vacationTitle   // Send the vacationTitle separate for ease of use
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

module.exports = router;
