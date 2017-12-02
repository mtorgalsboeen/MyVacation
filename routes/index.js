var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({"login.userToken":req.session.userToken}).exec(function(err,user) {
        if(err) { 
            res.send(JSON.stringify({
                error: "Error finding user"
            })); 
        } else {
            // Do not pass the userToken to client side (security)
            res.render('index', {
                title: 'MyVacation',
                user: JSON.stringify(user)
            });
        }
    });
  
  
  
});

module.exports = router;
