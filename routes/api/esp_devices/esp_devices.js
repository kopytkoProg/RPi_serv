/**
 * Created by michal on 28.07.15.
 */

var express = require('express');
var router = express.Router();

/** @type {EspDevices~deviceAndDescription[]} */
var list = require('./../../../my_modules/esp_device/esp_devices');


router.use(function(req, res, next) {
    // .. some logic here .. like any other middleware
    next();
});


router.get('/list', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    /**  @type {{list: {}[]}} */
    var obj = {list:[]};

    list.forEach(function(e){
        obj.list.push({
            description: e.description,
            ip: e.dev.cfg.ip,
            port: e.dev.cfg.port,
            name: e.name,
            lastActivity: e.dev.getLastActivity()
        })
    });

    res.end(JSON.stringify(obj), 'utf8');
});


module.exports = router;