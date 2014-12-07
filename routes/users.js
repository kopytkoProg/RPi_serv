var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/xxx', function(req, res) {
  res.send('respond with a resourcexxx');
});

module.exports = router;
