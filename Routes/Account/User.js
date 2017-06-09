var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');
var cnnConfig = require('../connection.json');
router.baseURL = '/User';

router.post("/", function(req, res) {

   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.hasFields(body, ["email", "firstName", "lastName",
       "gender", "age", "password"], cb) && vld.check(body.termsAccepted,
       Tags.noTerms)) {
          cnn.chkQry("select * from User where email = ?", body.email, cb);
       }
   },
   function(existingUser, fields, cb) {
      if (vld.check(!existingUser.length, Tags.dupEmail, null, cb)) {
         if (body.termsAccepted) {
            body.termsAccepted = new Date();
         }
         //handle profle picture
         delete body.picture;
         cnn.chkQry('insert into User set ?', body, cb);
      }
   },
   function(result, fields, cb) {
      res.location(router.baseUrl + '/' + result.insertId).end();
      cb();
   }],
   function() {
      cnn.release();
   });
});


module.exports = router;
