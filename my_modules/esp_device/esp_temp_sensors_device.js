/**
 * Created by michal on 19.07.15.
 */

var util = require('util');
var con = require('./../../esp_utils/my_console').get('EspTempSensorDeviceDevice');
var EspDevice = require('./esp_device');
var EventEmitter = require('events').EventEmitter;
var myUtils = require('./../../utils/utils');
var config = require('./../../config/esp_config');
var logicalDevices = require('./../../logical_devices/logical_devices');
var LogicalTempSensor = require('./../../logical_devices/logical_temp_sensor_esp');
var Q = require('q');

/**
 * @augments EspDevice
 * @param {EspDevice~cfg} cfg
 * @class
 * @fires sensorsListReceived
 */
var EspTempSensorsDevice = function (cfg) {
    /* super ctor call*/
    EspTempSensorsDevice.super_.call(this, cfg);

    /*---------------------------------------------------*/
    /** return ds18x20 sensor list */
    this.AVR_COMMANDS.getSensorsId = 'get-sensor-id-avr';
    this.AVR_COMMANDS.getTemp = 'get-temp-avr';
    /*---------------------------------------------------*/
    this.sensorsInfo = {lastUpdate: 0, sensors: []};
    this.myLogicalDevices = [];
    //this.events = new EventEmitter();


    this.initEspTempSensorsDevice()

};
util.inherits(EspTempSensorsDevice, EspDevice);

/**
 * @return {q} promis of get all ids
 */
EspTempSensorsDevice.prototype.getSensorsId = function () {
    var deferred = Q.defer();
    this.send(this.AVR_COMMANDS.getSensorsId, function (err, msg) {

        if (err) {
            con.error(err);
            deferred.reject(err);
            return;
        }

        /* 28:ff:da:60:62:14:03:e4, 28:ff:5c:79:62:14:03:18, 10:ef:a0:6f:01:08:00:12 */
        msg.split(', ').forEach(function (id) {
            this.sensorsInfo.sensors.push(id);
        }, this);

        this.sensorsInfo.lastUpdate = new Date().getTime();
        deferred.resolve(this.sensorsInfo.sensors);
        //this.events.emit('sensorsListReceived');
        con.log('sensorsInfo: ', this.sensorsInfo);

    });
    return deferred.promise;
};

/**
 * Unregister logical devices
 */
EspTempSensorsDevice.prototype.unRegisterLogicalDevices = function () {

    this.myLogicalDevices.forEach(function (ld) {
        var index = logicalDevices.logicalTempSensors.indexOf(ld);
        if (index > -1) {
            array.splice(index, 1);
        }
    });
};
/**
 * Register logical devices
 */
EspTempSensorsDevice.prototype.registerLogicalDevices = function () {

    var sensors = myUtils.cloneArray(this.sensorsInfo.sensors);
    sensors.forEach(function (e) {
        var lts = new LogicalTempSensor(this, e);
        this.myLogicalDevices.push(lts);
        logicalDevices.logicalTempSensors.push(lts);
    }, this);

};

/**
 * Return temperature for given sensor
 * @param {string} id DS18x20 id
 * @param {EspTempSensorsDevice~onTmpResponse} callback
 *
 */
EspTempSensorsDevice.prototype.getSensorTemp = function (id, callback) {
    this.send(this.AVR_COMMANDS.getTemp + ':' + id, function (err, msg) {
        if (err) return callback(err, null);
        callback(err, parseInt(msg) / 10);

    });
};

/**
 * @param {EspTempSensorsDevice~onTmpsResponse} callback
 */
EspTempSensorsDevice.prototype.getAllSensorTemp = function (callback) {
    var r = {};
    var c = 0;

    var sensors = myUtils.cloneArray(this.sensorsInfo.sensors);
    if (sensors.length == 0) return callback('No sensors found', r);

    sensors.forEach(function (e) {
        this.getSensorTemp(e, function (err, tmp) {
            if (err) r[e] = null;
            else r[e] = tmp;
            c++;

            if (c == sensors.length) callback(null, r);
        });
    }, this);
};

/**
 *
 * @return {Promise} promise of done
 */
EspTempSensorsDevice.prototype.initEspTempSensorsDevice = function () {

    var self = this;
    /* Remove my devices from logicalDevices.logicalTempSensors */
    this.unRegisterLogicalDevices();

    /* Clear array of sensors ids and logical devices */
    this.sensorsInfo.sensors = [];
    this.myLogicalDevices = [];

    /* Get new list of sensors */
    this.getSensorsId()
        .then(this.registerLogicalDevices.callAs(self) /* Register new temp sensors devices */)
        .fail(function (err) {
            con.error('Fail to init', err);
            setTimeout(self.initEspTempSensorsDevice.callAs(self), config.EspTempSensorsDevice.TIME_TO_NEXT_INIT);
        })
};


module.exports = EspTempSensorsDevice;
//t1: 291, t2: 290, t3: 291


/**
 * @callback EspTempSensorsDevice~onTmpResponse
 * @param err
 * @param {number} tmp
 */


/**
 * @callback EspTempSensorsDevice~onTmpsResponse
 * @param err
 * @param tmps
 */