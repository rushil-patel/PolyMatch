var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.baseURL = '/User/:usrId/Matches';

router.get('/', function(req, res) {
	var query = req.query;
	var keys = Object.keys(query);
	var usrId = req.params.usrId;
	var vld = req.validator;
	var cnn = req.cnn;

	console.log('getting!');
	console.log('usrid: ' + usrId);

	async.waterfall([
	function(cb) {
		if (vld.checkPrsOK(usrId, cb)) {
			// Create where clause
			pairs = [];
			keys.forEach(function(key) {
				pairs.add(key + " = " + query[key]);
			});
			var where = pairs.join(" and ");

			cnn.checkQry('select score, firstName, lastName, email, gender, age,' +
				' introduction, picture, saved, archived from (select * from' +
				' (select oldPerson as usr, score from Matches where newPerson = ? union' +
				' select newPerson as usr, score from Matches where oldPerson = ?)' +
				' order by score) as S JOIN (select * from User) as U ON S.usr = U.id' +
				' where ?;',
				[usrId, usrId, where], cb);
		}
	},
	function(result, cb) {
		res.status(200).json(result);
		cb();
	}],
	function(err) {
		cnn.release();
	});
});


router.put('/:mId', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;
	var mId = req.params.mId;
	var body = req.body;

	async.waterfall([
	function(cb) {
		if (vld.checkPrsOK(usrId, cb) && 
			vld.check(!(body.saved && body.archived), 
			 Tags.badValue, ['saved', 'archived'], cb)) {
			cnn.checkQry('update Matches set ? where id = ?', [body, mId], cb);
		}
	}],
	function(err) {
		if (!err) {
			res.status(200).end();
		}
		cnn.release();
	});
});

router.get('/:mId', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;
	var mId = req.params.mId;

	if (vld.checkPrsOK(usrId)) {
		cnn.checkQry('select score, firstName, lastName, email, gender, age,' +
			' introduction, picture, saved, archived from (select * from' +
			' (select oldPerson as usr, score from Matches where newPerson = ? union' +
			' select newPerson as usr, score from Matches where oldPerson = ?)' +
			' order by score) as S JOIN (select * from User) as U ON S.usr = U.id' +
			' where id = ?;', [mId], function(err, results, fields) {
				if (!err) {
					res.status(200).json(results);
				}
		});
	}
	else {
		res.status(403).end();
	}
	cnn.release();
});





