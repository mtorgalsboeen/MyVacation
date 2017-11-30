var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({"userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { 
            res.send(JSON.stringify({
                error: "Error finding user"
            })); 
        } else {
            user.userToken = null;
            res.render('index', {
                title: 'MyVacation',
                user: JSON.stringify(user)
            });
        }
    });
  
  
  
});

module.exports = router;
