/**
 * Created by michal on 2015-01-26.
 */
var dailyHistory = require("./../dailyHistory");
var fs = require('fs');
var SensorScanner = require('./../PeopleSensor/SensorScanner');
var cfg = require('./../../config/PeopleSensorConfig');

var SensorsHistory = function ()
{


    var dir = './historyOfPeopleSensors/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    var h = new dailyHistory(dir);
    this.h = h;


    var sensors = [];
    SensorScanner.addListener(function (array)
    {
        array.forEach(function (e)
        {

            var item = sensors.reduce(function (acc, g)
            {
                return g.id == e.id ? g : acc;
            }, null);
            if (!item)
            {
                item = {id: e.id, moveSinceLastTime: false};
                sensors.push(item)
            }

            item.moveSinceLastTime = item.moveSinceLastTime || e.moveDetectedSinceLastTime;
            // console.log("item", item);
        });
    });

    /***
     * Get remaining ms to next tick
     * @returns {number} remaining
     */
    var getTimeOfNextTick = function (d)
    {
        var t = cfg.timeSpanBetweenHistoryMeasurements - (d.getTime() % (cfg.timeSpanBetweenHistoryMeasurements)) + 25;
        return t;
    };

    var tick = function ()
    {
        var d = new Date();
        var toSave = {date: d, sensors: sensors};
        //console.log("tick: " + JSON.stringify(toSave))
        h.addLine(JSON.stringify(toSave));
        sensors = [];
        setTimeout(tick, getTimeOfNextTick(d));
    };
    setTimeout(tick, getTimeOfNextTick(new Date()));

    /**
     * Get daily history for selected date.
     * @param {afterHistoryReadyCallback} callback called when data is ready
     * @param {Date} date
     */
    this.getHistory = function (callback, date)
    {
        var history = {};

        h.readFromDate(function (l)
        {
            if (l != null)
            {
                var lineObject = JSON.parse(l);

                lineObject.sensors.forEach(function (e)
                {
                    history[e.id] = history[e.id] || [];

                    history[e.id].push({
                        date: lineObject.date,
                        moveSinceLastTime: e.moveSinceLastTime
                    });
                });


            }
            else
            {
                callback(history);   //Done
            }
        }, date);
    }


};
/**
 *
 * @type {SensorsHistory}
 */
var singleton = new SensorsHistory();

module.exports = singleton;
