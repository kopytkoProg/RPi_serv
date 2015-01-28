/**
 * Created by michal on 2015-01-27.
 */
var cfg = require('./../../config/PeopleSensorConfig');


var SensorScanner = function ()
{


    /**
     * @type {Array.<onEverySensorScan>}
     */
    var listeners = [];


    /**
     * @param  {onEverySensorScan} listener
     */
    this.addListener = function (listener)
    {
        return listeners.push(listener);
    };


    cfg.sensorsToObserve.forEach(function (e)
    {
        e.lastCounter = -1;
    });


    var tick = function ()
    {
        var sensorsStat = [];
        var forEachSensor = function (e)
        {
            e.sensor.CmdGetCounter(function (stat, counter)
            {
                if (stat)
                {
                    var moveDetectedSinceLastTime = false;
                    if (e.lastCounter == -1 || e.lastCounter > counter) e.lastCounter = counter;                        // if some problems then set lastCounter as counter
                    if (e.lastCounter != counter || counter % 2 != 0) moveDetectedSinceLastTime = true;

                    sensorsStat.push({id: e.id, moveDetectedSinceLastTime: moveDetectedSinceLastTime});

                    e.lastCounter = counter;
                }
                else
                {
                    sensorsStat.push({id: e.id, moveDetectedSinceLastTime: null});
                }

                if (sensorsStat.length == cfg.sensorsToObserve.length) listeners.forEach(function (e)
                {
                    e(sensorsStat);
                });

            });
        };
        cfg.sensorsToObserve.forEach(forEachSensor);


        setTimeout(tick, 1000);
    };
    tick();
};


/**
 *
 * @type {SensorScanner}
 */
var singleton = new SensorScanner();

module.exports = singleton;

/**
 * @typedef {{id: Number, moveDetectedSinceLastTime: bool}} itemOfMoveSinceLastTime
 */
/**
 @callback onEverySensorScan
 @param {Array.<itemOfMoveSinceLastTime>} moveSinceLastTime
 */