/**
 * Created by michal on 22.07.15.
 */

var ILogicalTempSensorInterface = require('./Interfaces/logical_temp_sensor_interface');
var util = require('util');
var logicalTempSensorAbstract = require('./logical_temp_sensor_abstract');
/**
 * @augments LogicalTempSensorAbstract
 * @param {EspTempSensorsDevice} esp
 * @param id
 * @constructor
 */

var LogicalTempSensorEsp = function (esp, id) {
    /** @type {SimpleLogicalDevice~cfg} */
    var cfg = {
        description: "Temp sensor somewhere", // TODO: connect with rpiserv sensors descriptions
        name: "Some name",
    };
    // call supper
    LogicalTempSensorEsp.super_.call(this, cfg);

    this.id = id;
    this.esp = esp;

    ILogicalTempSensorInterface.ensureImplements(this);
};
util.inherits(LogicalTempSensorEsp, logicalTempSensorAbstract);

LogicalTempSensorEsp.prototype.getId = function () {
    return this.id;
};


/**
 * @param {function(*=, number=)} callback
 */
LogicalTempSensorEsp.prototype.getTemp = function (callback) {
    this.esp.getSensorTemp(this.id, callback);
};




module.exports = LogicalTempSensorEsp;