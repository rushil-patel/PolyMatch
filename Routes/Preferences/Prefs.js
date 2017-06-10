var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.get('/:usrId/Prefs', function(req, res) {

	var user = req.params.usrId;
	var cnn = req.cnn;
   var vld = req.validator;
	var query = 'select *' + 
	 ' from Preferences P' +
	 ' where P.userId = ?';

   async.waterfall([
   function(cb) {
      cnn.chkQuery(query, [user], cb);  
   },
   function(results, fields, cb) {
      if (vld.check(results.length, Tags.notFound, null, cb)) {
         res.json(results);
         cb();
      }
   }],
   function(err) {
      cnn.release();
   });

});

router.post('/:usrId/Prefs', function(req, res) {

   var user = req.params.usrId;
   var cnn = req.cnn;
   var vld = req.validator;
   var body = req.body;

   var requiredFields = ["dorm", "major", "gradeRatio", "quiet", "greekLife",
    "smoking", "drinking", "wakeTime", "sleepTime", "cleanliness"];
   //Check prs ok, has fields, the values of some of the fields

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(user, cb) && vld.hasFields(body, requiredFields, cb) &&
       vld.chain(body.wakeTime < 24 && body.wakeTime > -1, Tags.badValue, ["wakeTime"])
       .chain(body.sleepTime < 24 && body.wakeTime > -1, Tags.badValue, ["sleepTime"])) {
         cnn.chkQry('insert into Preferences set ?', [body], cb);
      }
   }],
   function(err) {
      res.end();
      cnn.release();
   });

});

router.put('/:usrId/Prefs', function(req, res) {

   var user = req.params.usrId;
   var cnn = req.cnn;
   var vld = req.validator;
   var body = req.body;

   var requiredFields = ["dorm", "major", "gradeRatio", "quiet", "greekLife",
    "smoking", "drinking", "wakeTime", "sleepTime", "cleanliness"];

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(user, cb) && vld.hasOnlyFields(body, requiredFields, cb) &&
       vld.chain(body.wakeTime < 24 && body.wakeTime > -1, Tags.badValue, ["wakeTime"])
       .chain(body.sleepTime < 24 && body.wakeTime > -1, Tags.badValue, ["sleepTime"])) {
         cnn.chkQry('update Preferences P where P.usrId = ? set ?', [user, body], cb);
      }
   },
   function(results, fields, cb) {
      res.status(200).end();
      cb();
   }],
   function(err) {
      cnn.release();
   });

});

module.exports = router;
