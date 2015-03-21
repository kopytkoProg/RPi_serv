/**
 * Created by michal on 2014-12-21.
 */
var os = require("os");
os.hostname();


var MyBusConfig = {
    MY_ADDRESS: 1,
    SERIAL_DEVICE: os.platform() == 'linux' ? '/dev/ttyAMA0' : 'COM3',
    RECEIVING_TIMEOUT: 500,                 // [ms] it is the max time between parts of message
    RETRANSMISSION_TIMEOUT: 500 * 2,        // [ms] it is the time between send message and receive response (if no response while TRANSMISSION_TIMEOUT retransmission)
    SILENCE_TIME: 10                        // [ms] it is silence time between each transmission
};

module.exports = MyBusConfig;