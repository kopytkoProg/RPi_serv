/**
 * Created by michal on 2014-12-21.
 */
var FirstDevice = require('./FirstDevice');
var MsgClass = require('./../MsgClass');

/**
 *
 * @param address
 * @constructor FirstDevice
 * @extends FirstDevice
 */
var LcdDevice = function (address)
{

    this.__proto__ = new FirstDevice(address);
    var _this = this;

    /**
     * Device description
     * @type {{ClassInfo: string, InstanceInfo: null, Id: null}}
     */
    this.info = {
        ClassInfo: 'It is a Class to control two leds',
        InstanceInfo: null,
        Id: null,
        Address: address,
        InstanceOf: 'LcdDevice'
    };


    this.AvailableCommands.CMD_LCD_WRITE_CHARACTERS = 20;		// Characters
    this.AvailableCommands.CMD_LCD_CLEAR = 21;	                // No data
    this.AvailableCommands.CMD_LCD_HOME = 22;	                // No data
    this.AvailableCommands.CMD_LCD_GoTo = 23;	                // x, y



    /**
     * @param {string} text
     * @param {onCommandExecuted_CMD_LCD_WRITE_CHARACTERS} [callback]
     */
    this.CmdPrint = function (text, callback)
    {
        var charArray = text.split('');
        var asciiCharArray = charArray.reduce(function (acc, e)
        {
            acc.push(e.charCodeAt(0));
            return acc;
        }, []);

        //console.log('=============',asciiCharArray);
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_WRITE_CHARACTERS, asciiCharArray);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_SET_PORTB);
        });
    };

    /**
     *
     * @param {onCommandExecuted_CMD_LCD_HOME} [callback]
     */
    this.CmdHome = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_HOME);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_SET_PORTB);
        });

    };

    /**
     *
     * @param {onCommandExecuted_CMD_LCD_CLEAR} [callback]
     */
    this.CmdClear = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_CLEAR);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_SET_PORTB);
        });

    };

    /**
     * Set lcd cursor position
     * Max x and y depend on display size
     * @param {Number} y
     * @param {Number} y
     * @param {onCommandExecuted_CMD_LCD_GoTo} [callback]
     */
    this.CmdGoTo = function (x, y, callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_GoTo, [x, y]);
        this.MyBusController.send(msg, function (msg)
        {
            if (callback) callback(msg && msg.command == _this.AvailableCommands.CMD_SET_PORTB);
        });

    }
};


module.exports = LcdDevice;


/**
 * @callback onCommandExecuted_CMD_LCD_WRITE_CHARACTERS
 * @param {boolean} result If command executed successful than true else false
 */

/**
 * @callback onCommandExecuted_CMD_LCD_CLEAR
 * @param {boolean} result If command executed successful than true else false
 */

/**
 * @callback onCommandExecuted_CMD_LCD_HOME
 * @param {boolean} result If command executed successful than true else false
 */

/**
 * @callback onCommandExecuted_CMD_LCD_GoTo
 * @param {boolean} result If command executed successful than true else false
 */

