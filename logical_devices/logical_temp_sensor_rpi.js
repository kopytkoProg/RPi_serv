/**
 * Created by michal on 23.07.15.
 */


var ILogicalTempSensorInterface = require('./Interfaces/logical_temp_sensor_interface');
var util = require('util');
var logicalTempSensorAbstract = require('./logical_temp_sensor_abstract');
/**
 * @augments LogicalTempSensorAbstract
 * @param {RPi1WireTemp} rpi1WireTemp
 * @param id
 * @constructor
 */

var LogicalTempSensorRPi = function (rpi1WireTemp, id) {
    /** @type {SimpleLogicalDevice~cfg} */
    var cfg = {
        description: "Temp sensor somewhere", // TODO: connect with rpiserv sensors descriptions
        name: "Some name",
    };
    // call supper
    LogicalTempSensorRPi.super_.call(this, cfg);

    this.id = id;
    this.temp = null;
    this.rpi1WireTemp = rpi1WireTemp;
    ILogicalTempSensorInterface.ensureImplements(this);
};
util.inherits(LogicalTempSensorRPi, logicalTempSensorAbstract);

LogicalTempSensorRPi.prototype.getId = function () {
    return this.id;
};


/**
 * @param {function(*=, number=)} callback
 */
LogicalTempSensorRPi.prototype.getTemp = function (callback) {
    var t = this;
    this.rpi1WireTemp.tempRequest(function(){
        callback(null, t.temp);
    });
};

module.exports = LogicalTempSensorRPi;