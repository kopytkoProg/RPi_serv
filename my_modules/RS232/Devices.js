/**
 * Created by michal on 2014-12-20.
 */


var Devices = {
    D10: {
        Address: 10,
        Description: 'First created device.',
        AvailableCommands: {
            CMD_ENABLE_LED0: 1,
            CMD_DISABLE_LED0: 2,
            CMD_TOGGLE_LED0: 3
        }
    }
};


module.exports = Devices;