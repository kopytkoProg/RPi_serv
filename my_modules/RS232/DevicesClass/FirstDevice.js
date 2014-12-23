/**
 * Created by michal on 2014-12-21.
 */
var Device = require('./Device');
var MsgClass = require('./../MsgClass');

/**
 *
 * @param address
 * @constructor FirstDevice
 * @extends Device
 */
var FirstDevice = function (address)
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
    this.__proto__ = Device;

    this.Address = address;
    this.AvailableCommands = {
        CMD_ENABLE_LED0: 1,
        CMD_DISABLE_LED0: 2,
        CMD_TOGGLE_LED0: 3,

        CMD_GET_PORTB: 10,
        CMD_SET_PORTB: 11
    };

    /**
     *
     * @param {onCommandExecuted_CMD_TOGGLE_LED0} [callback]
     */
    this.CmdToggleLed = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_TOGGLE_LED0);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_TOGGLE_LED0);
        });

    };

    /**
     *
     * @param {onCommandExecuted_CMD_GET_PORTB} [callback]
     */
    this.CmdGetPortB = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_GET_PORTB);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_GET_PORTB, msg ? msg.data[0] : null);
        });

    };

    /**
     * @param {onCommandExecuted_CMD_SET_PORTB} [callback]
     */
    this.CmdSetPortB = function (value, callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_SET_PORTB, [value]);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_SET_PORTB);
        });

    }

};


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