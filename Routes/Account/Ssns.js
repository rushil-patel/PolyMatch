var Express = require('express');
var CnnPool = require('../CnnPool.js');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var adminLogin = ssnUtil.adminLogin;
var router = Express.Router({caseSensitive: true});

router.baseURL = '/Ssns';

router.get('/', function(req, res) {
   var body = [], ssn;
   var cnn = req.cnn;
   if (req.validator.checkAdmin()) {
      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({cookie: cookie, prsId: ssn.id, loginTime: ssn.loginTime});
      }
      res.status(200).json(body);
   }
   cnn.release();
});

router.post('/', function(req, res) {
   var cookie;
   var cnn = req.cnn;
   var vld = req.validator;

   if (req.body.email === adminLogin.email && 
    req.body.password === adminLogin.password) {
      cookie = ssnUtil.makeSession(adminLogin, res);
      res.location(router.baseURL + '/' + cookie).status(200).end();
      cnn.release();
   }
   else {
    cnn.query('select * from User where email = ?', [req.body.email],
     function(err, result, fields) {
        if (req.validator.check(result.length && result[0].password ===
         req.body.password, Tags.badLogin)) {
           cookie = ssnUtil.makeSession(result[0], res);
           res.location(router.baseURL + '/' + cookie).status(200).end();
        }
        cnn.release();
     });
  }
});

router.delete('/:cookie', function(req, res, next) {
   var vld = req.validator;
   if (vld.check(req.params.cookie === req.cookies[ssnUtil.cookieName]
    || vld.session.isAdmin(),
    Tags.noPermission)) {
      ssnUtil.deleteSession(req.params.cookie);
      res.status(200).end();
   }
   req.cnn.release();
});

router.get('/:cookie', function(req, res, next) {
   var cookie = req.params.cookie;
   var vld = req.validator;

   if (vld.check(ssnUtil.sessions[cookie], Tags.notFound, null) &&
    vld.checkPrsOK(ssnUtil.sessions[cookie].id)) {
      var ssn = ssnUtil.sessions[cookie];
      var ssnId = req.session.id;
      res.json({prsId: ssnId, cookie: cookie, loginTime: ssn.loginTime});
   }
   req.cnn.release();
});

module.exports = router;
