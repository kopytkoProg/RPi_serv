/**
 * Created by michal on 2015-01-26.
 */

var dev = require('./../my_modules/RS232/Devices');


/**
 *
 * @type {{timeSpanBetweenHistoryMeasurements: number, sensorsToObserve: {sensor: (PeopleSensorDevice), id: number}[]}}
 */
var PeopleSensorConfig = {
    timeSpanBetweenHistoryMeasurements: 1000 * 60 * 5,
    sensorsToObserve: [
        {sensor: dev.D30, id: 1}
    ]
};


module.exports = PeopleSensorConfig;