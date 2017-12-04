var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
 module.exports = function(app) {

	 router.post("/getInfo",function(req,res){
	    // console.log("Get info",req.body)

	    // yelp.search({term: 'food', location: '90210', price: '1,2,3', limit: 10})
	    yelp.search({term: req.body.term, location: req.body.location, limit: 20})
	    .then(function (data) {
	        // console.log(data);
	        res.json({"status":true,"data":JSON.parse(data)});
	    })
	    .catch(function (err) {
	        // console.error(err);
	        res.json({"status":false,"err":err});
	    });
	    
	})

	
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); 
	});
};