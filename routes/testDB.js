var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var functions = require('./functions.js');
var sanitizeUser = functions.sanitizeUser;

var User = mongoose.model('User');
var Vacation = mongoose.model('Vacation');
var ToDoList = mongoose.model('ToDoList');
var Task = mongoose.model('Task');


/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
        }
        else {
            // Do not pass the userToken to client side (security)
            user = sanitizeUser(user);
            res.render('testDB', {
                title: 'MyVacation',
                user: JSON.stringify(user)
            });
        }
    });
});


/**
 *  Creates a vacation for the current user,
 *      a ToDoList within that user,
 *      and a task within that ToDoList
 */
router.get('/createTaskPath', function(req, res, next) {
    User.findOne({ "userToken": req.session.userToken }).exec(function(err, user) {
        if (err) {
            res.send(JSON.stringify({
                error: "Error finding user"
            }));
        }
        else {
            // Create a toDoList
            var newVacation = user.vacations.create(new Vacation({
                vacationTitle: "Test Vacation Title at " + Date.now(),
                locations: [],
                toDoList: []
            }));
            user.vacations.push(newVacation);

            var newToDoList = newVacation.toDoLists.create(new ToDoList({
                toDoListTitle: "Test ToDoList at " + Date.now(),
                tasks: []
            }));
            newVacation.toDoLists.push(newToDoList);

            var newTask = newToDoList.tasks.create(new Task({
                taskTitle: "Test Task at " + Date.now(),
                complete: false
            }));
            newToDoList.tasks.push(newTask);

            user.save(function(err, user) {
                if (err) {
                    res.send(JSON.stringify({
                        error: "Error saving vacation"
                    }));
                }
                else {
                    // Do not pass the userToken to client side (security)
                    user = sanitizeUser(user);
                    res.redirect('/');
                }
            });
        }
    });
});

module.exports = router;
