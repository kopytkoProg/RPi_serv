/**
 * Created by michal on 2014-12-13.
 */
var dailyHistory = new require('./../../../my_modules/dailyHistory');
var temp = require('./temp');
var fs = require('fs');
var cfg = require('./../../../config/TemperatureHistoryConfig');

var dir = './history/';


/***
 * @class
 * @property {dailyHistory} h
 */
var tempHistory = function ()
{
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    this.h = new dailyHistory(dir);
    var _this = this;

    var everyTimeSpan = function ()
    {
        temp(function (temps)
        {
            //console.log('History temp info created', temps);
            _this.h.addLine(JSON.stringify(temps));
        });
        setTimeout(everyTimeSpan, getTimeOfNextMeasure());
    };

    /***
     * Get remaining ms to next full minute
     * @returns {number} remaining ms to next full minute
     */
    var getTimeOfNextMeasure = function ()
    {
        var d = new Date();
        var t = cfg.timeSpanBetweenMeasurements - (d.getTime() % (cfg.timeSpanBetweenMeasurements));
        //console.log(t);
        return t;
    };
    setTimeout(everyTimeSpan, getTimeOfNextMeasure());

    /**
     * Get daily history for selected date.
     * @param {afterHistoryReadyCallback} callback called when data is ready
     * @param {Data} date
     */
    this.getHistory = function (callback, date)
    {
        var history = {};

        _this.h.readFromDate(function (l)
        {
            if (l != null)
            {
                var arr = JSON.parse(l);
                arr.forEach(function (e)
                {
                    history[e.innerId] = history[e.innerId] || new Array();

                    history[e.innerId].push({
                        temp: e.temp,
                        date: e.date
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


module.exports = tempHistory;

/**
 * Called when history is ready to get
 *
 * @example <caption> can return object:
 * {
 *      someInnerIdOfSensor: [
 *          {temp: 22.1, date: '2014-12-14T23:00:01.144Z'},
 *          ...
 *      ]
 * }
 *
 * </caption>
 *
 * @callback afterHistoryReadyCallback
 * @param {Object} Contains fields which are innerId of sensors
 */