var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var mysql = require('mysql');
var cnnConfig = require('../connection.json');


router.get("/", function(req, res) {
   var cnn = req.cnn;
   var cb = function(err, dormsResult, fields) {
      res.json(dormsResult);
      cnn.release()
   };
   cnn.chkQry('select * from Dorms', null, cb)
});

module.exports = router;
