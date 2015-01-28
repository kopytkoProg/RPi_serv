/**
 * Created by michal on 2015-01-27.
 */
var express = require('express');
var router = express.Router();
var SensorsHistory = require('./../../../my_modules/PeopleSensor/SensorsHistory');
var PeopleSensorConfig = require('./../../../config/PeopleSensorConfig');

router.get('/historyFor/:date', function (req, res) // list of connected sensors
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    var date = new Date(req.params.date);

    SensorsHistory.getHistory(function (h)
    {
        var dataToSend = {};
        for (var i in h)
        {
            dataToSend[i] = {
                history: h[i],
                info: PeopleSensorConfig.sensorsToObserve.reduce(function (acc, e)
                {
                    if (e.id == i) return e.sensor.info.InstanceInfo;
                    return acc;
                }, null)
            }
        }
        res.end(JSON.stringify(dataToSend), 'utf8');
    }, date);


});

router.get('/history/list', function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/json'});
    var obj = SensorsHistory.h.listOfSavedHistory();
    res.end(JSON.stringify(obj), 'utf8');
});


module.exports = router;