/**
 * Created by michal on 2014-12-05.
 */
var os = require('os');
var express = require('express');
var diskspace = require('diskspace');
var router = express.Router();


var lastCpus = null;
var getCurrentCpus = function (newCpus, oldCpus)
{
    var result = [];
    for (var i = 0; i < newCpus.length; i++)
        result[i] = {times: {}};


    if (oldCpus != null)
    {
        for (var i = 0; i < newCpus.length; i++)
        {
            result[i].times.user = newCpus[i].times.user - oldCpus[i].times.user;
            result[i].times.nice = newCpus[i].times.nice - oldCpus[i].times.nice;
            result[i].times.sys = newCpus[i].times.sys - oldCpus[i].times.sys;
            result[i].times.idle = newCpus[i].times.idle - oldCpus[i].times.idle;
            result[i].times.irq = newCpus[i].times.irq - oldCpus[i].times.irq;
        }
    }

    return result;
};

router.get('/', function (req, res)
{

    res.writeHead(200, {'Content-Type': 'text/json'});
    // https://github.com/oscmejia/os-utils

    var obj = {
        hostname: os.hostname(),
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: os.cpus()
    };

    res.end(JSON.stringify(obj), 'utf8');

});

router.get('/now/cpus', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});

    var oldCpus = os.cpus();

    setTimeout(function ()
    {
        var newCpus = os.cpus();
        res.end(JSON.stringify(getCurrentCpus(newCpus, oldCpus)), 'utf8');
    }, 1000);


});

router.get('/disk', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});

    diskspace.check('C', function (err, total, free, status)
    {
        res.end(JSON.stringify({}), 'utf8');
    });



});

module.exports = router;