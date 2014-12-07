/**
 * Created by michal on 2014-12-05.
 */
var express = require('express');
var router = express.Router();
var isAuthenticated = require('./../../isAuthenticated');

/* GET home page. */
router.get('/', function (req, res) {
    res.send(
        {
            itIsWorking: true,
            date: new Date() // OK
        }
    );
});

module.exports = router;
