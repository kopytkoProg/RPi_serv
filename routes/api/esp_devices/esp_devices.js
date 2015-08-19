/**
 * Created by michal on 28.07.15.
 */

var express = require('express');
var router = express.Router();

/** @type {EspDevices~deviceAndDescription[]} */
var list = require('./../../../my_modules/esp_device/esp_devices');


router.param('id', function (req, res, next, esp_id) {

    /**
     * @type {EspDevices~deviceAndDescription}
     */
    var esp = list.findFirst(function (e) {
        return e.id == esp_id;
    });
    req.my = {esp: esp};

    next();
});


router.get('/list', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    /**  @type {{list: {}[]}} */
    var obj = {list: []};

    list.forEach(function (e) {
        obj.list.push({
            description: e.description,
            ip: e.dev.cfg.ip,
            port: e.dev.cfg.port,
            name: e.name,
            id: e.id,
            lastActivity: e.dev.getLastActivity()
        })
    });

    res.end(JSON.stringify(obj), 'utf8');
});

router.get('/wifi/:id', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    //var id = req.params.id;
    //
    ///**
    // * @type {EspDevices~deviceAndDescription}
    // */
    //var esp = list.findFirst(function (e) {
    //    return e.id == id;
    //});
    var esp = req.my.esp;
    var obj = esp ? {wifi: esp.dev.specialMsgHandler.info.wifi} : {err: 'Bad id'};


    res.end(JSON.stringify(obj), 'utf8');
});


router.get('/scan_wifi/:id', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/json'});

    var esp = req.my.esp;

    var obj = esp ? {wifi: 'Ok'} : {err: 'Bad id'};
    if (esp) {
        esp.dev.send(esp.dev.SPECIAL_COMMANDS.scanNetwork);
    }

    res.end(JSON.stringify(obj), 'utf8');
});

module.exports = router;