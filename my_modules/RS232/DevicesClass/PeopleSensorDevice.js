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
var PeopleSensorDevice = function (address)
{
    /**
     * Device description
     * @type {{ClassInfo: string, InstanceInfo: null, Id: null}}
     */

    this.info = {
        ClassInfo: 'It is a Class to control two leds',
        InstanceInfo: null,
        Id: null,
        Address: address,
        InstanceOf: 'FirstDevice'
    };

    var _this = this;
    this.__proto__ = new DeviceHelloWorld();

    this.Address = address;

    this.AvailableCommands.CMD_GET_COUNTER = 1;
    this.AvailableCommands.CMD_GET_64b_COUNTER = 2;


    /**
     *
     * @param {onCommandExecuted_CMD_GET_COUNTER} [callback]
     */
    this.CmdGetCounter8b = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_GET_COUNTER);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_GET_COUNTER, msg ? msg.data[0] : null);
        });

    };

    /**
     *
     * @param {onCommandExecuted_CMD_GET_64b_COUNTER} [callback]
     */
    this.CmdGetCounter = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_GET_64b_COUNTER);
        this.MyBusController.send(msg, function (msg)
        {
            var unsignedLong = null;
            if (msg && msg.command == _this.AvailableCommands.CMD_GET_64b_COUNTER)
            {
                unsignedLong = 0;
                for (var i = 0; i < 8; i++) unsignedLong += msg.data[i] * (Math.pow(256, i));
            }

            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_GET_64b_COUNTER, msg ? unsignedLong : null);
        });

    };

};


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