var cryptoJS = require('crypto-js');
var validator = require('validator');
var crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

var hashPassword = function(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData.passwordHash+passwordData.salt;
}

var verifyPassword = function(password, combined) {
    var salt = combined.substring(combined.length-16);
    var passwordToCheck = sha512(password,salt);
    var storedPassword = combined.substr(0,combined.length-16);
    return (passwordToCheck.passwordHash === storedPassword);
}

/**
 *  For user creation, make their usertoken with this function 
 *  @param {!String} username
 */
var createUserToken = function(username) {
    var text = username;
    var hash = crypto.HmacSHA256(text, process.env.SESSION_SECRET);
    var hashInBase64 = crypto.enc.Base64.stringify(hash);
    return hashInBase64+""+Date.now();  // Date.now() is arbitrary, but should confirm no duplicates
}

/**
 *  Returns an object containing all non-critical user data
 *      Send this to client-side instead of db user document
 *  @param {!User} username
 */
var sanitizeUser = function(user) {
    var safeUser = {
        '_id' : user._id,
        'vacations' : user.vacations,
        'favorites' : user.favorites
    };
    return safeUser;
}

var isValidInput = function(username) {
    return /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){5,20}[a-zA-Z0-9]$/.test(username);
}

module.exports = {
    'hashPassword':hashPassword,
    'verifyPassword':verifyPassword,
    'createUserToken':createUserToken,
    'sanitizeUser':sanitizeUser,
    'isValidInput':isValidInput
}