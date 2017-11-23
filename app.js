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
var users = require('./routes/users');
var test_db = require('./routes/test_db');
var chat = require('./routes/chat');
/*************************************/

var app = express();

// set static scripts path (one in node_modules)
app.use('/scripts', express.static(__dirname + '/node_modules'));


/********** Session Setup **********/
// https://github.com/expressjs/session
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
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


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/test_db', test_db);
app.use('/chat', chat);

// catch 404 and forward to error handler
// app.use(function(req,res,next) is the general format for
//    making something happen on all requests
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
  res.render('error');
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
    console.log(data); 
    io.sockets.emit('new message', {msg: data, username: socket.username}); 
  });
  
  function updateUsernames() {
    io.sockets.emit('update usernames', usernames);
  }
});
/****** End Socket Io ******/ 

module.exports = app;
