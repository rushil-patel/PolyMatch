var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.baseURL = '/Hobbies';

router.get('/', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;

	cnn.chkQry('select * from HobbyEnum order by id asc', null,
	 function(err, hobbies, fields) {
		if (!err) {
			res.status(200).json(hobbies);
		}
	});
	cnn.release();
});

router.post('/', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;
	var body = req.body;
	var errorRes;
	var batch;
	var emptyBody;

	async.waterfall([
	function(cb) {

		if (body.length)
			cnn.chkQry('select * from HobbyEnum where name in (?)',
		 	 [body], cb);
		else {
			emptyBody = true;
			res.json([]);
			return cb(emptyBody);
		}
	},
	function(result, fields, cb) {
		if (result.length) {
			errorRes = result.map(function(hobbyObj) {
				return hobbyObj.name;
			});
		}
		if (vld.check(!result.length, Tags.dupHobby, errorRes, cb)) {
			batch = body.map(function(name) {
				return [name];
			});
			cnn.chkQry('insert into HobbyEnum (name) values ?', [batch], cb);
		}
	},
   function(result, fields, cb) {
   	  cnn.chkQry('select * from HobbyEnum where name in (?)', [body], cb);
   },
   function(result, fields, cb) {
   	res.json(result);
   	cb();
   }],
	function(err) {
		cnn.release();
	});
})

module.exports = router;
