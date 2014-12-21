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
 * @type {{D10: {Description: string, Instance: FirstDevice}}}
 */
var Devices = {
    D10: {
        Description: 'First created device.',
        Instance: new FirstDevice(10)
    }
};



module.exports = Devices;