var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/************ Database Setup ************/
var db = require('./routes/model/db');
/****************************************/


/************ Controllers ************/
var index = require('./routes/index');
var chat = require('./routes/chat');
var login = require('./routes/login');
var users = require('./routes/users');
var vacations = require('./routes/vacations');
var mange = require('./routes/mange');
/*************************************/

var app = express();

// set static scripts path (one in node_modules)
app.use('/scripts', express.static(__dirname + '/node_modules'));

// set statuc classes path
app.use('/classes', express.static(__dirname + '/public/js/classes'));

/********** Session Setup **********/
// https://github.com/expressjs/session
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  name: 'MyVacation.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,
    sameSite: true
  }
}));
/***********************************/


/********** View Engine Setup **********/
var hbs = require("express-handlebars");
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
/***************************************/


app.use(favicon(path.join(__dirname,'public/img/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*********************** Login System ***********************/
// Define login path
app.use('/login', login);

// General Request Middleware
// If a session is not set, redirect to login page OR
// If a user creation is being attempted, authenticate and continue
app.use(function(req,res,next) {
  
  /**** Check if a user creation is being attempted ****/
  // Verify it is the /users/create path
  var userCreation = (req.originalUrl === "/users/create"); 
  // Verify it is a post request
  userCreation = userCreation && (req.method === "POST");
  // Verify there is a userToken being sent with the request
  userCreation = userCreation && (req.body.userToken);
  /*****************************************************/
  
  // Verify, Authenticate, and Re-route as Needed
  if (req.session.userToken) { // User token is set in session
      if (true) {  // Check if user token is authentic function(userToken)
          next();
      } else {  // User token was not authentic
          res.redirect('/login');
      }
  } else if (userCreation) {  // User creation
      // Authenticate user token with google
      if(true) {
          next();
      } else {
          res.render('login', { error: "Failed Google Authentication" });
      }
  } else {  // User token was not set
      res.redirect('/login');
  }
});
/***********************************************************/


/************ Routes ************/
app.use('/', index);
app.use('/chat', chat);
app.use('/users', users);
app.use('/vacations', vacations);
app.use('/mange', mange);

// Logout
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});
/********************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{layout: 'plain', title: "Error", error: res.locals.message});
});


/******** Socket Io ********/ 
var socket_io = require("socket.io");
var io = socket_io();
app.io = io;

var connections = [];
var usernames = [];

io.on("connection", function(socket){
  connections.push(socket);
  
  socket.on('new user', function(data, callback) {
    if(usernames.indexOf(data) != -1) {
      // Username taken
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });
  
  socket.on("disconnect", function(data) {
    connections.splice(connections.indexOf(socket), 1);
    if(!socket.username) {
      return;
    } else {
     usernames.splice(usernames.indexOf(socket.username), 1);
     updateUsernames();
    }
  });
  
  socket.on('send message', function(data) {
    // console.log(data);
    io.sockets.emit('new message', {msg: data, username: socket.username}); 
  });
  
  function updateUsernames() {
    io.sockets.emit('update usernames', usernames);
  }
});
/****** End Socket Io ******/ 

module.exports = app;
