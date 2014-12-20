/**
 * Created by michal on 2014-12-20.
 */
var MyBusClass = require('./MyBus').MyBusClass;
var MsgClass = require('./MyBus').MsgClass;
var Devices = require('./Devices');
Array.prototype.first = function ()
{
    return this[0]
};


var ToReceive = [];
/**
 *
 * @type {Array.<{msg:MsgClass, callback:Function, ttl:Number}>}
 */
var ToSend = [];
var TTL = 4;
var Interval = 100;

var MyBusController = function (callback)
{
    /**
     * @type {MyBusClass}
     */
    var myBus = null;

    var lastInterval;

    var restartInterval = function ()
    {
        tick();
        clearInterval(lastInterval);
        lastInterval = setInterval(tick, Interval);
    };

    var emptyTick = false;
    var tick = function ()
    {
        emptyTick = false;
        if (ToSend.length)
        {
            if (--ToSend.first().ttl)
            {
                myBus.write(ToSend.first().msg);
            }
            else
            {
                restartInterval();
                console.log('Fail to send', ToSend[0].msg);
                ToSend.shift().callback(null);
            }
        }
        else emptyTick = true;
    };

    var onConnectionOpen = function ()
    {
        lastInterval = setInterval(tick, Interval);
        callback();
    };

    /**
     * @param {MsgClass} msg received message
     */
    var onMessageCome = function (msg)
    {
        if (TTL - ToSend.first().ttl)
        {
            ToSend.shift().callback(ToReceive.shift());
            restartInterval();                                  // <<------
        }
    };

    myBus = new MyBusClass(onConnectionOpen, onMessageCome);

    this.send = function (msg, callback)
    {
        ToSend.push({msg: msg, callback: callback, ttl: TTL});
        if (emptyTick) restartInterval();
    }

};


var c = new MyBusController(function f()
{

        c.send(new MsgClass(Devices.D10.Address, Devices.D10.AvailableCommands.CMD_TOGGLE_LED0), function (m)
        {
            f();
        })
});


