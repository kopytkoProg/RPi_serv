var ps_command = require('./psCommand.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res)
{

    res.writeHead(200, {'Content-Type': 'text/json'});


    ps_command(function (out)
    {
        var obj = {
            raw: out
        };
        res.end(JSON.stringify(obj), 'utf8');
    });


});

module.exports = router;
