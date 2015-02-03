/**
 * Created by michal on 2015-01-02.
 */
var LcdDevice = require('./LcdDevice');
var MsgClass = require('./../MsgClass');

/**
 *
 * @param address
 * @constructor FirstDevice
 * @extends LcdDevice
 */
function LcdTimeDevice(address)
{

    var _this = this;
    this.__proto__ = new LcdDevice(address);
    this.constructor = LcdTimeDevice;


    this.info.ClassInfo = 'It is a Class to display time';



    var dateToNumberTimeArray = function (date){

        var hours = date.getHours() + '';
        var minutes = date.getMinutes() + '';

        if (hours.length == 1) hours = '0' + hours;
        if (minutes.length == 1) minutes = '0' + minutes;

        var hoursNumbers = hours.split('').reduce(function (acc, e)
        {
            acc.push(parseInt(e));
            return acc;
        }, []);
        var minutesNumbers =  minutes.split('').reduce(function (acc, e)
        {
            acc.push(parseInt(e));
            return acc;
        }, []);

        return hoursNumbers.concat(minutesNumbers);
    };

    this.CmdPrintActualTime = function ()
    {
        _this.CmdPrintBigTime(dateToNumberTimeArray(new Date()));
    };


    var msToNextMinute = function ()
    {
        var now = new Date().getTime();
        return (1000 * 60) - (now % (1000 * 60));
    };

    var everyMinute = function ()
    {
        _this.CmdPrintActualTime();
        setTimeout(everyMinute, msToNextMinute());
    };
    everyMinute();
    //setTimeout(everyMinute, msToNextMinute());

}
//LcdTimeDevice.prototype = new LcdDevice();

module.exports = LcdTimeDevice;


