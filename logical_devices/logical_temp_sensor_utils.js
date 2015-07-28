/**
 * Created by michal on 23.07.15.
 */
var myUtils = require('./../utils/utils');
var logicalDevices = require('./logical_devices');
var DS18B20 = require('../config/DS18B20');

var LogicalTempSensorUtils = {

    /**
     *
     * @param {LogicalTempSensorUtils~onTemps} callback
     */
    getAllTemps: function (callback) {
        /** @type {LogicalTempSensorAbstract~tempAndDescription[]} */
        var r = [];

        var c = 0;


        if (logicalDevices.logicalTempSensors.length == 0) return callback('No sensors found', r);
        logicalDevices.logicalTempSensors.forEach(function (e) {
            e.getTempAndDescription(function (err, temp) {
                if (!err) {

                    r.push(temp);
                }
                c++;

                if (c == logicalDevices.logicalTempSensors.length) callback(null, r);
            });
        }, this);
    }
};

module.exports = LogicalTempSensorUtils;
/**
 * @callback LogicalTempSensorUtils~onTemps
 * @param err
 * @param {LogicalTempSensorAbstract~tempAndDescription[]} temps
 */