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

	async.waterfall([
	function(cb) {
		cnn.chkQry('select * from HobbyEnum where name = ?',
		 [body.name], cb);
	},
	function(result, fields, cb) {
		if (vld.check(!result.length, Tags.dupHobby, null, cb))
			cnn.chkQry('insert into HobbyEnum set ?', [req.body], cb);
	},
   function(result, fields, cb) {
      res.location(router.baseURL + '/' + result.insertId).end();
      cb()
   }],
	function(err) {
		cnn.release();
	});
})

module.exports = router;
