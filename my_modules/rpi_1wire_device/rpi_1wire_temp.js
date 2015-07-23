/**
 * Created by michal on 23.07.15.
 */


var temp = require('./temp');
var LogicalTempSensorRPi = require('./../../logical_devices/logical_temp_sensor_rpi');
var logical_devices = require('./../../logical_devices/logical_devices');
var list = require('./list');

var timeSpanBetweenMeasurements = 1000 * 2;

var RPi1WireTemp = function () {
    var t = this;
    /**
     *
     * @type {LogicalTempSensorRPi[]}
     */
    this.myLogicalTempSensors = [];
    this.lastUpdateTime = 0;

    list(function(l){
        l.forEach(function(id){
            var sensor = new LogicalTempSensorRPi(this, id);
            logical_devices.logicalTempSensors.push(sensor);
            this.myLogicalTempSensors.push(sensor);
        }, t);

    });




};

/**
 *
 * @param {RPi1WireTemp~onTempUpdate} callback
 */
RPi1WireTemp.prototype.tempRequest = function(callback){
    var now = new Date().getTime();
    var t = this;
    if(timeSpanBetweenMeasurements < now - this.lastUpdateTime){
        temp(function(arr){
            t.myLogicalTempSensors.forEach(function(s){
                arr.some(function(info){
                    if (s.getId() == info.id){
                        s.temp = info.temp;
                        return true;
                    }
                    return false;
                });
            });
            callback();
        });
    }else{
        callback();
    }
};


module.exports = new RPi1WireTemp();



/**
 * called when all logical devices have up to date temp
 * @callback RPi1WireTemp~onTempUpdate
 * @param err
 * @param {number} tmp
 */


