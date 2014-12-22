/**
 * Created by michal on 2014-12-20.
 */
var MyBusClass = require('./MyBus').MyBusClass;
var MsgClass = require('./MsgClass');
var MyBusConfig = require('./../../config/MyBusConfig');


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
var Interval = MyBusConfig.RETRANSMISSION_TIMEOUT;

/**
 *
 * @param {onReConnectionOpen} [callback]
 * @constructor
 */
var MyBusController = function (callback)
{
    /**
     * @type {MyBusClass}
     */
    var myBus = null;
    var _this = this;
    var lastInterval;
    var connectionOpened = false;

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
                if(TTL-1 > ToSend.first().ttl) console.log('RETRANSMIT!!');
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
        connectionOpened = true;
        lastInterval = setInterval(tick, Interval);
        if (callback) callback(_this);
    };

    /**
     * @param {MsgClass} msg received message
     */
    var onMessageCome = function (msg)
    {

        if (TTL - ToSend.first().ttl)
        {
            ToSend.shift().callback(msg);
            restartInterval();                                  // <<------
        }
    };

    myBus = new MyBusClass(onConnectionOpen, onMessageCome);

    /**
     *
     * @param msg
     * @param {onResponse} callback
     */
    this.send = function (msg, callback)
    {
        ToSend.push({msg: msg, callback: callback, ttl: TTL});
        if (connectionOpened && emptyTick) restartInterval();
    }

};


module.exports = MyBusController;

/**
 * @callback onResponse
 * @param {MsgClass} msg
 */

/**
 * @callback onReConnectionOpen
 * @param {MyBusController} myBusController contain this MyBusController
 */
