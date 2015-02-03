/**
 * Created by michal on 2015-01-26.
 */
var DeviceHelloWorld = require('./DeviceHelloWorld');
var MsgClass = require('./../MsgClass');

//historyOfPeopleSensors

/**
 *
 * @param address
 * @constructor FirstDevice
 * @extends Device
 */
function PeopleSensorDevice(address)
{

    var _this = this;
    this.__proto__ = new DeviceHelloWorld(address);
    this.constructor = PeopleSensorDevice;

    this.info.ClassInfo = 'It is a Class to control two leds';





    this.AvailableCommands.CMD_GET_COUNTER = 1;
    this.AvailableCommands.CMD_GET_64b_COUNTER = 2;


    /**
     *
     * @param {onCommandExecuted_CMD_GET_COUNTER} [callback]
     */
    this.CmdGetCounter8b = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_GET_COUNTER);
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true, error ? null : msg.data[0]);
        });

    };

    /**
     *
     * @param {onCommandExecuted_CMD_GET_64b_COUNTER} [callback]
     */
    this.CmdGetCounter = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_GET_64b_COUNTER);
        this.MyBusController.send(msg, function (error, msg)
        {
            var unsignedLong = null;
            if (!error)
            {
                unsignedLong = 0;
                for (var i = 0; i < 8; i++) unsignedLong += msg.data[i] * (Math.pow(256, i));
            }

            if (callback) callback(error ? false : true, error ? null : unsignedLong);
        });

    };

}
//PeopleSensorDevice.prototype = new DeviceHelloWorld();


module.exports = PeopleSensorDevice;


/**
 * @callback onCommandExecuted_CMD_GET_COUNTER
 * @param {boolean} result If command executed successful than true else false
 * @param {Number} counter Value of counter (uint8_t)
 */
/**
 * @callback onCommandExecuted_CMD_GET_64b_COUNTER
 * @param {boolean} result If command executed successful than true else false
 * @param {Number} counter Value of counter (uint64_t)
 */