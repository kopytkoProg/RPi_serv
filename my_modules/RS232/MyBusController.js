/**
 * Created by michal on 2014-12-20.
 */
var MyBusClass = require('./MyBus').MyBusClass;
var MsgClass = require('./MsgClass');
var MyBusConfig = require('./../../config/MyBusConfig');
var MessageFilter = require('./MessageFilter');


Array.prototype.first = function ()
{
    return this[0]
};


// var ToReceive = [];
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
    // var lastInterval;
    var connectionOpened = false;


    var waitingForResponse = false;
    var lastTimeout = null;

    var startWaitingForResponse = function ()
    {
        waitingForResponse = true;
        if (lastTimeout) clearTimeout(lastTimeout);
        lastTimeout = setTimeout(tick, Interval);
    };

    var stopWaitingForResponse = function ()
    {
        if (lastTimeout) clearTimeout(lastTimeout);
        waitingForResponse = false;
    };

    var tick = function ()
    {


        if (ToSend.length)
        {

            if (--ToSend.first().ttl)
            {
                if (MessageFilter.canSendMessage(ToSend.first().msg.address))
                {
                    //waitingForResponse = true;
                    startWaitingForResponse();

                    myBus.write(ToSend.first().msg);

                    if (TTL - 1 > ToSend.first().ttl) console.log('RETRANSMIT !! ' + ToSend.first().msg.address);

                }
                else
                {
                    console.log('Fail to send because address is disconnected', ToSend[0].msg);
                    ToSend.shift().callback(null);
                    tick();
                }
            }
            else
            {
                stopWaitingForResponse();
                MessageFilter.setAsDisconnected(ToSend[0].msg.address, 1000 * 60 /*1 min*/);
                console.log('Fail to send', ToSend[0].msg);
                ToSend.shift().callback(null);
                tick();
            }
        }
        //else emptyTick = true;                  // it can provide errors because sometimes no interval between requests
    };

    var onConnectionOpen = function ()
    {
        connectionOpened = true;
        tick();
        if (callback) callback(_this);
    };

    /**
     * @param {MsgClass} msg received message
     */
    var onMessageCome = function (msg)
    {
        //console.log(msg);

        if (ToSend.length)
        {
            MessageFilter.setAsConnected(ToSend.first().msg.address);
            ToSend.shift().callback(msg);
            stopWaitingForResponse();
            tick();
        }else{
            console.log('Iam not waiting for msg but i received:', msg);
        }
    };

    myBus = new MyBusClass(onConnectionOpen, onMessageCome);

    /**
     * @param msg
     * @param {onResponse} callback
     */
    this.send = function (msg, callback)
    {
        ToSend.push({msg: msg, callback: callback, ttl: TTL});
        if (connectionOpened && !waitingForResponse) tick();
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
