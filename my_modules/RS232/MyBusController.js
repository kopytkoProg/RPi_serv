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
        lastTimeout = setTimeout(function ()
        {
            tick();
            console.log("NoResponseTimeout")
        }, Interval);
    };

    var stopWaitingForResponse = function ()
    {
        if (lastTimeout) clearTimeout(lastTimeout);
        waitingForResponse = false;
    };

    /**
     * This object is responsible for creating delay between each bus activity.
     * @type {{silenceTimeOnBuss: number, lastBussActive: number, transmissionDelayTimeoutId: number, transmissionTimeUpdate: Function, tickOnNextInterval: Function}}
     */
    var bs = {
        silenceTimeOnBuss: MyBusConfig.SILENCE_TIME,
        lastBussActive: 0,
        transmissionDelayTimeoutId: 0,

        /**
         * Must be called right next to each bus activity.
         */
        transmissionTimeUpdate: function ()
        {
            this.lastBussActive = (new Date).getTime();
            //console.log('transmissionTimeUpdate', this.lastBussActive);
        },

        /**
         * It is should be called instead of tick()
         */
        tickOnNextInterval: function ()
        {
            if (this.transmissionDelayTimeoutId) clearTimeout(this.transmissionDelayTimeoutId);
            var t = (new Date).getTime();
            var i = ( t - this.lastBussActive >= this.silenceTimeOnBuss ? 0 : this.silenceTimeOnBuss - (t - this.lastBussActive));
            this.transmissionDelayTimeoutId = setTimeout(tick, i);
            //console.log('tickOnNextInterval', i);
        }
    };

    var tick = function ()
    {

        if (ToSend.length)
        {

            if (--ToSend.first().ttl)
            {
                if (MessageFilter.canSendMessage(ToSend.first().msg.address))
                {
                    waitingForResponse = true;

                    myBus.write(ToSend.first().msg, function ()
                    {
                        bs.transmissionTimeUpdate();
                        startWaitingForResponse();

                    });

                    if (TTL - 1 > ToSend.first().ttl) console.log('RETRANSMIT !! ' + ToSend.first().msg.address);

                }
                else
                {
                    console.log('Fail to send because address is disconnected', ToSend[0].msg);
                    ToSend.shift().callback('Fail to send because address is disconnected');
                    bs.tickOnNextInterval();//tick();
                }
            }
            else
            {
                stopWaitingForResponse();
                MessageFilter.setAsDisconnected(ToSend[0].msg.address, 1000 * 60 /*1 min*/);
                console.log('Fail to send', ToSend[0].msg);
                ToSend.shift().callback("Fail to send", null);
                bs.tickOnNextInterval();//tick();
            }
        }
        //else emptyTick = true;                  // it can provide errors because sometimes no interval between requests
    };

    var onConnectionOpen = function ()
    {
        connectionOpened = true;
        bs.transmissionTimeUpdate();
        bs.tickOnNextInterval();//tick();
        if (callback) callback(_this);
    };

    /**
     * @param {MsgClass} msg received message
     */
    var onMessageCome = function (msg)
    {
        //console.log(msg);
        bs.transmissionTimeUpdate();
        if (ToSend.length)
        {
            var first = ToSend.first();
            MessageFilter.setAsConnected(first.msg.address);
            ToSend.shift().callback(msg.command == first.msg.command ? null : "Command received is not equal to sent", msg);
            stopWaitingForResponse();
            bs.tickOnNextInterval();//tick();
        }
        else
        {
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
        if (connectionOpened && !waitingForResponse)  bs.tickOnNextInterval();//tick();
    }

};


module.exports = MyBusController;

/**
 * @callback onResponse
 * @param  error
 * @param {MsgClass} msg
 */

/**
 * @callback onReConnectionOpen
 * @param {MyBusController} myBusController contain this MyBusController
 */
