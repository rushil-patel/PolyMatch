var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');
var cnnConfig = require('../connection.json');
router.baseURL = '/Users';

router.use('/', require('../Matches/Matches.js'));
router.use('/', require('../Preferences/Prefs.js'));
router.use('/', require('../Hobbies/Hobbies.js'));

router.post("/", function(req, res) {

   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.hasFields(body, ["email", "firstName", "lastName",
       "gender", "age", "password"], cb) && vld.check(body.termsAccepted,
       Tags.noTerms, null, cb)) {
          cnn.chkQry("select * from User where email = ?", body.email, cb);
       }
   },
   function(existingUser, fields, cb) {
      if (vld.check(!existingUser.length, Tags.dupEmail, null, cb)) {
         body.whenRegistered = body.termsAccepted = new Date();
         delete body.picture;
         console.log(body);
         cnn.chkQry('insert into User set ?', body, cb);
      }
   },
   function(result, fields, cb) {
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],
   function() {
      cnn.release();
   });
});


router.get("/:usrId", function(req, res) {
   var usrId = req.params.usrId;
   var cnn = req.cnn;
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      cnn.chkQry("select * from User where id = ?", usrId, cb)
   },
   function(usersResult, fields, cb) {
      if (vld.check(usersResult.length, Tags.notFound, null, cb)) {
         var user = usersResult[0];
         delete user.password;
         res.json([user]);
         cb()
      }
   }],
   function() {
      cnn.release();
   });
})

router.put("/:usrId", function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var admin = req.session.isAdmin();
   var cnn = req.cnn;
   var usrId = req.params.userId;
   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(usrId, cb) &&
       vld.hasOnlyFields(body, ["firstName", "lastName", "picture", "gender",
       "age", "introduction", "password", "oldPassword"], cb) &&
       vld.check((!body.password && body.password != "") || body.oldPassword ||
       admin, Tags.noOldPwd, null, cb)) {
          cnn.chkQry("select * from User where id = ?", usrId);
       }
   },
   function(usersResult, fields, cb) {
      if (vld.check(usersResult.length, Tags.notFound, null, cb)) {
         delete body.oldPassword;
         cnn.chkQry("update User set ? where = ?", [body, usrId], cb)
      }
   },
   function(result, fields, cb) {
      res.status(200).end();
      cb();
   }],
   function(err) {
      cnn.release()
   })
});


module.exports = router;
