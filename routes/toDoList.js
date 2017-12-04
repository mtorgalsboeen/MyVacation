var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var ToDoList = mongoose.model('ToDoList');

router.post('/create', function(req, res, next){
    var newToDoList = new ToDoList({
        'title' : req.body.title,
        'task' : req.body.task
    }); // ask should a task obj be made ? 
    
}); 

router.post('/update', function(req, res, next){
    
    ToDoList.findOne({})
});

router.post('/delete');