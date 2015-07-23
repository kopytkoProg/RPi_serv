/**
 * Created by michal on 2014-12-12.
 */
var express = require('express');
var router = express.Router();
// var list = require('./../../../rpi_1wire_device/list');
// var temp = require('./../../../rpi_1wire_device/temp');
var logical_devices_temp = require('./../../../logical_devices/logical_temp_sensor_utils');
var DS18B20 = require('../../../config/DS18B20');
var logicalDevices = require('./../../../logical_devices/logical_devices');
var tempHistory = require('./../../../my_modules/temp_history/tempHistory');



router.get('/list', function (req, res) // list of connected sensors
{
    //res.writeHead(200, {'Content-Type': 'text/json'});
    //var obj = {};
    //list(function (l)
    //{
    //    obj.list = l;
    //    res.end(JSON.stringify(obj), 'utf8');
    //})
    // ============================================
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = {list:[]};

    logicalDevices.logicalTempSensors.forEach(function(e){
        obj.list.push(e.getId());
    });

    res.end(JSON.stringify(obj), 'utf8');
});

router.get('/temp', function (req, res)
{
    //res.writeHead(200, {'Content-Type': 'text/json'});
    //var obj = {};
    //temp(function (t)
    //{
    //    obj.temp = t;
    //    res.end(JSON.stringify(obj), 'utf8');
    //})
    // ============================================
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = {temp:[]};
    logical_devices_temp.getAllTemps(function(err, temps){
        obj.temp = temps;
        res.end(JSON.stringify(obj), 'utf8');
    });


});

router.get('/history/list', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = tempHistory.h.listOfSavedHistory();
    res.end(JSON.stringify(obj), 'utf8');
});


router.get('/history/date/:date', function (req, res)
{
    var date = new Date(req.params.date);

    res.writeHead(200, {'Content-Type': 'text/json'});
    tempHistory.getHistory(function(history){
        res.end(JSON.stringify({history: history}), 'utf8');
    }, date);

});

router.get('/sensors/descriptions', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(DS18B20.Descriptions), 'utf8');
});

module.exports = router;
