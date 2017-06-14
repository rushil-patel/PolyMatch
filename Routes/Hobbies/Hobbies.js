var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.get('/:usrId/Hobbies', function(req, res) {

	var user = req.params.usrId;
	var cnn = req.cnn;
   var vld = req.validator;
	var query = 'select *'
	 + ' from Hobbies H join HobbyEnum HE on H.hobbyId = HE.id'
	 + ' where H.userId = ? order by HE.id asc';

	async.waterfall([
	function(cb) {
		cnn.chkQry('select id from User where id = ?', [user], cb);
	},
   function(prs, fields, cb) {
      if (vld.check(prs.length, Tags.notFound, ["user"], cb))
         cnn.chkQry(query, [user], cb);
   },
   function(hobbies, fields, cb) {
      res.json(hobbies);
      cb();
   }],
	function(err) {
      cnn.release();
	});

});

router.post('/:usrId/Hobbies', function(req, res) {

   var user = req.params.usrId;
   var cnn = req.cnn;
   var body = req.body;
   var vld = req.validator;
   var update = 'insert into Hobbies (userId, hobbyId) values ?';
   var hobbyFoundList, errorRes, batch;
   var emptyBody;

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(user, cb)) 
         cnn.chkQry('select id from User where id = ?', [user], cb);
   },
   function(prs, fields, cb) {
      if (vld.check(prs.length, Tags.notFound, ["user"], cb)) {
         hobbyFoundList = body.map(function(hobbyObj) {
            return hobbyObj.id;
         });
         if (hobbyFoundList.length)
            cnn.chkQry("select * from HobbyEnum where id in (?)", [hobbyFoundList], cb);
         else {
            emptyBody = true;
            cb(emptyBody);
         }
      }
   },
   function(hobby, fields, cb) {
      if (vld.check(hobby.length == body.length, Tags.notFound, ["hobby"], cb)) {
         cnn.chkQry("select * from Hobbies where hobbyId in (?)", [hobbyFoundList], cb);
      }
   },
   function(results, fields, cb) {
      if (vld.check(!results.length, Tags.dupHobby, ["Hobby already associated with User"], cb)) {
         batch = body.map(function(hobbyObj) {
            return [user, hobbyObj.id];
         });
         cnn.chkQry(update, [batch], cb);
      }
   }],
   function(err) {
      res.end();
      cnn.release();
   });

});

router.delete('/:usrId/Hobbies/:hobbyId', function(req, res) {

   var user = req.params.usrId;
   var hobby = req.params.hobbyId;
   var cnn = req.cnn;
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(user, cb)) 
         cnn.chkQry('select id from User where id = ?', [user], cb);
   },
   function(prs, fields, cb) {
      if (vld.check(prs.length, Tags.notFound, ["user"], cb))
         cnn.chkQry('select id from HobbyEnum where id = ?', [hobby], cb);
   },
   function(hobbyFound, fields, cb) {
      if (vld.check(hobbyFound.length, Tags.notFound, ["hobby"], cb)) {
         cnn.chkQry('delete from Hobbies where userId = ? and hobbyId = ?',
          [user, hobby], cb);
      }
   }],
   function(err) {
      if (!err)
         res.status(200).end();

      cnn.release();
   });

});

module.exports = router;