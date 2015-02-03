var FirstDevice = require('./DevicesClass/FirstDevice');
var LcdDevice = require('./DevicesClass/LcdDevice');
var LcdTimeDevice = require('./DevicesClass/LcdTimeDevice');
var Device = require('./DevicesClass/Device');
var MyBusController = require('./MyBusController');
var DeviceHelloWorld = require('./DevicesClass/DeviceHelloWorld');
var PeopleSensorDevice = require('./DevicesClass/PeopleSensorDevice');
/**
 * Created by michal on 2014-12-20.
 */

// Start MyBus
Device.MyBusController = new MyBusController();


/**
 *
 * @type {{D10:FirstDevice, D20:LcdDevice}}
 */
var Devices = {
    //D10: function ()
    //{
    //    var instance = new FirstDevice(10);
    //    instance.info.InstanceInfo = 'First created device.';
    //    instance.info.Id = 'D10';
    //    return instance;
    //}(),
    D20: function ()
    {
        var instance = new LcdTimeDevice(20);
        instance.info.InstanceInfo = 'First LCD device.';
        instance.info.Id = 'D20';
        return instance;
    }(),
    //D21: function ()
    //{
    //    var instance = new LcdTimeDevice(21);
    //    instance.info.InstanceInfo = 'First LCD device.';
    //    instance.info.Id = 'D21';
    //    return instance;
    //}(),
    D30: function ()
    {
        var instance = new PeopleSensorDevice(30);
        instance.info.InstanceInfo = 'People sensor device in Michals room';
        instance.info.Id = 'D30';
        return instance;
    }()

};


module.exports = Devices;