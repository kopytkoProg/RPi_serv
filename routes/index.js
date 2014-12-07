var express = require('express');
var router = express.Router();
var isAuthenticated = require('./../isAuthenticated');

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  var c = 0, p, f = req.flash();
  for (p in f) c += 1;


  res.render('index', {
    anyError: c > 0,
    massages: JSON.stringify(f, null, "\t")
  });
});

module.exports = router;
