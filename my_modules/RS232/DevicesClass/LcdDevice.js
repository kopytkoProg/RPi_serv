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
function LcdDevice (address)
{

    var _this = this;
    this.__proto__ = new FirstDevice(address);
    this.constructor = LcdDevice;


    this.info.ClassInfo = 'It is a Class to control 16x2 lcd';


    this.AvailableCommands.CMD_LCD_WRITE_CHARACTERS = 20;		            // Characters
    this.AvailableCommands.CMD_LCD_CLEAR = 21;	                            // No data
    this.AvailableCommands.CMD_LCD_HOME = 22;	                            // No data
    this.AvailableCommands.CMD_LCD_GoTo = 23;	                            // x, y
    this.AvailableCommands.CMD_LCD_WRITE_CHARACTERS_HOME_LINE_WRAPE = 24;

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
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
        });
    };

    /**
     *
     * @param {onCommandExecuted_CMD_LCD_HOME} [callback]
     */
    this.CmdHome = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_HOME);
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
        });

    };

    /**
     *
     * @param {onCommandExecuted_CMD_LCD_CLEAR} [callback]
     */
    this.CmdClear = function (callback)
    {
        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_CLEAR);
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
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
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
        });

    };

    var num = [
        0, 1, 2, 3, 4, 5,		//	0x30	0
        32, 1, 2, 32, 32, 5,		//	0x31	1
        6, 6, 2, 3, 7, 7,		//	0x32	2
        6, 6, 2, 7, 7, 5,		//	0x33	3
        3, 4, 2, 32, 32, 5,		//	0x34	4
        255, 6, 6, 7, 7, 5,		//	0x35	5
        0, 6, 6, 3, 7, 5,		//	0x36	6
        1, 1, 2, 32, 0, 32,		//	0x37	7
        0, 6, 2, 3, 7, 5,		//	0x38	8
        0, 6, 2, 32, 32, 5,		//	0x39	9
    ];


    /**
     * @param {Array.<Number>} hour 4 element in array
     * @param {onCommandExecuted_CMD_LCD_WRITE_CHARACTERS_HOME_LINE_WRAPE} [callback]
     */
    this.CmdPrintBigTime = function (hour, callback)
    {
        if (hour.length != 4) throw 'Only 4 item in array!';

        var top = hour.reduce(function (acc, e, i)
        {
            return acc.concat(num.slice(e * 6, e * 6 + 3)).concat([i == 1 ? 161 : 32]);
        }, []);

        var bottom = hour.reduce(function (acc, e, i)
        {
            return acc.concat(num.slice(e * 6 + 3, e * 6 + 6)).concat([i == 1 ? 161 : 32]);
        }, []);


        var msg = new MsgClass(this.Address, _this.AvailableCommands.CMD_LCD_WRITE_CHARACTERS_HOME_LINE_WRAPE, top.concat(bottom));
        this.MyBusController.send(msg, function (error, msg)
        {
            if (callback) callback(error ? false : true);
        });
    };


}
//LcdDevice.prototype = new FirstDevice();

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

/**
 * @callback onCommandExecuted_CMD_LCD_WRITE_CHARACTERS_HOME_LINE_WRAPE
 * @param {boolean} result If command executed successful than true else false
 */
