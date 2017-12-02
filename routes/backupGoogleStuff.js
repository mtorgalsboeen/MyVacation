var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://myvacation-cwilliams4.c9users.io/oauthcallback"
);


// set auth as a global default
google.options({
    auth: oauth2Client
});

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'profile',
    'email'
];

var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes,

    // Optional property that passes state parameters to redirect URI
    // state: 'foo'
});

app.use("/googleSignInScreen", function(req, res) {
    res.send(url);
});

app.use("/oauthcallback", function(req, res) {
    var currentUrl = req.originalUrl;

    // Get authorizationcode from url
    var index = currentUrl.lastIndexOf("code=");
    var code = currentUrl.substr(index + 5).replace("#", "");
    
    console.log(JSON.stringify(oauth2Client));
    console.log("current url before code: "+ currentUrl);
    console.log("getting token for code: " + code);
    oauth2Client.getToken(code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            console.log("got token: "+ tokens.id_token);
            // oauth2Client.setCredentials(tokens); // Currently bugged using manual set (below) until fix
            oauth2Client.credentials = tokens; // Manually assign the credentials
            
            console.log("Authenticating tokens");
            authenticateIdToken(tokens, function(validUserToken) {
                if (validUserToken!=null) {
                    loginOrCreateUser(validUserToken, function(success) {
                        if (success) {
                            req.session.userToken = validUserToken;
                            res.redirect("/");
                        }
                        else {
                            res.render('login', JSON.stringify({
                                error: "Error creating user"
                            }));
                        }
                    });
                }
                else {
                    res.render('login', JSON.stringify({
                        error: "Error creating user"
                    }));
                }
            });
        } else {
            // res.send(err);
            console.log('Error while trying to retrieve access token', err);
            res.send(err);
            return;
        }
    });
});

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