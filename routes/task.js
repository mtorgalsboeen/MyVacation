var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Task = mongoose.model('Task');
var User = mongoose.model('User'); 

router.post('/create', function(req, res, next){
    
    var Task1 = new Task({
        'taskTitle' : req.body.taskTitle,
        'completed' : req.body.completed
        
    });
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
            else{
                
                var addTask = user.vacations.toDoLists.tasks.create(Task1);
                user.vacations.toDoLists.tasks.push(addTask); 
                user.save(function(err, user){
                    
                    if(err){
                        
                        res.send(JSON.stringify(({
                            error : "Error saving Task in To Do List"
                        })));
                    }
                    else{
                        
                        res.send(JSON.stringify(addTask));
                    }
                });
            }
            
        
    });
    
    // Once added to the database 
    // Create funtion(IN THE CLASS) to add in the task to the toDoList 
    
});

router.post('/update');

router.post('/delete');

module.exports = router;