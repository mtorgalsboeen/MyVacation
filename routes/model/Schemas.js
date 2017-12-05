const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var Task = new Schema({
        taskId: ObjectId,
        taskTitle: {type: String, trim: true},
        completed: Boolean
});

var ToDoList = new Schema({
        toDoListId: ObjectId,
        toDoListTitle: {type: String, trim: true},
        tasks: [Task]
});

var Location = new Schema({
        locationId: ObjectId,
        yelpApiId: {type: String, trim: true}
});

var Vacation = new Schema({
    vacationId: ObjectId,
    vacationTitle: {type: String, trim: true},
    vacationDescription: {type: String, trim: true},
    locations: [Location],
    toDoLists: [ToDoList]
});

var User = new Schema({
    userId: ObjectId,
    username: {type: String, required: true},
    password: {type: String, required: true},
    userToken:  {type: String, required: true},
    vacations: [Vacation],
    favorites: [Location]
});


module.exports = {
    'Task':Task,
    'ToDoList':ToDoList,
    'Location':Location,
    'Vacation':Vacation,
    'User':User
}