var FirstDevice = require('./DevicesClass/FirstDevice');
var LcdDevice = require('./DevicesClass/LcdDevice');
var Device = require('./DevicesClass/Device');
var MyBusController = require('./MyBusController');
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
    D10: function ()
    {
        var instance = new FirstDevice(10);
        instance.info.InstanceInfo = 'First created device.';
        instance.info.Id = 'D10';
        return instance;
    }(),
    D20: function ()
    {
        var instance = new LcdDevice(20);
        instance.info.InstanceInfo = 'First LCD device.';
        instance.info.Id = 'D20';
        return instance;
    }()

};


module.exports = Devices;