// Bring Mongoose into the app 
var mongoose = require('mongoose');

// Setup the promise library
var Promise = require("bluebird");
Promise.promisifyAll(mongoose);
mongoose.Promise = Promise;

// Build the connection string 
var dbURI = process.env.MONGODB_URL; 

// Create the database connection 
mongoose.connect(dbURI, { useMongoClient: true }); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

// BRING IN YOUR SCHEMAS & MODELS
var Schemas = require('./Schemas');
var Task = mongoose.model('Task',Schemas.Task);
var ToDoList = mongoose.model('ToDoList',Schemas.ToDoList);
var Location = mongoose.model('Location',Schemas.Location);
var Vacation = mongoose.model('Vacation',Schemas.Vacation);
var User = mongoose.model('User',Schemas.User);