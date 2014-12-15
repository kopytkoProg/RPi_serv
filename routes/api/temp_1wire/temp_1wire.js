/**
 * Created by michal on 2014-12-12.
 */
var express = require('express');
var router = express.Router();
var list = require('./list');
var temp = require('./temp');
var tempHistory = require('./tempHistory');

// ===== Start creating history =====
var tempInstance = new tempHistory();


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

router.get('/history/list', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = tempInstance.h.listOfSavedHistory();
    res.end(JSON.stringify(obj), 'utf8');
});


router.get('/history/date/:date', function (req, res)
{
    var date = new Date(req.params.date);

    res.writeHead(200, {'Content-Type': 'text/json'});
    tempInstance.getHistory(function(history){
        res.end(JSON.stringify({history: history}), 'utf8');
    }, date);

});


module.exports = router;
