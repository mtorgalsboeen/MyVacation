var express = require('express');
var router = express.Router();
var io = require('socket.io');

//req.body.chatUsername.replace(/ /g,'');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('chat', {});
});


module.exports = router;