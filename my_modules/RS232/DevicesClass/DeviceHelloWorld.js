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
var DeviceHelloWorld = function (address)
{

    /**
     * @type {deviceInfo}
     */
    this.info = {
        ClassInfo: 'It is a Class to say hello world to device',
        InstanceInfo: null,
        Id: null,
        Address: address,
        InstanceOf: 'DeviceHelloWorld'
    };

    var _this = this;
    this.__proto__ = Device;

    this.Address = address;
    this.AvailableCommands = {
        CMD_HELLO_WORLD: 200
    };


    /**
     *
     * @param {onCommandExecuted_CMD_HELLO_WORLD} [callback]
     */
    this.CmdHelloWorld = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_HELLO_WORLD);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_HELLO_WORLD);
        });

    };



};


module.exports = DeviceHelloWorld;


/**
 * @callback onCommandExecuted_CMD_HELLO_WORLD
 * @param {boolean} result If command executed successful than true else false
 */

/**
 * @typedef {Object} deviceInfo
 * @property {string} ClassInfo     Info about class
 * @property {string} InstanceInfo  Info about current device
 * @property {string} Id            Id of device
 * @property {number} Address       Address of device
 * @property {string} InstanceOf    Name of class
 */

