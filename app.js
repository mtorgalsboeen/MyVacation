var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var url = require('url') ;

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

app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));

app.use("/images", express.static(__dirname + '/public/img'));

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


app.use(favicon(path.join(__dirname, 'public/img/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/********************** Google **********************/
var mongoose = require('mongoose');
var User = mongoose.model('User');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


var clientSecret = process.env.GOOGLE_CLIENT_SECRET;
var clientId = process.env.GOOGLE_CLIENT_ID;

/**
 * CHANGE THIS TO YOUR LOCAL URL
*/
/***********************************/
//Chris LOCAL URL
//var redirectUrl = "https://myvacation-cwilliams4.c9users.io/oauthcallback";
/***********************************/

/***********************************/
// Sarah LOCAL URL
var redirectUrl = "https://my-vacation-sarah-villegas.c9users.io/oauthcallback";
/***********************************/

/***********************************/
// Thalia LOCAL URL
//var redirectUrl = "https://myvaction-thaliav.c9users.io/oauthcallback";
/***********************************/

/***********************************/
// Mathias LOCAL URL
//var redirectUrl = "https://ide.c9.io/mtorgalsboeen/myvacationyelpoauthcallback";
/***********************************/


var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

// Define login path
app.use('/login', login);

// Define Logout path
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.use("/googleSignInScreen", function(req, res) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'profile'
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    res.send(authUrl);
});

app.use("/oauthcallback", function(req, res) {
    var currentUrl = req.originalUrl;

    // Get authorizationcode from url
    var index = currentUrl.lastIndexOf("code=");
    var code = currentUrl.substr(index + 5).replace("#", "");
    
    getNewToken(oauth2Client,code, function(err, oauth2Client, userToken, tokens) {
        if(err) {
            console.log("There was an error getting a new token: " + err);
            res.redirect("/login");
            return;
        }
        req.session.googleClientTokens = JSON.stringify(tokens);
        req.session.userToken = userToken;
        res.redirect("/");
    });
});


/**
 * Request middleware to check the session and handle logins
 */
 
app.use(function(req, res, next) {
    if(req.session.googleClientTokens && req.session.userToken) {
        oauth2Client.credentials = JSON.parse(req.session.googleClientTokens);
        
        // Check if user exists
        User.findOne({ userToken: req.session.userToken }).exec(function(err, user) {
            if (user == null) {
                // If this user doesn't exist in our database anymore (for whatever reason)
                // Log out of the current session
                res.redirect("/logout");
                return;
            }
            else {
                next(); // Continue with request
            }
        });
    } else {
        // send them to login page
        res.redirect('/login');
        return;
    }
});

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, code, callback) {
    console.log("Code obtained by url: " + code);
    
    oauth2Client.getToken(code, function(err, token) {
        if (err) {
            callback('Error while trying to retrieve access token '+err,null,null);
            return;
        }
        oauth2Client.credentials = token;
        console.log("Authenticating tokens");
        authenticateIdToken(token, function(validUserToken) {
            if (validUserToken!=null) {
                loginOrCreateUser(validUserToken, function(success) {
                    if (success) {
                        callback(null,oauth2Client,validUserToken, token);
                    }
                    else {
                        callback("Error creating user",null,null);
                    }
                });
            }
            else {
                callback("Error creating user",null,null);
            }
        });
    });
}

/**
 * Authenticate id_token through Google's endpoint
 */

function authenticateIdToken(tokens, callback) {
    console.log("Authenticating token: " + tokens.id_token);
    var url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + tokens.id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === "ok" || xhr.status == 200) {
            var userToken = JSON.parse(xhr.responseText).sub;
            callback(userToken);
        }
        else {
            // Failed
            callback(null);
        }
    };
    xhr.send();
}

/**
 * Upon a new login, create the user if they do not exist in the database
 * or log them in like normal
 */

function loginOrCreateUser(validUserToken, callback) {
    // Check if user exists
    User.findOne({ userToken: validUserToken }).exec(function(err, user) {
        if (user != null) { // If this user exists in the database, set up the session
            callback(true);
        }
        else { // Otherwise create a new user and the set up the session
            var newUser = new User({
                userToken: validUserToken,
                vacations: [],
                favorites: []
            });
            newUser.save(function(err) {
                if (err) {
                    callback(false);
                }
                else {
                    callback(true);
                }
            });
        }
    });
}

/******************************************************/


/************ Routes ************/
app.use('/', index);
app.use('/chat', chat);
app.use('/users', users);
app.use('/vacations', vacations);
app.use('/mange', mange);
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
    res.render('error', { layout: 'plain', title: "Error", error: res.locals.message });
});


/******** Socket Io ********/
var socket_io = require("socket.io");
var io = socket_io();
app.io = io;

var connections = [];
var usernames = [];

io.on("connection", function(socket) {
    connections.push(socket);

    socket.on('new user', function(data, callback) {
        if (usernames.indexOf(data) != -1) {
            // Username taken
            callback(false);
        }
        else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    socket.on("disconnect", function(data) {
        connections.splice(connections.indexOf(socket), 1);
        if (!socket.username) {
            return;
        }
        else {
            usernames.splice(usernames.indexOf(socket.username), 1);
            updateUsernames();
        }
    });

    socket.on('send message', function(data) {
        // console.log(data);
        io.sockets.emit('new message', { msg: data, username: socket.username });
    });

    function updateUsernames() {
        io.sockets.emit('update usernames', usernames);
    }
});
/****** End Socket Io ******/

module.exports = app;
