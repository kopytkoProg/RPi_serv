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
 * @param {function(*=, LogicalTempSensorAbstract~tempAndDescription=)} callback
 * @return
 */

LogicalTempSensorAbstract.prototype.getTempAndDescription = function (callback) {
    var t = this;
    this.getTemp(function (err, temp) {
        if (err) return callback(err, null);

        /** @type {LogicalTempSensorAbstract~tempAndDescription} */
        var desc = t.getDescription();
        desc.temp = temp;
        desc.date = new Date();
        desc.crcCorrect = true;
        callback(null, desc);
        //var descObj = DS18B20.DescriptionFor(t.getId());
        //callback(null,
        //    {
        //        id: descObj.id,
        //        innerId: descObj.innerId,
        //        temp: temp,
        //        date: new Date(),
        //        name: descObj.name,
        //        crcCorrect: true,
        //        description: descObj.description
        //    });


    })
};

/**
 * @return DS18B20DDescriptionObject
 */

LogicalTempSensorAbstract.prototype.getDescription = function () {
    var t = this;
    return DS18B20.DescriptionFor(t.getId());
};

module.exports = LogicalTempSensorAbstract;

/**
 * @typedef {object}  LogicalTempSensorAbstract~tempAndDescription
 * @augments DS18B20DDescriptionObject
 * @property {number} temp
 * @property {Date} date
 * @property {boolean} crcCorrect
 */

///**
// * @typedef {object}  LogicalTempSensorAbstract~Description
// * @property {string} id
// * @property {string} innerId
// * @property {string} name
// * @property {string} description
//
// */