var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.baseURL = '/Matches';

router.get('/:usrId/Matches', function(req, res) {
	var query = req.query;
	var usrId = req.params[0];
	var vld = req.validator;
	var cnn = req.cnn;

	async.waterfall([
	function(cb) {
		if (vld.checkPrsOK(usrId)) {
			cnn.checkQry('select score, firstName, lastName, email, gender, age,' +
				' introduction, picture, saved, archived from (select * from' +
				' (select oldPerson as usr, score from Matches where newPerson = ? union' +
				' select newPerson as usr, score from Matches where oldPerson = ?)' +
				' order by score) as S JOIN (select * from User) as U ON S.usr = U.id;',
				[usrId, usrId], cb);
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