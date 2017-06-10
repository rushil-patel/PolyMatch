var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.baseURL = '/Majors';

router.get('/', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;

	cnn.chkQry('select * from Majors', null, function(err, mjrs, fields) {
		if (!err) {
			res.status(200).json(mjrs);
		}
	});
	cnn.release();
});

module.exports = router;