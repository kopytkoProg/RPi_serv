var FirstDevice = require('./DevicesClass/FirstDevice');
var Device = require('./DevicesClass/Device');
var MyBusController = require('./MyBusController');
/**
 * Created by michal on 2014-12-20.
 */

// Start MyBus
Device.MyBusController = new MyBusController();


/**
 *
 * @type {{D10:FirstDevice}}
 */
var Devices = {
    D10: function ()
    {
        var instance = new FirstDevice(10);
        instance.info.InstanceInfo = 'First created device.';
        instance.info.Id = 'D10';
        return instance;
    }()
};


module.exports = Devices;