/**
 * Created by michal on 2014-12-21.
 */
var DeviceHelloWorld = require('./DeviceHelloWorld');
var MsgClass = require('./../MsgClass');

/**
 *
 * @param address
 * @constructor FirstDevice
 * @extends Device
 */
function FirstDevice(address)
{


    var _this = this;
    this.__proto__ = new DeviceHelloWorld(address);
    this.constructor = FirstDevice;

    this.info.ClassInfo = 'It is a Class to control two leds';



    this.AvailableCommands.CMD_ENABLE_LED0 = 1;
    this.AvailableCommands.CMD_DISABLE_LED0 = 2;
    this.AvailableCommands.CMD_TOGGLE_LED0 = 3;

    this.AvailableCommands.CMD_GET_PORTB = 10;
    this.AvailableCommands.CMD_SET_PORTB = 11;


    /**
     *
     * @param {onCommandExecuted_CMD_TOGGLE_LED0} [callback]
     */
    this.CmdToggleLed = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_TOGGLE_LED0);
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
        });

    };

    /**
     *
     * @param {onCommandExecuted_CMD_GET_PORTB} [callback]
     */
    this.CmdGetPortB = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_GET_PORTB);
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true, error ? null : msg.data[0]);
            //if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_GET_PORTB, msg ? msg.data[0] : null);
        });

    };

    /**
     * @param {onCommandExecuted_CMD_SET_PORTB} [callback]
     */
    this.CmdSetPortB = function (value, callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_SET_PORTB, [value]);
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
        });

    }


}
//FirstDevice.prototype = new DeviceHelloWorld();

module.exports = FirstDevice;


/**
 * @callback onCommandExecuted_CMD_TOGGLE_LED0
 * @param {boolean} result If command executed successful than true else false
 */

/**
 * @callback onCommandExecuted_CMD_GET_PORTB
 * @param {boolean} result If command executed successful than true else false
 * @param {Number} port Port value
 */

/**
 * @callback onCommandExecuted_CMD_SET_PORTB
 * @param {boolean} result If command executed successful than true else false
 */