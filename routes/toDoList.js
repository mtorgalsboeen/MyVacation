var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var ToDoList = mongoose.model('ToDoList');
var Vacation = mongoose.model('Vacation');
var User = mongoose.model('User');

router.post('/create', function(req, res, next){
    var newToDoList = new ToDoList({
        'title' : req.body.title,
        'task' : req.body.task
    }); // ask should a task obj be made ? 
    
    User.findOne({
        
        "userToken": req.session.userToken, 
        "user.vacations.vacationId" : req.params.vacationId
        
    }).exec(function (err, vaca) {
       
       if(err){
           
           res.send(JSON.stringify({error : "Error Vacation Not Found"})); 
       }
       
       var addToDo = vaca.toDoLists.create(newToDoList);
       vaca.toDoLists.push(addToDo); 
       vaca.save(function(err, vaca){
           
           if(err){
               
               res.send(JSON.stringify({ error : "Error Saving ToDoList"}))
           }
           else{
               
               res.send(JSON.stringify(addToDo));
           }
       }); 
       
    });
    
}); 

router.post('/update', function(req, res, next){
    
    User.findOne({
        
        "userToken": req.session.userToken, 
        "user.vacations.vacationId" : req.params.vacationId,
        "user.vacations.vacationId.toDoLists.toDoListId" : req.params.toDoListId
    }).exec(function(err, user){
        
        if(err){
            
            res.send({ error : "Error ToDoList not found"}); 
        }
        
        
        var addToDo = user.vacations.toDoLists.id(req.params.toDoListId); 
        if(addToDo != null){
            
            addToDo.toDoListTitle = req.body.title;
            user.save(function(err){
                
                if(err){
                    
                    res.send(JSON.stringify({ error : "Error saving ToDoList" }));
                }
                else{
                    
                    res.send(JSON.stringify(addToDo));
                }
            });
        }
        else{
            
            res.send(JSON.stringify({ error: "Error ToDoList Not found"}));
        }
    })
    
});

router.post('/delete');