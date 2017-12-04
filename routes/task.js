var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Task = mongoose.model('Task');
var User = mongoose.model('User'); 

router.post('/create', function(req, res, next){
    
    // Find the user to add in the task before 
    User.findOne({
        
            "userToken": req.session.userToken, 
            "user.vacations.vacationId" : req.params.vacationId,
            "user.vacations.vacationId.toDoList.toDoListId" : req.params.toDoListId
            
        }
        ).exec(function(err, user){
        
            // Catches Errors 
            if(err){
                
                res.send(JSON.stringify({error : "Error could not find user"}));
                
            }
            //else{
                
            //     var addTask = user.
            // }
            
        
    }
    );
    
    // Once added to the database 
    // Create funtion(IN THE CLASS) to add in the task to the toDoList 
    var Task1 = new Task({
        'taskTitle' : req.body.taskTitle,
        'completed' : req.body.completed
        
    });
});

router.post('/update');

router.post('/delete');

