/**
 * Created by michal on 23.07.15.
 */


var ILogicalTempSensorInterface = require('./Interfaces/logical_temp_sensor_interface');
var util = require('util');
var SimpleLogicalDevice = require('./simple_logical_device');
var DS18B20 = require('../config/DS18B20');
/**
 *
 * @param {EspTempSensorsDevice} esp
 * @param id
 * @constructor
 */

var LogicalTempSensorAbstract = function (esp, id) {
    LogicalTempSensorAbstract.super_.apply(this, arguments);
    ILogicalTempSensorInterface.ensureImplements(this);
};
util.inherits(LogicalTempSensorAbstract, SimpleLogicalDevice);

/**
 * @return id
 */
LogicalTempSensorAbstract.prototype.getId = function () {
    throw 'This method should be overwritten'
};
/**
 * @param {function(*=, number=)} callback
 */
LogicalTempSensorAbstract.prototype.getTemp = function (callback) {
    throw 'This method should be overwritten'
};

/**
 *
 * @param @param {function(*=, number=)} callback
 */

LogicalTempSensorAbstract.prototype.getTempAndDescription = function (callback) {
    var t = this;
    this.getTemp(function (err, temp) {
        if (err) return callback(err, null);
        var descObj = DS18B20.DescriptionFor(t.getId());
        callback(null,
            {
                id: descObj.id,
                innerId: descObj.innerId,
                temp: temp,
                date: new Date(),
                name: descObj.name,
                crcCorrect: true
            });


    })
};


module.exports = LogicalTempSensorAbstract;