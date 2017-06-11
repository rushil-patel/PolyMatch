var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var Rank = require('../Rank.js');
var mysql = require('mysql');

router.get('/:usrId/Prefs', function(req, res) {

	var user = req.params.usrId;
	var cnn = req.cnn;
   var vld = req.validator;
	var query = 'select P.id, P.userId, D.name as dormName, M.name as major, P.gradesRatio,' +
    ' P.quiet, P.greekLife, P.smoking, P.drinking, P.wakeTime,' +
    ' P.sleepTime, P.cleanliness' +
	 ' from Preferences P, Majors M, Dorms D' +
	 ' where D.id = P.dormName and M.id = P.major and P.userId = ?';

   async.waterfall([
   function(cb) {
      cnn.chkQry(query, [user], cb);
   },
   function(results, fields, cb) {
      if (vld.check(results.length, Tags.notFound, null, cb)) {
       results[0].quiet = !!results[0].quiet;
       results[0].greekLife = !!results[0].greekLife;
       results[0].smoking = !!results[0].smoking;
       results[0].drinking = !!results[0].drinking;
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

   var requiredFields = ["dormName", "major", "gradesRatio", "quiet", "greekLife",
    "smoking", "drinking", "wakeTime", "sleepTime", "cleanliness"];
   //Check prs ok, has fields, the values of some of the fields

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(user, cb))
         cnn.chkQry('select * from Preferences P where P.userId = ?', [user], cb);
   },
   function(prefs, fields, cb) {
      if (vld.check(!prefs.length, Tags.alreadyExists, null, cb) && vld.hasFields(body, requiredFields, cb) &&
       vld.chain(body.wakeTime < 24 && body.wakeTime > -1, Tags.badValue, ["wakeTime"])
       .chain(body.sleepTime < 24 && body.wakeTime > -1, Tags.badValue, ["sleepTime"])
       .check(body.gradesRatio < 101 && body.gradesRatio > -1, Tags.badValue, ["gradesRatio"], cb)) {
         body.userId = user;
         cnn.chkQry('insert into Preferences set ?', [body], cb);
      }
   },
   function(insertResult, fields, cb) {
      cnn.chkQry('select * from Preferences where userId = ?', [user],
       function(err, userPref, fields) {
          if (err) {
             res.status(500).send();
             cb(err, qRes, fields);
             return;
          }
          var userPref = userPref[0]
          cnn.chkQry('select * from Preferences where userId != ?', [user],
          function(err, nonUserPrefs, fields) {
             if (err) {
                res.status(500).send()
                cb(err, qRes, fields);
                return;
             }
             var res = {
                userPref: userPref,
                nonUserPrefs: nonUserPrefs
             };
             cb(err, res);
          });
      });
   },
   function(prefs, cb) {
      var aggregator = function(aggregate, prefA, prefB, score) {
         score = score * 100;
         aggregate.push([prefA.userId, prefB.userId, score]);
         aggregate.push([prefB.userId, prefA.userId, score]);
      };
      var matches =
       Rank.rankBatch(prefs.userPref, prefs.nonUserPrefs, aggregator);
      cb(null, matches);
   },
   function(matches, cb) {
      if (!matches.length) {
         return cb();
      }
      cnn.chkQry("insert into Matches (newPerson, oldPerson, score) VALUES ? ",
        [matches], cb);
   }],
   function(err) {
      res.end();
      cnn.release();
   })
});

router.put('/:usrId/Prefs', function(req, res) {

   var user = req.params.usrId;
   var cnn = req.cnn;
   var vld = req.validator;
   var body = req.body;

   var requiredFields = ["dormName", "major", "gradesRatio", "quiet", "greekLife",
    "smoking", "drinking", "wakeTime", "sleepTime", "cleanliness"];

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(user, cb) && vld.hasOnlyFields(body, requiredFields, cb) &&
       vld.hasFields(body, Object.keys(body), cb) &&
       vld.chain(!body.wakeTime || body.wakeTime < 24 && body.wakeTime > -1, Tags.badValue, ["wakeTime"])
       .chain(!body.sleepTime || body.sleepTime < 24 && body.wakeTime > -1, Tags.badValue, ["sleepTime"])
       .check(!body.gradesRatio || body.gradesRatio < 101 && body.gradesRatio > -1, Tags.badValue, ["gradesRatio"], cb)) {
         cnn.chkQry('update Preferences P set ? where P.userId = ?', [body, user], cb);
      }
   },
   function(insertResult, fields, cb) {
      cnn.chkQry('select * from Preferences where userId = ?', [user],
       function(err, userPref, fields) {
          if (err) {
             res.status(500).send();
             cb(err, qRes, fields);
             return
          }
          var userPref = userPref[0]
          cnn.chkQry('select * from Preferences where userId != ?', [user],
          function(err, nonUserPrefs, fields) {
             if (err) {
                res.status(500).send()
                cb(err, qRes, fields);
                return
             }
             var res = {
                userPref: userPref,
                nonUserPrefs: nonUserPrefs
             };
             cb(err, res);
          });
      });
   },
   function(prefs, cb) {
      var aggregator = function(aggregate, prefA, prefB, score) {
         score = score * 100;
         aggregate.push({
            newPerson: prefA.userId,
            oldPerson: prefB.userId,
            score: score
         });
         aggregate.push({
            newPerson: prefB.userId,
            oldPerson: prefA.userId,
            score: score
         });
      };

      var matches =
       Rank.rankBatch(prefs.userPref, prefs.nonUserPrefs, aggregator);
      cb(null, matches);
   },
   function(matches, cb) {
      if (!matches.length) {
         return cb(null, null, null);
      }

      var qrys = ""
      matches.forEach(function(match) {
         var values = [match.score, match.newPerson, match.oldPerson];
         qrys += mysql.format("update Matches set score = ? where newPerson = ? and " +
          "oldPerson = ?; ", values);
       });

      cnn.chkQry(qrys, null, cb);
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
