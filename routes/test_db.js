var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var mongoose = require("mongoose");

// Models
var User = mongoose.model('User');
var Vacation = mongoose.model('Vacation');

// User Data Pulled By Session's userToken
router.get('/', function(req, res, next) {
    User.find({"userToken":req.session.userToken}).exec(function(err,user) {
        res.render('test_db',{
            title: "User Session Data",
            items: JSON.stringify(user)
        }); 
    });
});

// Get All Users
router.get('/users', function(req, res, next) {
    mongoose.model('User').find({}).exec(function(err,items) {
        if(err) { res.send(err); }
        else {
            res.render('test_db',{
                title: "All Users",
                items:JSON.stringify(items)
            });
        }
    });
});

// router.get('/users-insert', function(req, res, next) {
//     var newUser = new User({
//         userToken: "njisdfdfsfsfii",
//         vacations:[]
//     });
//     newUser.save(function(err) {
//       if(err) { res.send("Error"); } // Incorrect format or invalid input (ex: duplication of unique values) (see schema)
//       else {
//         res.redirect("/test_db/users")
//       }
//     });
// });

// Get User by Id
router.get('/users/:userId', function(req, res, next) {
    User.findOne({"_id": req.params.userId}).exec(function(err,user) {
        if(err) { res.render('test_db', {}); }
        else {
            res.render('test_db', {
                title: "User by ID",
                items: JSON.stringify(user) 
            });
        }
    });
});

// Get Vacation By Id Within User
router.get('/users/:userId/vacations/:vacationId', function(req, res, next) {
    User.findOne({"_id": req.params.userId}).exec(function(err,user) {
        if(err) { res.render('test_db', {}); }
        else {
            var vacation = user.vacations.id(req.params.vacationId);
            res.render('test_db',{
                title: "Vacation by ID",
                items:JSON.stringify(vacation)
            });
        }
    });
});

// router.get('/vacations-insert', function(req, res, next) {
//     var newVacation = new Vacation({
//         vacationTitle: "The Vacation Title",
//         locations: [],
//         toDoLists: []
//     });
//     User.findOne({"userToken":"njisdf89dfsf"}).exec(function(err,user) {
//         if(err) { res.send(err); }
//         else {
//             user.vacations.push(newVacation);
//             user.save();
//             res.redirect("/test_db/users");
//         }
//     });
// });

module.exports = router;
