/**
 * Created by michal on 2014-12-12.
 */
var express = require('express');
var router = express.Router();
var list = require('./list');
var temp = require('./temp');
var tempHistory = require('./tempHistory');

// ===== Start creating history =====
tempHistory();


router.get('/list', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = {};
    list(function (l)
    {
        obj.ist = l;
        res.end(JSON.stringify(obj), 'utf8');
    })
});

router.get('/temp', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = {};
    temp(function (t)
    {
        obj.temp = t;
        res.end(JSON.stringify(obj), 'utf8');
    })
});


module.exports = router;
