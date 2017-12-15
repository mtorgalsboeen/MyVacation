var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Task = mongoose.model('Task');
var ToDoList = mongoose.model('ToDoList'); 
var Vacation = mongoose.model('Vacation');
var User = mongoose.model('User');



router.post('/create', function(req, res, next){
    
    var Task1 = new Task({
        'taskTitle' : req.body.taskTitle,
        'completed' : req.body.completed
        
    });
    // Find the user to add in the task before 
    
    User.findOne({
        
        "userToken":req.session.userToken,
        "user.vacations.vacationId" : req.params.vacationId,
        "user.vacations.vacationId.toDoLists.toDoListId" : req.params.toDoListId,
    }).exec(function(err, vaca){
        
        if(err){
            
            res.send(JSON.stringify({ error: "Error can't find Vacation"}));
            return; 
        }
        var addTask = vaca.toDoLists.tasks.create(Task1);
        vaca.toDoLists.tasks.push(addTask); 
        
        vaca.save(function(err, vaca){
            
            if(err){
                
                res.send(JSON.stringify({error : "Error Tasks Not Saved"})); 
                
            }
            else{
                res.send(JSON.stringify(addTask));
            }
        });
    });
    
}); 

router.post('/update', function(res, req, next){
    
    
    Vacation.findOne({
            
            "userToken":req.session.userToken,
            "user.vacations.vacationId" : req.params.vacationId,
            "user.vacations.vacationId.toDoLists.toDoListId" : req.params.toDoListId, 
            "user.vacations.vacationId.toDoLists.toDoListId.tasks.taskId" : req.params.taskId
            
    }).exec(function(err, vaca){
        
        
        if(err){
            
            res.send({error: "Error finding task"}); 
            return; 
        }
        
        var task1 = vaca.toDoLists.tasks.id(req.body.taskId);
        // task doesnt exist 
        if(task1 != null){
            
            task1.taskTitle = req.body.taskTitle;
            task1.completed = req.body.completed;
            // vacations.toDoLists.tasks.push(addTask);
            vaca.save(function(err){
                
                if(err){
                    
                    res.send(JSON.stringify({ error: "Error saving Task"})); 
                }
                else{
                    
                    res.send(JSON.stringify(task1)); 
                }
            });    
        }
        else{
            
            res.send(JSON.stringify({error : "Task Not Found"}));
        }
        
    });
}); 



router.post('/delete');

module.exports = router;