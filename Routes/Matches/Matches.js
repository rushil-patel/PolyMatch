var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.get('/:usrId/Matches', function(req, res) {
	var query = req.query;
	var keys = Object.keys(query);
	var usrId = req.params.usrId;
	var vld = req.validator;
	var cnn = req.cnn;

	async.waterfall([
	function(cb) {
		if (vld.checkPrsOK(usrId, cb)) {
			// Create where clause
			pairs = [];
			keys.forEach(function(key) {
				pairs.push(key + " = " + query[key]);
			});
			
			var where = "";
			if (pairs.length) {
				where = ' where ' + pairs.join(" and ");
			}
			console.log(where);

			cnn.chkQry('select * from (select oldPerson as usr, score, saved, archived, notes' +
			    ' from Matches where newPerson = ?) as S JOIN (select * from User)' +
			    ' as U ON S.usr = U.id JOIN (select * from Preferences) as P ON U.id = P.userId'
			    + where + ' order by score desc',
				[usrId], cb);
		}
	},
	function(result, fields, cb) {
		res.status(200).json(result);
		cb();
	}],
	function(err) {
		cnn.release();
	});
});


router.put('/:usrId/Matches/:mId', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;
	var mId = req.params.mId;
	var body = req.body;

	async.waterfall([
	function(cb) {
		if (vld.checkPrsOK(usrId, cb) && 
			vld.check(!(body.saved && body.archived), 
			 Tags.badValue, ['saved', 'archived'], cb)) {
			cnn.chkQry('update Matches set ? where id = ?', [body, mId], cb);
		}
	}],
	function(err) {
		if (!err) {
			res.status(200).end();
		}
		cnn.release();
	});
});

router.get('/:usrId/Matches/:mId', function(req, res) {
	var vld = req.validator;
	var cnn = req.cnn;
	var mId = req.params.mId;

	async.waterfall([
	function(cb) {
		if (vld.checkPrsOK(usrId)) {
			cnn.chkQry('select * from Matches where id = ? and ' + 
			 'newPerson = ?', [mId, usrId], cb);
		}
	},
	function(match, fields, cb) {
		if (vld.check(match.length, Tags.notFound, null, cb)) {
			cnn.chkQry('select id, score, firstName, lastName, email, ' +
			 ' gender, age, introduction, picture from Matches M JOIN User' + 
			 ' U ON M.newPerson = U.id where id = ?', [mId], cb);
		}
	},
	function(matchInfo, fields, cb) {
		res.status(200).json(matchInfo);
		cb();
	}],
	function(err) {
		cnn.release();
	});
});





module.exports = router;