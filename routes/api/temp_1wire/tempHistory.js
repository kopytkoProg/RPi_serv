/**
 * Created by michal on 2014-12-13.
 */
var dailyHistory = new require('./../../../my_modules/dailyHistory');
var temp = require('./temp');
var fs = require('fs');
var cfg = require('./../../../config/TemperatureHistoryConfig');


var tempHistory = function ()
{
    if (!fs.existsSync('./history/')) fs.mkdirSync('./history/');
    var h = new dailyHistory('./history/');

    var everyTimeSpan = function ()
    {
        temp(function (temps)
        {
            //console.log('History temp info created', temps);
            h.addLine(JSON.stringify(temps));
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

};


module.exports = tempHistory;

