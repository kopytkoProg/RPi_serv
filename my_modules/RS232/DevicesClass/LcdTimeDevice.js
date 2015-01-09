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
var LcdTimeDevice = function (address)
{

    this.__proto__ = new LcdDevice(address);
    var _this = this;

    /**
     * Device description
     * @type {{ClassInfo: string, InstanceInfo: null, Id: null}}
     */
    this.info = {
        ClassInfo: 'It is a Class to display time',
        InstanceInfo: null,
        Id: null,
        Address: address,
        InstanceOf: 'LcdDevice'
    };


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
        return (1000 ) - (now % (1000 ));
    };

    var everyMinute = function ()
    {
        _this.CmdPrintActualTime();
        setTimeout(everyMinute, msToNextMinute());
    };
    everyMinute();
    setTimeout(everyMinute, msToNextMinute());

};


module.exports = LcdTimeDevice;


