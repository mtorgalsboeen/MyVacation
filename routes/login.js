var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{
    layout: 'plain', // No Layout
    title: 'Login'
  });
});

module.exports = router;
